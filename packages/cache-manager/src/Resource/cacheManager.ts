import { cacheReducer, mapSelectedCleanResources } from "./logic/context";
import type { AppCacheAction, CacheResource, CacheState } from "./types";

class CacheManager<T = any> {
  private store: CacheState<T>;

  constructor() {
    this.store = {} as CacheState;
  }

  public getStore() {
    return this.store;
  }

  private reducer(action: AppCacheAction): CacheState {
    const state = this.getStore();
    switch (action.type) {
      case "clearRec":
        if (typeof action.payload.clean === "string")
          return {
            ...state,
            [action.payload.resource]: {
              cache: {},
            },
          };
        else
          return {
            ...state,
            [action.payload.resource]: {
              cache: mapSelectedCleanResources(
                action.payload.clean?.resources,
                state[action.payload.resource]?.cache
              ),
            },
          };
      case "resource":
        return {
          ...state,
          [action.payload.resource]: {
            cache: cacheReducer<any>(
              state[action.payload.resource]?.cache ||
                ({} as CacheResource<{}>),
              action.payload.action
            ),
          },
        };
      default:
        return state;
    }
  }

  public dispatch(action: AppCacheAction) {
    this.store = this.reducer(action);
  }
}

export default CacheManager;
