export type CacheActions = "cache" | "clear";

export type FuncToPromise<T> = T extends (...args: infer P) => infer IRes
  ? (...args: P) => IRes extends Promise<any> ? IRes : Promise<IRes>
  : T;

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

export interface ExternalStorageMethods<TName extends string = any> {
  get: (
    resource: TName
  ) => CacheStateProps | Promise<CacheStateProps> | null | undefined;
  set: (resource: TName, state: CacheStateProps) => any | Promise<any>;
  clear?: (resource: TName) => void;
}

export type CacheEnvironment = "client" | "server" | "hybrid";

export interface CacheConfigEnvironment {
  environment?: CacheEnvironment;
}

export interface CacheConfigSingle extends CacheConfigEnvironment {
  /**
   * @default true
   * clear function cache result when the fuction call throw any error. */
  clearOnError?: boolean;
  /**If set true, force all the object or mutable arg values to persist the same reference to storage the result in cache,
   * when the reference has change, the cache function result will be clean. `This config is for only client and hybrid environment.`
   */
  forceArgsReference?: boolean;
}

export interface CacheConfig<IKeys extends string> extends CacheResourceConfig {
  cache?: IKeys[];
  clear?: CacheClearPayload<IKeys>["clean"][];
}

export interface CacheConfigAsync<TName extends string, IKeys extends string>
  extends CacheConfig<IKeys> {
  externalStorage: ExternalStorageMethods<TName>;
}

export interface FunctionCache {
  entries: CacheEntry[];
  error?: Error;
}

export type CacheResource<T> = {
  [key in keyof T]: FunctionCache;
};

export interface CacheStateProps<T = any> {
  cache: CacheResource<T>;
}

export type CacheState<T = any> = {
  [key: string]: CacheStateProps<T> | undefined;
};

export type AppCacheAction =
  | {
      type: "clear";
      payload: {
        resource: string;
      };
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

export interface CacheResourceConfig extends CacheConfigEnvironment {
  maxSize?: number;
}

export type ResourceFunction = (...args: any[]) => any;

export type Resource<TKeys extends string> = {
  [K in TKeys]: ResourceFunction;
};

export type ResourceFuncs<T> = {
  [K in keyof T]: T[K];
};
export type ResourceFuncsAsync<T> = {
  [K in keyof T]: FuncToPromise<T[K]>;
};

export interface CacheResourceInternals<T> {
  getResource: () => CacheStateProps<T>;
  clearResource: (
    clean: Extract<keyof T, string> | CacheClearConfig<Extract<keyof T, string>>
  ) => void;
}

export interface CacheResourceInternalsAsync<T> {
  getResource: () => PromiseLike<CacheStateProps<T>>;
  clearResource: (
    clean: Extract<keyof T, string> | CacheClearConfig<Extract<keyof T, string>>
  ) => PromiseLike<void>;
}

export type NamedResource<TName extends string> = {
  name: TName;
};

export interface ICacheResource<
  T extends Resource<string>,
  TName extends string
> extends NamedResource<TName> {
  resources: ResourceFuncs<T>;
  _internals_: CacheResourceInternals<T>;
}

export interface ICacheResourceAsync<
  T extends Resource<string>,
  TName extends string
> extends NamedResource<TName> {
  resources: ResourceFuncsAsync<T>;
  _internals_: CacheResourceInternalsAsync<T>;
}

export type ResourceFunctionContext<T extends ResourceFunction> = T & {
  _internals_?: Required<Pick<CacheConfigEnvironment, "environment">> & {
    originalFn?: T;
  };
};
