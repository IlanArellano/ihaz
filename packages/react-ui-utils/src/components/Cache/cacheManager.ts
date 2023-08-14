import { AppCacheAction, CacheResource, CacheState } from "@utils/types/Cache";
import { cacheReducer } from "./logic/context";

const CACHE_INITIAL = {} as CacheState;

class CacheManager<T = any> {
  private store: CacheState<T>;

  constructor() {
    this.store = CACHE_INITIAL;
  }

  public getStore() {
    return this.store;
  }

  private reducer(action: AppCacheAction) {
    const state = this.getStore();
    switch (action.type) {
      case "clearRec":
        return CACHE_INITIAL;
      case "resource":
        return {
          ...state,
          [action.payload.resource]: {
            cache: cacheReducer<any>(
              state[action.payload.resource]?.cache ||
                ({} as CacheResource<{}>),
              action.payload.action
            ),
            depends: action.payload.depends,
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
