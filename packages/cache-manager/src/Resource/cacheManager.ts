import { cacheReducer, mapSelectedCleanResources } from "./logic/context";
import type {
  AppCacheAction,
  CacheResource,
  CacheState,
  CacheStateConfig,
  CacheStateKeyConfigs,
} from "./types";

class CacheManager<T = any> {
  private store: CacheState<T>;
  private configs: CacheStateConfig;

  constructor() {
    this.store = {} as CacheState;
    this.configs = {} as CacheStateConfig;
  }

  public getCache<T>(resource: keyof T): CacheResource<T> {
    return (this.store[resource]?.cache || {}) as CacheResource<T>;
  }

  private getConfig = (resource: string) => {
    return this.configs[resource];
  };

  public setResourceConfig = (
    resource: string,
    configs: CacheStateKeyConfigs
  ) => {
    this.configs = {
      ...this.configs,
      [resource]: configs,
    };
  };

  private reducer(action: AppCacheAction): CacheState {
    switch (action.type) {
      case "clearRec":
        if (typeof action.payload.clean === "string")
          return {
            ...this.store,
            [action.payload.resource]: {
              cache: {},
            },
          };
        else
          return {
            ...this.store,
            [action.payload.resource]: {
              cache: mapSelectedCleanResources(
                action.payload.clean?.resources,
                this.store[action.payload.resource]?.cache
              ),
            },
          };
      case "resource":
        return {
          ...this.store,
          [action.payload.resource]: {
            cache: cacheReducer<any>(
              this.store[action.payload.resource]?.cache ||
                ({} as CacheResource<{}>),
              action.payload.action
            ),
          },
        };
      default:
        return this.store;
    }
  }

  public dispatch(action: AppCacheAction) {
    this.store = this.reducer(action);
  }
}

export default CacheManager;
