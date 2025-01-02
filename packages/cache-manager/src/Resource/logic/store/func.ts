import CommonObject from "@jsUtils/namespaces/object";
import {
  CacheConfig,
  CacheStateProps,
  Resource,
  ResourceCacheAction,
} from "@cache/Resource/types";
import {
  cacheCall,
  EMPTY_FUNCTION_CACHE,
  getFuncCacheDispatch,
} from "../context";

export default function cacheResourceFuncs<T extends Resource<string>>(
  get: () => CacheStateProps<T>,
  dispatch: (action: ResourceCacheAction<Extract<keyof T, string>>) => void,
  resource: T,
  resourceConf?: CacheConfig<Extract<keyof T, string>>
): T {
  const cacheKeys = (resourceConf && resourceConf.cache) || [];
  const clearKeys = (resourceConf && resourceConf.clear) || [];
  const ret = CommonObject.mapObject(
    resource,
    (func, key) =>
      (...args: any[]): any => {
        const usarCache = cacheKeys.some((x) => (x as string) === key);
        const clean = clearKeys.find((x) => {
          return typeof x === "string"
            ? (x as keyof T) === key
            : (x.key as keyof T) === key;
        });

        const onClear = () => {
          if (!clean) return;
          dispatch({
            type: "clear",
            payload: {
              clean,
            },
          });
        };

        const cache = get().cache;

        const fCache = ((usarCache && cache[key]) || EMPTY_FUNCTION_CACHE)!;
        const fDispatch = getFuncCacheDispatch(
          dispatch,
          key as string,
          !usarCache
        );

        const storeConfig =
          resourceConf && CommonObject.Omit(resourceConf, "cache", "clear");

        return cacheCall(
          fCache,
          fDispatch,
          func as any,
          args,
          onClear,
          storeConfig
        ) as T;
      }
  );

  return ret as any as T;
}
