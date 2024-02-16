import { clearSingleCache } from "./enviroment/clear";
import { createSingleCache } from "./enviroment/create";
import type {
  CacheConfigSingle,
  ResourceFunction,
  ResourceFunctionContext,
} from "@cache/Resource/types";

export const createSingleCacheImpl = <T extends ResourceFunction>(
  fn: T,
  config?: CacheConfigSingle
): ResourceFunctionContext<T> => {
  config = config || {};
  config.environment = config.environment || "hybrid";
  config.clearOnError = config.clearOnError || true;
  return createSingleCache(fn, config);
};

export const clearSingleCacheImpl = <T extends ResourceFunction>(
  fn: T
): boolean => {
  const cacheFn = fn as ResourceFunctionContext<T>;
  if (
    cacheFn._internals_ === undefined ||
    cacheFn._internals_.environment === undefined ||
    cacheFn._internals_.originalFn === undefined
  )
    return false;
  return clearSingleCache(cacheFn);
};
