import CacheManager from "./manager";
import type {
  CacheConfig,
  CacheResourceInternals,
  ICacheResource,
  Resource,
  ResourceCacheAction,
} from "../../types";
import { ResourceInvariant } from "../context";
import cacheResourceFuncs from "./func";

let cacheManager: CacheManager;

const getManager = (): CacheManager => {
  if (!cacheManager) {
    cacheManager = new CacheManager();
  }
  return cacheManager;
};

export default function createCacheSyncImpl<
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  config: CacheConfig<Extract<keyof T, string>>
): ICacheResource<T, TName> {
  ResourceInvariant(name, resource);
  const cacheManager = getManager();
  if (cacheManager.hasResourceExist(name))
    throw new Error("Resource has already exist in store");

  const getResource: CacheResourceInternals<T>["getResource"] = () => {
    return cacheManager.getCache(name);
  };

  const clearResource: CacheResourceInternals<T>["clearResource"] = (clean) => {
    cacheManager.dispatch({
      type: "clearRec",
      payload: {
        clean,
        resource: name,
      },
    });
  };

  const dispatchResource = (
    ac: ResourceCacheAction<Extract<keyof T, string>>
  ) => {
    if (ac.type == "clear") {
      clearResource(ac.payload.clean);
      return;
    }
    cacheManager.dispatch({
      type: "resource",
      payload: {
        resource: name,
        action: ac,
      },
    });
  };

  const retResource = cacheResourceFuncs(
    getResource,
    dispatchResource,
    resource,
    config
  );

  return {
    name,
    resources: retResource,
    _internals_: {
      getResource,
      clearResource,
    },
  };
}
