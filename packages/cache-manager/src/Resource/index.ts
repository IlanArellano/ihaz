import CacheManager from "./manager";
import createCacheSyncImpl from "./logic/sync";
import createExternalCacheImpl from "./logic/async";

namespace CacheResource {
  let cacheManager: CacheManager;

  const getManager = (): CacheManager => {
    if (!cacheManager) {
      cacheManager = new CacheManager();
    }
    return cacheManager;
  };

  export const createCache: ReturnType<typeof createCacheSyncImpl> = (
    name,
    resource,
    config
  ) => {
    return createCacheSyncImpl(getManager())(name, resource, config);
  };

  export const createExternalCache: typeof createExternalCacheImpl = (
    name,
    resource,
    config
  ) => {
    return createExternalCacheImpl(name, resource, config);
  };
}

export default CacheResource;
