import { CommonObject } from "@ihaz/js-ui-utils";
import CacheManager from "../../manager";
import {
  CacheConfig,
  CacheResource,
  CacheResourceInternals,
  FunctionCacheAction,
  ICacheResource,
  Resource,
  ResourceCacheAction,
} from "../../types";
import { EMPTY_FUNCTION_CACHE } from "./context";
import { cacheCall } from "./func";

function getFuncCacheDispatch<T>(
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

function cacheResourceFuncs<T extends Resource<string>>(
  get: () => CacheResource<T>,
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

        const cache = get();

        const fCache = ((usarCache && cache[key]) || EMPTY_FUNCTION_CACHE)!;
        const fDispatch = getFuncCacheDispatch(
          dispatch,
          key as string,
          !usarCache
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
        ) as T;
      }
  );

  return ret as any as T;
}

export default function createCacheSyncImpl(cacheManager: CacheManager) {
  return <T extends Resource<string>, TName extends string>(
    name: TName,
    resource: T,
    config: CacheConfig<Extract<keyof T, string>>
  ): ICacheResource<T, TName> => {
    if (config)
      cacheManager.setResourceConfig(
        name,
        CommonObject.Pick(config, "externalStorage")
      );

    const getResource: CacheResourceInternals<T>["getResource"] = () => {
      return cacheManager.getCache(name);
    };

    const clearResource: CacheResourceInternals<T>["clearResource"] = (
      clean
    ) => {
      cacheManager.dispatch({
        type: "clearRec",
        payload: {
          clean,
          resource: name,
        },
      });
    };

    const dispatchResource = (
      ac: ResourceCacheAction<Extract<keyof T, string>>
    ) => {
      if (ac.type == "clear") {
        clearResource(ac.payload.clean);
        return;
      }
      cacheManager.dispatch({
        type: "resource",
        payload: {
          resource: name,
          action: ac,
        },
      });
    };

    const retResource = cacheResourceFuncs(
      getResource,
      dispatchResource,
      resource,
      config
    );

    return {
      name,
      resources: retResource,
      _internals_: {
        getResource,
        clearResource,
      },
    };
  };
}
