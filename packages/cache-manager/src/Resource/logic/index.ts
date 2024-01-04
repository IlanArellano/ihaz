import { CommonObject } from "@ihaz/js-ui-utils";
import CacheManager from "../cacheManager";
import {
  CacheConfig,
  CacheResource,
  FunctionCacheAction,
  NamedResource,
  Resource,
  ResourceCacheAction,
} from "../types";
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

export const addCacheResource =
  (cacheManager: CacheManager) =>
  <T extends Resource<string>, TName extends string>(
    name: TName,
    resource: T,
    config: CacheConfig<Extract<keyof T, string>>
  ): NamedResource<T, TName> => {
    const getResource = () => {
      const state = cacheManager.getStore();
      return state?.[name]?.cache || {};
    };
    const dispatchResource = (ac: ResourceCacheAction<string>) => {
      if (ac.type == "clear") {
        cacheManager.dispatch({
          type: "clearRec",
          payload: {
            clean: ac.payload.clean,
            resource: name,
          },
        });
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
    };
  };

export function cacheResourceFuncs<T extends Resource<string>>(
  get: () => CacheResource<T>,
  dispatch: (action: ResourceCacheAction<Extract<keyof T, string>>) => void,
  resource: T,
  resourceConf?: CacheConfig<Extract<keyof T, string>>
): T {
  const cacheKeys = (resourceConf && resourceConf.cache) || [];
  const clearKeys = (resourceConf && resourceConf.clear) || [];
  const ret = CommonObject.mapObject(
    resource,
    (value, key) =>
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

        return cacheCall(
          fCache,
          fDispatch,
          value as any,
          args,
          onClear,
          resourceConf
        ) as T;
      }
  );

  return ret as any as T;
}
