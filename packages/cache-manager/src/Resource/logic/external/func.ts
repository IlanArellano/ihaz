import CommonObject from "@jsUtils/namespaces/object";
import type {
  CacheConfigAsync,
  CacheStateProps,
  Resource,
  ResourceCacheAction,
  ResourceFuncsAsync,
} from "@cache/Resource/types";
import {
  cacheCall,
  EMPTY_FUNCTION_CACHE,
  getExternalFuncCacheDispatch,
} from "../context";

export default function cacheResourceFuncs<T extends Resource<string>>(
  get: () => Promise<CacheStateProps<T>>,
  dispatch: (
    store: CacheStateProps<T>,
    ac: ResourceCacheAction<Extract<keyof T, string>>
  ) => Promise<void>,
  resource: T,
  resourceConf?: CacheConfigAsync<string, Extract<keyof T, string>>
): ResourceFuncsAsync<T> {
  const cacheKeys = (resourceConf && resourceConf.cache) || [];
  const clearKeys = (resourceConf && resourceConf.clear) || [];

  const ret = CommonObject.mapObject(
    resource,
    (func, key) =>
      async (...args: any[]): Promise<any> => {
        const store = await get();
        const useCache = cacheKeys.some((x) => (x as string) === key);
        const clean = clearKeys.find((x) => {
          return typeof x === "string"
            ? (x as keyof T) === key
            : (x.key as keyof T) === key;
        });

        const onClear = async () => {
          if (!clean) return;
          await dispatch(store, {
            type: "clear",
            payload: {
              clean,
            },
          });
        };

        const fCache = ((useCache && store.cache[key]) ||
          EMPTY_FUNCTION_CACHE)!;
        const fDispatch = getExternalFuncCacheDispatch(
          store,
          dispatch,
          key as string,
          !useCache
        );

        const storeConfig =
          resourceConf &&
          CommonObject.Omit(resourceConf, "cache", "clear", "externalStorage");

        return cacheCall(
          fCache,
          fDispatch,
          func as any,
          args,
          onClear,
          storeConfig
        ) as ResourceFuncsAsync<T>;
      }
  );

  return ret as any as ResourceFuncsAsync<T>;
}
