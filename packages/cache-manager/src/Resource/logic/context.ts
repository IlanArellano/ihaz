import { CommonObject, Validation } from "@ihaz/js-ui-utils";
import {
  CacheEntry,
  CachePayload,
  CacheResource,
  CacheResourceConfig,
  CacheStateProps,
  FunctionCache,
  FunctionCacheAction,
  JSONValue,
  Resource,
  ResourceCacheAction,
} from "../types";

export const EMPTY_FUNCTION_CACHE: FunctionCache = { entries: [] };

export const ResourceInvariant = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T
) => {
  if (!name) throw new Error("No name resource has been provided");
  if (typeof name !== "string")
    throw new Error(
      `Name params requires a string value but it has been provided ${typeof name} type`
    );
  if (!resource || typeof resource !== "object" || Array.isArray(resource))
    throw new Error(
      `Cache Manager allows only object type as Resource but it has been provided ${
        Array.isArray(resource) ? "array" : typeof resource
      } type`
    );
};

export const clearCacheResource = <T>(
  currCache: CacheResource<T>,
  funcs?: (keyof T)[]
): CacheResource<T> => {
  if (funcs) return mapSelectedCleanResources(currCache, funcs);
  return createEmptyCacheResource();
};

export const cacheReducer = <T>(
  state: CacheResource<T>,
  action: ResourceCacheAction<Extract<keyof T, string>>
): CacheResource<T> => {
  switch (action.type) {
    case "clear":
      return {} as CacheResource<T>;
    case "func":
      return {
        ...state,
        [action.payload.func]: CacheFuncReducer(
          (state[action.payload.func] || {})!,
          action.payload.action
        ),
      };
  }
};

export function getFuncCacheDispatch<T>(
  resourceDispatch: (
    action: ResourceCacheAction<Extract<keyof T, string>>
  ) => void,
  key: string,
  omit: boolean
) {
  return (ac: FunctionCacheAction) => {
    if (omit) return;

    resourceDispatch({
      type: "func",
      payload: {
        func: key as unknown as Extract<keyof T, string>,
        action: ac,
      },
    });
  };
}

export function getExternalFuncCacheDispatch<T>(
  store: CacheStateProps,
  resourceDispatch: (
    store: CacheStateProps<T>,
    ac: ResourceCacheAction<Extract<keyof T, string>>
  ) => Promise<void>,
  key: string,
  omit: boolean
) {
  return async (ac: FunctionCacheAction) => {
    if (omit) return;

    await resourceDispatch(store, {
      type: "func",
      payload: {
        func: key as unknown as Extract<keyof T, string>,
        action: ac,
      },
    });
  };
}

function syncCacheCall(
  cache: FunctionCache,
  func: (...args: JSONValue[]) => CachePayload,
  args: JSONValue[]
): {
  result: CachePayload;
  newEntry: CacheEntry | undefined;
  async: boolean;
} {
  const entry = cache.entries.find((entry) =>
    CommonObject.DeepEqual(entry.args, args)
  );
  const value = entry ? entry.value.payload : func(...args);

  const cached = !!entry;
  const async = entry ? entry.value.async : Validation.isPromiseLike(value);
  const newEntry: CacheEntry | undefined = cached
    ? undefined
    : {
        args: args,
        value: {
          async: async,
          payload: value,
        },
        id: (cache.entries[cache.entries.length - 1]?.id ?? 0) + 1,
      };
  return {
    result: value,
    newEntry: newEntry,
    async: async,
  };
}

export function cacheCall<TFunc extends (...args: any[]) => any>(
  cache: FunctionCache,
  dispatch: (ac: FunctionCacheAction) => void | Promise<void>,
  func: TFunc,
  args: JSONValue[],
  onClear: (() => void) | undefined,
  config?: CacheResourceConfig
): ReturnType<TFunc> {
  const result = syncCacheCall(cache, func, args);

  let newEntry = result.newEntry;

  if (newEntry) {
    dispatch({
      type: "setEntry",
      payload: {
        entry: newEntry,
        config: config || ({} as CacheResourceConfig),
      },
    });

    if (Validation.isPromiseLike(result.result)) {
      const ret = (async () => {
        try {
          const syncValue = (await result.result) as JSONValue;
          await dispatch({
            type: "resolvePromise",
            payload: {
              id: newEntry.id,
              value: syncValue,
            },
          });

          return syncValue;
        } catch (error) {
          await dispatch({
            type: "error",
            payload: { error: error as Error },
          });
          throw error;
        } finally {
          if (result.newEntry) {
            if (onClear) onClear();
          }
        }
      })();

      newEntry = {
        ...newEntry,
        value: {
          async: true,
          payload: ret,
        },
      };
    } else {
      if (onClear) onClear();
    }

    return newEntry.value.payload as any;
  }

  return result.result as any;
}

function errorFunctionCache(err: Error) {
  return {
    entries: [],
    error: err,
  } as FunctionCache;
}

function createEmptyCacheResource<T>() {
  return {} as CacheResource<T>;
}

function mapSelectedCleanResources<T>(
  cache: CacheResource<T>,
  funcs: (keyof T)[]
): CacheResource<T> {
  if (!funcs || !cache) return createEmptyCacheResource();
  return {
    ...cache,
    ...CommonObject.mapObject(CommonObject.Pick(cache, ...funcs), () => ({})),
  };
}

function setCacheEntry(
  cache: FunctionCache,
  config: CacheResourceConfig,
  entry: CacheEntry
): FunctionCache {
  const index = (cache.entries || []).findIndex((x) =>
    CommonObject.DeepEqual(x.args, entry.args)
  );
  if (index !== -1) {
    return {
      entries: cache.entries.map((x, i) => (i === entry.id ? entry : x)),
    };
  }

  const newEntries = [
    entry,
    ...(cache.entries || []).slice(0, (config?.maxSize ?? 1) - 1),
  ];

  return {
    entries: newEntries,
  };
}

function setExistingCacheEntryByIndex(
  cache: FunctionCache,
  index: number,
  getNewEntry: (old: CacheEntry) => CacheEntry
): FunctionCache {
  if (index < 0 || index >= cache.entries.length) {
    throw new Error("Out of range Index");
  }
  return {
    entries: cache.entries.map((x, i) => (i === index ? getNewEntry(x) : x)),
  };
}

function CacheFuncReducer(
  cache: FunctionCache,
  action: FunctionCacheAction
): FunctionCache {
  switch (action.type) {
    case "clear":
      return EMPTY_FUNCTION_CACHE;
    case "error":
      return errorFunctionCache(action.payload.error);
    case "setEntry":
      return setCacheEntry(cache, action.payload.config, action.payload.entry);
    case "resolvePromise":
      return setExistingCacheEntryById(cache, action.payload.id, (x) => ({
        ...x,
        value: {
          ...x.value,
          payload: action.payload.value,
        },
      }));

    default:
      return cache;
  }
}

function setExistingCacheEntryById(
  cache: FunctionCache,
  id: number,
  getNewEntry: (old: CacheEntry) => CacheEntry
): FunctionCache {
  const index = (cache.entries || []).findIndex((x) => x.id === id);
  if (index === -1) return cache;
  return setExistingCacheEntryByIndex(cache, index, getNewEntry);
}
