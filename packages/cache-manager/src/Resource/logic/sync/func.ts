import { CommonObject, Validation } from "@ihaz/js-ui-utils";
import {
  CacheEntry,
  CachePayload,
  CacheResourceConfig,
  FunctionCache,
  FunctionCacheAction,
  JSONValue,
} from "../../types";

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
  dispatch: (ac: FunctionCacheAction) => void,
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
          dispatch({
            type: "resolvePromise",
            payload: {
              id: newEntry.id,
              value: syncValue,
            },
          });

          return syncValue;
        } catch (error) {
          dispatch({
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
