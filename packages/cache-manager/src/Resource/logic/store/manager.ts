import { cacheReducer, clearCacheResource } from "../context";
import type {
  AppCacheAction,
  CacheResource,
  CacheState,
  CacheStateProps,
} from "../../types";

class CacheManager<TName extends string = any, T = any> {
  private store: CacheState<T>;

  constructor() {
    this.store = {} as CacheState;
  }

  public hasResourceExist = (resource: TName) => !!this.store[resource];

  public getCache<T>(resource: TName): CacheStateProps<T> {
    return (this.store[resource] || {}) as CacheStateProps<T>;
  }

  private reducer(action: AppCacheAction): CacheState {
    switch (action.type) {
      case "clearRec":
        if (typeof action.payload.clean === "string")
          return {
            ...this.store,
            [action.payload.resource]: {
              cache: clearCacheResource(
                this.store[action.payload.resource]?.cache ||
                  ({} as CacheResource<any>)
              ),
            },
          };
        else
          return {
            ...this.store,
            [action.payload.resource]: {
              cache: clearCacheResource(
                this.store[action.payload.resource]?.cache ||
                  ({} as CacheResource<any>),
                action.payload.clean?.resources
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
