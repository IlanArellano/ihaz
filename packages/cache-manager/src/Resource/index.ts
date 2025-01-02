import createCacheSyncImpl from "./logic/store";
import createExternalCacheImpl from "./logic/external";
import { clearSingleCacheImpl, createSingleCacheImpl } from "./logic/single";
import type { CacheConfigSingle, ResourceFunction } from "./types";

namespace CacheResource {
  /**Create a single cache function where the result is stored in memory */
  export const cache = <T extends ResourceFunction>(
    fn: T,
    config?: CacheConfigSingle
  ): T => {
    return createSingleCacheImpl(fn, config);
  };

  /**Clear a single cache function created by `cache` method, return `true` if function resource was
   * cleared successfully, otherwise return `false`
   */
  export const clear = <T extends ResourceFunction>(fn: T): boolean => {
    return clearSingleCacheImpl(fn);
  };

  /**Create a resource collection which store the result of every
   * method in cache memory, and all stored result can be returned if
   * all the Parameter's value are the same that the previous resource call,
   * otherwise, the cache will clean and will resolve once again the original
   * method.
   */
  export const createCacheResources: typeof createCacheSyncImpl = (
    name,
    resource,
    config
  ) => {
    return createCacheSyncImpl(name, resource, config);
  };

  /**Create a resource collection which store the result of every
   * method in external store resources, and all stored result can be returned if
   * all the Parameter's value are the same that the previous resource call,
   * otherwise, the cache will clean and will resolve once again the original
   * method.
   */
  export const createExternalCacheResources: typeof createExternalCacheImpl = (
    name,
    resource,
    config
  ) => {
    return createExternalCacheImpl(name, resource, config);
  };
}

export default CacheResource;
