import {
  CacheConfig,
  ICacheResourceAsync,
  Resource,
} from "@cache/Resource/types";

export default function createExternalCacheImpl<
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  config: CacheConfig<Extract<keyof T, string>>
): ICacheResourceAsync<T, TName> {}
