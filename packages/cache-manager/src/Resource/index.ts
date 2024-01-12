import CacheManager from "./logic/store/manager";
import createCacheSyncImpl from "./logic/store";
import createExternalCacheImpl from "./logic/external";

namespace CacheResource {
  let cacheManager: CacheManager;

  const getManager = (): CacheManager => {
    if (!cacheManager) {
      cacheManager = new CacheManager();
    }
    return cacheManager;
  };

  /**Create a resource collection which store the result of every
   * method in cache memory, and all stored result can be returned if
   * all the Parameter's value are the same that the previous resource call,
   * otherwise, the cache will clean and will resolve once again the original
   * method.
   */
  export const createCache: ReturnType<typeof createCacheSyncImpl> = (
    name,
    resource,
    config
  ) => {
    return createCacheSyncImpl(getManager())(name, resource, config);
  };

  /**Create a resource collection which store the result of every
   * method in external store resources, and all stored result can be returned if
   * all the Parameter's value are the same that the previous resource call,
   * otherwise, the cache will clean and will resolve once again the original
   * method.
   */
  export const createExternalCache: typeof createExternalCacheImpl = (
    name,
    resource,
    config
  ) => {
    return createExternalCacheImpl(name, resource, config);
  };
}

export default CacheResource;
