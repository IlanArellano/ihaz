import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import type {
  FunctionalManagerMethods,
  FunctionalMethods,
  InstanceMap,
  MethodsWithStore,
} from "@utils/types";

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
  isInstanceMounted: () => boolean,
  override?: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >
) {
  type Methods = IMethods extends FunctionalMethods ? IMethods : {};
  const getMap: () => InstanceMap<IMethods> = CommonObject.createGetterResource(
    () => new Map()
  );
  const get = <IKey extends keyof IMethods>(key: IKey): IMethods[IKey] => {
    return getMap().get(key)! as IMethods[IKey];
  };
  return (props: P) => {
    const set: FunctionalManagerMethods<Methods>["set"] = React.useCallback(
      (key, value) => {
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
            if (override && override[key as keyof typeof override])
              return override[key as keyof typeof override].call(
                null,
                get,
                isInstanceMounted,
                ...[].slice.call(arguments)
              );
            if (!isInstanceMounted()) {
              const displayName: string = (Comp as any)?.displayName;
              throw new Error(
                `Cannot Execute Method '${key as string}' ${
                  displayName
                    ? `from uncontrolled component '${displayName}'`
                    : ""
                } because the Parent component doesn´t exists in React Tree`
              );
            }
            const func = get(key as keyof IMethods);
            return (func as Function).apply(null, arguments);
          },
        });
      },
      []
    );

    return (
      <>
        {/* @ts-ignore */}
        <Comp {...props} set={set} />
      </>
    );
  };
}
