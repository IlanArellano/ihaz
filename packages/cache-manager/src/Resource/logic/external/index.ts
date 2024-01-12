import { Validation } from "@ihaz/js-ui-utils";
import {
  CacheConfigAsync,
  CacheStateProps,
  ExternalStorageMethods,
  ICacheResourceAsync,
  Resource,
  ResourceCacheAction,
} from "@cache/Resource/types";
import cacheResourceFuncs from "./func";
import { ResourceInvariant } from "../context";
import reducer from "./manager";

const METHODS: (keyof ExternalStorageMethods)[] = ["set", "get"];

export default function createExternalCacheImpl<
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  config: CacheConfigAsync<TName, Extract<keyof T, string>>
): ICacheResourceAsync<T, TName> {
  ResourceInvariant(name, resource);
  const externalMethods = config?.externalStorage;

  if (!externalMethods || METHODS.some((m) => !externalMethods[m]))
    throw new Error(
      "For external cache all resources must have a getter and setter to store cache values to external resource"
    );

  const getResource = () => {
    return new Promise<CacheStateProps<T>>((resolve) => {
      const store = externalMethods.get(name);
      if (Validation.isPromiseLike(store)) store.then(resolve);
      else resolve(store || ({} as CacheStateProps<T>));
    });
  };
  const setResource = (state: CacheStateProps) => {
    return new Promise<any>((resolve) => {
      const set = externalMethods.set(name, state);
      if (Validation.isPromiseLike(set)) set.then(resolve);
      else resolve(undefined);
    });
  };
  const clearResource = () => {
    return new Promise<void>((resolve) => {
      const clear = externalMethods.clear && externalMethods.clear(name);
      if (Validation.isPromiseLike(clear)) clear.then(resolve);
      else resolve();
    });
  };

  const dispatch = async (
    store: CacheStateProps<T>,
    ac: ResourceCacheAction<Extract<keyof T, string>>
  ) => {
    if (ac.type === "clear") {
      if (externalMethods.clear) externalMethods.clear(name);
      else
        await setResource(
          reducer(store, {
            type: "clearRec",
            payload: {
              clean: ac.payload.clean,
              resource: name,
            },
          })
        );
      return;
    }
    await setResource(
      reducer(store, {
        type: "resource",
        payload: {
          resource: name,
          action: ac,
        },
      })
    );
  };

  const retResource = cacheResourceFuncs(
    getResource,
    dispatch,
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
