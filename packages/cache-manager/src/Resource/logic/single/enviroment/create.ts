import {
  ResourceFunction,
  ResourceFunctionContext,
} from "@cache/Resource/types";
import {
  SINGLE_CACHE_STATUS,
  type SingleCacheDictionaryResult,
  type SingleCacheResult,
} from "../types";
import { getManagerContext } from "./manager";
import { CommonObject } from "@ihaz/js-ui-utils";

export const createNode = <
  T extends ResourceFunction
>(): SingleCacheResult<T> => {
  return {
    value: null,
    args: {
      primitives: null,
      objects: null,
    },
    status: SINGLE_CACHE_STATUS.INIT,
  };
};

export const createSingleCache: SingleCacheDictionaryResult = (fn, config) => {
  const cacheFn: ResourceFunctionContext<typeof fn> = function () {
    const { getManager, success } = getManagerContext(config.environment!);
    if (!success) {
      return function () {
        return fn.apply(null, arguments);
      } as ResourceFunctionContext<typeof fn>;
    }
    const manager = getManager();
    const fnNode = manager.get(fn);
    let node: SingleCacheResult<typeof fn>;
    if (fnNode === undefined) {
      node = createNode();
      manager.set(fn, node);
    } else {
      node = fnNode;
    }
    for (let i = 0, l = arguments.length; i < l; i++) {
      let arg = arguments[i];
      const isObject =
        (typeof arg === "object" || typeof arg === "function") && arg !== null;
      if (
        isObject &&
        (config.environment === "server" || config.forceArgsReference)
      ) {
        let cache = node.args.objects;
        if (cache === null) {
          cache = node.args.objects = new WeakMap();
        }
        const oNode = cache.get(arg);
        if (oNode === undefined) {
          node = createNode();
          cache.set(arg, node);
        } else {
          node = oNode;
        }
      } else {
        let cache = node.args.primitives;
        if (cache === null) {
          cache = node.args.primitives = new Map();
        }
        let key = arg;
        if (isObject) key = CommonObject.objectToString(arg).trim();
        const pNode = cache.get(key);
        if (pNode === undefined) {
          node = createNode();
          cache.set(key, node);
        } else {
          node = pNode;
        }
      }
    }
    if (node.status === SINGLE_CACHE_STATUS.TERMINATED) {
      return node.value;
    }
    if (node.status === SINGLE_CACHE_STATUS.ERROR) {
      throw node.value;
    }
    try {
      const result = fn.apply(null, arguments);
      node.status = SINGLE_CACHE_STATUS.TERMINATED;
      const currNode = manager.get(fn);
      if (currNode !== undefined)
        currNode.status = SINGLE_CACHE_STATUS.TERMINATED;
      node.value = result;
      return result;
    } catch (error) {
      if (config.clearOnError) {
        node = createNode();
      } else {
        node.status = SINGLE_CACHE_STATUS.ERROR;
        node.value = error;
      }
      throw error;
    }
  } as ResourceFunctionContext<typeof fn>;
  cacheFn._internals_ = {} as ResourceFunctionContext<typeof fn>["_internals_"];
  cacheFn._internals_!.environment = config.environment!;
  cacheFn._internals_!.originalFn = fn;
  return cacheFn;
};
