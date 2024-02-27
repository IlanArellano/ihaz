declare class CacheManager<T = any> {
  private store: CacheState<T>;

  public getStore(): CacheState<T>;

  private reducer(action: AppCacheAction): CacheState<T>;

  public dispatch(action: AppCacheAction): void;
}

export type CacheResourceFuncWithInstance = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  resourceConf: CacheConfig<Extract<keyof T, string>>
) => NamedResource<T, TName>;

export interface ICacheResourceUncontrolled {
  key: string;
  createCache: CacheResourceFuncWithInstance;
  getCacheStore: () => CacheState;
  clearCache: () => void;
}

export interface CacheManagers {
  key: string;
  manager: CacheManager;
}

export type CacheActions = "cache" | "clear";

export type JSONValue =
  | string
  | number
  | boolean
  | {}
  | any[]
  | null
  | undefined;

export type CachePayload = JSONValue | PromiseLike<JSONValue>;

export interface CacheValue {
  payload: CachePayload;
  async: boolean;
}

export interface CacheEntry {
  id: number;
  args: JSONValue[];
  value: CacheValue;
}

export interface CacheConfig<IKeys extends string> {
  cache?: IKeys[];
  clear?: IKeys[];
  depends?: string[];
}

export interface FunctionCache {
  entries: CacheEntry[];
  error?: Error;
}

export type CacheResource<T> = {
  [key in keyof T]: FunctionCache;
};

export type CacheState<T = any> = {
  [key: string]:
    | {
        cache: CacheResource<T>;
        depends: string[];
      }
    | undefined;
};

export type AppCacheAction =
  | {
      type: "clear";
    }
  | {
      type: "resource";
      payload: {
        resource: string;
        /**Nombres de los resources que dependen de este resource */
        depends: string[];
        action: ResourceCacheAction<string>;
      };
    }
  | {
      type: "clearRec";
      payload: {
        resource: string;
      };
    };

export type ResourceCacheAction<TKeys extends string> =
  | {
      type: "clear";
      payload: { config: CacheConfig<TKeys> };
    }
  | {
      type: "func";
      payload: { func: TKeys; action: FunctionCacheAction };
    };

export type FunctionCacheAction =
  | {
      type: "setEntry";
      payload: { entry: CacheEntry; config: CacheResourceConfig };
    }
  | {
      type: "clear";
    }
  | {
      type: "resolvePromise";
      payload: { id: number; value: JSONValue };
    }
  | {
      type: "error";
      payload: { error: Error };
    };

export interface CacheResourceConfig {
  /**Cantidad máxima de elementos en el cache */
  maxSize: number;
}

/**Un objeto de funciones */
export type Resource<TKeys extends string> = {
  [K in TKeys]: (...args: any[]) => any;
};

export type ResourceFuncs<T> = {
  [K in keyof T]: T[K];
};

export type NamedResource<T extends Resource<string>, TName extends string> = {
  /**Nombre del resource */
  name: TName;
  /**Nombre de los resources que se deben de limpiar al invalidar este resourceks*/
  depends: string[];

  /**Funciones del resource */
  funcs: ResourceFuncs<T>;
};

export type CacheResourceFunc = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  resourceConf: CacheConfig<Extract<keyof T, string>>
) => NamedResource<T, TName>;

/**
 * Cache Resource Manager
 * @deprecated
 * These methods is no longer supported and it will be remove in future versions, use `@ihaz/cache-manager` package instead
 */
export namespace CacheResource {
  /**Clear all Cache by the key of any `Resource Managers` created by `createCacheResources` method
   * @deprecated
   * This method is no longer supported and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function clearCacheByResource(key: string): void;
  /**Creates a enviroment that can set a method's collection
   * @deprecated
   * This method is no longer support and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function createCacheResources(): ICacheResourceUncontrolled;
  /**Remove the Cache for all the store from `Resource Managers` created
   * @deprecated
   * This method is no longer support and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function clearAllCache(): void;
}
