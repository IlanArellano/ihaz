import CacheManager from "./cacheManager";
import { addCacheResource } from "./logic";
import type {
  AppCacheAction,
  CacheManagers,
  ICacheResourceUncontrolled,
} from "./types";

namespace CacheResource {
  const CACHE_KEY = "_cache_manager_";
  let CACHE_INDEX = 0;
  const managers: CacheManagers[] = [];

  const generateKey = () => `${CACHE_KEY}${CACHE_INDEX++}`;

  const CACHE_CLEAR: AppCacheAction = {
    type: "clearRec",
    payload: { clean: "", resource: "" },
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

export default CacheResource;
