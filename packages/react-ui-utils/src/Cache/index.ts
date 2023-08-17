import {
  AppCacheAction,
  CacheConfig,
  CacheState,
  NamedResource,
  Resource,
} from "@utils/types/Cache";
import CacheManager from "./cacheManager";
import { addCacheResource } from "./logic";

type CacheResourceFuncWithInstance = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  resourceConf: CacheConfig<Extract<keyof T, string>>
) => NamedResource<T, TName>;

interface ICacheResourceUncontrolled {
  key: string;
  createCache: CacheResourceFuncWithInstance;
  getCacheStore: () => CacheState;
  clearCache: () => void;
}

interface CacheManagers {
  key: string;
  manager: CacheManager;
}

export namespace CacheResource {
  const CACHE_KEY = "_cache_manager_";
  let CACHE_INDEX = 0;
  const managers: CacheManagers[] = [];

  const generateKey = () => `${CACHE_KEY}${CACHE_INDEX++}`;

  const CACHE_CLEAR: AppCacheAction = {
    type: "clearRec",
    payload: { resource: "" },
  };

  /**Clear all Cache by the key of any `Resource Managers` created by `createCacheResources` method */
  export const clearCacheByResource = (key: string) => {
    const findManager = managers.find((x) => x.key === key);
    if (!findManager) return;
    findManager.manager.dispatch(CACHE_CLEAR);
  };

  /**Creates a enviroment that can set a method's collection */
  export const createCacheResources = (): ICacheResourceUncontrolled => {
    const key = generateKey();
    const cacheManager = new CacheManager();

    managers.push({
      key,
      manager: cacheManager,
    });

    const internalClearCache = () => {
      cacheManager.dispatch(CACHE_CLEAR);
    };

    return {
      createCache: addCacheResource(cacheManager),
      key,
      getCacheStore: cacheManager.getStore.bind(cacheManager),
      clearCache: internalClearCache,
    };
  };

  /**Remove the Cache for all the store from `Resource Managers` created */
  export const clearAllCache = () => {
    managers.forEach((x) => {
      x.manager.dispatch(CACHE_CLEAR);
    });
  };
}
