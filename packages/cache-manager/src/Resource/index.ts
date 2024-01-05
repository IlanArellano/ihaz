import CacheManager from "./cacheManager";
import { createCacheImpl } from "./logic";

namespace CacheResource {
  const CACHE_KEY = "_cache_manager_";
  let CACHE_INDEX = 0;
  let cacheManager: CacheManager;

  const getManager = (): CacheManager => {
    if (!cacheManager) {
      cacheManager = new CacheManager();
    }
    return cacheManager;
  };

  const generateKey = () => `${CACHE_KEY}${CACHE_INDEX++}`;

  export const createCache: ReturnType<typeof createCacheImpl> = (
    name,
    resource,
    config
  ) => {
    return createCacheImpl(getManager(), generateKey())(name, resource, config);
  };
}

export default CacheResource;
