import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import type { FunctionalManagerMethods, InstanceMap } from "./types";

export function createFunctionalInstance<
  IComponent extends React.FC<P>,
  IMethods,
  P = IComponent extends React.FC<
    FunctionalManagerMethods<IMethods> & infer IProps
  >
    ? IProps
    : {}
>(Comp: IComponent) {
  const getInstance: () => InstanceMap<IMethods> =
    CommonObject.createGetterResource(() => new Map());
  let callbackCalled = false;
  return React.forwardRef<InstanceMap<IMethods>>((_, ref) => {
    const set: FunctionalManagerMethods<IMethods>["set"] = (key, value) => {
      const _instance = getInstance();
      if (key && value) _instance.set(key, value);
      if (!callbackCalled) {
        const refFunc = ref as (x: InstanceMap<IMethods> | null) => void;
        refFunc(_instance);
        callbackCalled = true;
      }
    };

    return (
      <>
        {/* @ts-ignore */}
        <Comp set={set} />
      </>
    );
  });
}
