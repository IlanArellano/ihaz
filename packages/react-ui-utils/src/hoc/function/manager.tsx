import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import type {
  FunctionalManagerMethods,
  FunctionalMethods,
  InstanceMap,
  MethodsWithStore,
} from "./types";

export function createFunctionalInstance<
  IComponent extends (props: P) => React.ReactNode,
  IMethods = IComponent extends (props: infer IProps) => React.ReactNode
    ? IProps extends FunctionalManagerMethods<infer Methods>
      ? Methods
      : {}
    : {},
  P = IComponent extends (props: infer IProps) => React.ReactNode
    ? Omit<IProps, keyof FunctionalManagerMethods<any>>
    : {}
>(
  Comp: IComponent,
  entries: IMethods,
  override?: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >
) {
  type Methods = IMethods extends FunctionalMethods ? IMethods : {};
  const getMap: () => InstanceMap<IMethods> = CommonObject.createGetterResource(
    () => new Map()
  );
  return (props: P) => {
    const set: FunctionalManagerMethods<Methods>["set"] = (key, value) => {
      if (!value || !key) return;
      if (!(value instanceof Function))
        throw new Error(
          `set prop method only allow Functions but it provides ${
            Array.isArray(value) ? "array" : typeof value
          } type`
        );
      const _map = getMap();

      _map.set(key as any, value as any);
      if (entries[key as keyof IMethods]) return;
      Object.assign(entries as object, {
        [key]: function () {
          const _internalInstance = getMap();
          const get = <IKey extends keyof IMethods>(
            key: IKey
          ): IMethods[IKey] => {
            return _internalInstance.get(key)! as IMethods[IKey];
          };
          if (override && override[key as keyof typeof override])
            return override[key as keyof typeof override].call(
              null,
              get,
              ...[].slice.call(arguments)
            );
          const func = get(key as keyof IMethods);
          return (func as Function).apply(null, arguments);
        },
      });
    };

    return (
      <>
        {/* @ts-ignore */}
        <Comp {...props} set={set} />
      </>
    );
  };
}
