import { CacheConfigSingle, ResourceFunction, ResourceFunctionContext } from "@cache/Resource/types";
import { Keys } from "@cache/shared/types";

export type SingleCacheDictionaryResult = <T extends ResourceFunction>(resource: T, config: CacheConfigSingle) => ResourceFunctionContext<T>;

export enum SINGLE_CACHE_STATUS {
    INIT,
    TERMINATED,
    ERROR
}

export type SingleCacheManager = WeakMap<Function, SingleCacheResult<never>>;

export interface SingleCacheResult<T extends ResourceFunction> {
    value: ReturnType<T> | null;
    status: SINGLE_CACHE_STATUS;
    args: {
        primitives: Map<Keys, SingleCacheResult<T>> | null,
        objects: WeakMap<Function | Object, SingleCacheResult<T>> | null
    }
  }