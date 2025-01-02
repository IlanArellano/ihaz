import {
  AppCacheAction,
  CacheResource,
  CacheStateProps,
} from "@cache/Resource/types";
import { cacheReducer, clearCacheResource } from "../context";

export default function reducer<T>(
  store: CacheStateProps<T>,
  ac: AppCacheAction
): CacheStateProps<T> {
  switch (ac.type) {
    case "clearRec":
      if (typeof ac.payload.clean === "string")
        return {
          cache: clearCacheResource(
            store[ac.payload.resource]?.cache || ({} as CacheResource<any>)
          ),
        };
      else
        return {
          cache: clearCacheResource(
            store[ac.payload.resource]?.cache || ({} as CacheResource<any>),
            ac.payload.clean?.resources as (keyof T)[]
          ),
        };
    case "resource":
      return {
        cache: cacheReducer<any>(
          store[ac.payload.resource]?.cache || ({} as CacheResource<{}>),
          ac.payload.action
        ),
      };
    default:
      return store;
  }
}
