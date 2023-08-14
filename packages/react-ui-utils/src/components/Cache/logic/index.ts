import { mapObject } from "@utils/common";
import {
  CacheConfig,
  CacheResource,
  CacheResourceConfig,
  FunctionCacheAction,
  NamedResource,
  Resource,
  ResourceCacheAction,
} from "@utils/types/Cache";
import CacheManager from "../cacheManager";
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
    resourceConf: CacheConfig<Extract<keyof T, string>>
  ): NamedResource<T, TName> => {
    const getResource = () => {
      const state = cacheManager.getStore();
      return state?.[name]?.cache || {};
    };
    const depends = resourceConf.depends || [];
    const dispatchResource = (ac: ResourceCacheAction<string>) => {
      if (ac.type == "clear") {
        //Si es limpiar el resource, lanzamos una acción de limpiado recursiva para limpiar este y todos los demás resources
        cacheManager.dispatch({
          type: "clearRec",
          payload: {
            resource: name,
          },
        });
        return;
      }
      cacheManager.dispatch({
        type: "resource",
        payload: {
          resource: name,
          depends: depends,
          action: ac,
        },
      });
    };

    const retResource = cacheResourceFuncs(
      getResource,
      dispatchResource,
      { maxSize: 1 },
      resource,
      resourceConf
    );

    return {
      name,
      funcs: retResource,
      depends,
    };
  };

export function cacheResourceFuncs<T extends Resource<string>>(
  get: () => CacheResource<T>,
  dispatch: (action: ResourceCacheAction<Extract<keyof T, string>>) => void,
  config: CacheResourceConfig,
  resource: T,
  resourceConf?: CacheConfig<Extract<keyof T, string>>
): T {
  const cacheKeys = (resourceConf && resourceConf.cache) || [];
  const clearKeys = (resourceConf && resourceConf.clear) || [];
  const ret = mapObject(resource, (value, key) => (...args: any[]): any => {
    const usarCache = cacheKeys.some((x) => (x as string) === key);
    const limpiar = clearKeys.some((x) => (x as string) === key);

    const onCall = () => {
      if (limpiar) {
        dispatch({ type: "clear", payload: { config: resourceConf || {} } });
      }
    };

    const cache = get();

    //Si no se ocupa usar el cache se realiza la llamada igual pero con un emptyCache y un fDispatch que no hace nada
    const fCache = ((usarCache && cache[key]) || EMPTY_FUNCTION_CACHE)!;
    const fDispatch = getFuncCacheDispatch(dispatch, key as string, !usarCache);

    return cacheCall(
      fCache,
      config,
      fDispatch,
      value as any,
      args,
      onCall
    ) as T;
  });

  return ret as any as T;
}
