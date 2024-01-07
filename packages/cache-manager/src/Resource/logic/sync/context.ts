import { CommonObject } from "@ihaz/js-ui-utils";
import {
  AppCacheAction,
  CacheEntry,
  CacheResource,
  CacheResourceConfig,
  CacheState,
  FunctionCache,
  FunctionCacheAction,
  ResourceCacheAction,
} from "../../types";

export const EMPTY_FUNCTION_CACHE: FunctionCache = { entries: [] };

const CACHE_INITIAL = {} as CacheState;

export const errorFunctionCache: (err: Error) => FunctionCache = (err) => ({
  entries: [],
  error: err,
});

export function setCacheEntry(
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

export function CacheFuncReducer(
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

export function setExistingCacheEntryById(
  cache: FunctionCache,
  id: number,
  getNewEntry: (old: CacheEntry) => CacheEntry
): FunctionCache {
  const index = (cache.entries || []).findIndex((x) => x.id === id);
  if (index === -1) return cache;
  return setExistingCacheEntryByIndex(cache, index, getNewEntry);
}

export const mapSelectedCleanResources = (
  keys: string[],
  cache?: CacheResource<any>
): CacheResource<any> => {
  if (!keys || !cache) return {};
  return CommonObject.mapObject(
    CommonObject.Pick(cache, ...keys),
    () => ({})
  ) as CacheResource<any>;
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

export const reducer = (
  stateCache: CacheState,
  action: AppCacheAction
): CacheState => {
  switch (action.type) {
    case "clearRec":
      return CACHE_INITIAL;
    case "resource":
      return {
        ...stateCache,
        [action.payload.resource]: {
          cache: cacheReducer<any>(
            stateCache[action.payload.resource]?.cache ||
              ({} as CacheResource<{}>),
            action.payload.action
          ),
        },
      };
    default:
      return stateCache;
  }
};
