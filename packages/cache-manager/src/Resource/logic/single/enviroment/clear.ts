import {
  ResourceFunction,
  ResourceFunctionContext,
} from "@cache/Resource/types";
import { getManagerContext } from "./manager";
import { createNode } from "./create";
import { SINGLE_CACHE_STATUS } from "../types";

export const clearSingleCache = <T extends ResourceFunction>(
  func: ResourceFunctionContext<T>
): boolean => {
  const { getManager, success } = getManagerContext(
    func._internals_!.environment
  );
  if (!success) return false;
  const manager = getManager();
  const originalFn = func._internals_!.originalFn as T;
  const hasItem = manager.has(originalFn);
  if (!hasItem) return false;
  const currNode = manager.get(originalFn);
  if (currNode?.status === SINGLE_CACHE_STATUS.INIT) return false;
  manager.set(originalFn, createNode());
  return true;
};
