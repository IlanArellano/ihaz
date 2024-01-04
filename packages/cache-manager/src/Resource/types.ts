import CacheManager from "./cacheManager";

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

export interface CacheClearConfig<IKeys extends string = string> {
  key: IKeys;
  resources: IKeys[];
}

export interface CacheClearPayload<IKeys extends string = string> {
  resource: string;
  clean: IKeys | CacheClearConfig<IKeys>;
}

export interface ExternalStorageMethods {
  get: (resource: string) => JSONValue | Promise<JSONValue>;
  set: (resource: string, value: JSONValue) => any | Promise<any>;
  clear: (resource: string) => void;
}

export interface ExternalStorageConfig {
  externalStorage?: ExternalStorageMethods;
}

export interface CacheConfig<IKeys extends string> extends CacheResourceConfig {
  cache?: IKeys[];
  clear?: CacheClearPayload<IKeys>["clean"][];
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
        action: ResourceCacheAction<string>;
      };
    }
  | {
      type: "clearRec";
      payload: CacheClearPayload;
    };

export type ResourceCacheAction<TKeys extends string> =
  | {
      type: "clear";
      payload: Pick<CacheClearPayload<TKeys>, "clean">;
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
  /**Funciones del resource */
  resources: ResourceFuncs<T>;
};
