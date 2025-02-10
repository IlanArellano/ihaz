import * as React from "react";
import type {
  FunctionalManagerMethods,
  FunctionalMethods,
  MethodsWithStore,
} from "@pkg/types";
import { RemotePropsContextProvider } from "./context/props";
import { useRemoteStore } from "./hooks/useRemoteStore";
import RemoteMainManager from "./components/RemoteMainManager";

export function createFunctionalInstance<
  IComponent extends React.ComponentType<
    P & React.PropsWithChildren & FunctionalManagerMethods<any>
  >,
  IMethods = IComponent extends React.ComponentType<infer IProps>
    ? IProps extends FunctionalManagerMethods<infer Methods>
      ? Methods
      : {}
    : {},
  P extends React.PropsWithChildren = IComponent extends React.ComponentType<
    infer IProps
  >
    ? Omit<IProps, keyof FunctionalManagerMethods<any>>
    : {}
>(
  Comp: IComponent | React.ReactNode,
  entries: IMethods,
  isInstanceMounted: () => boolean,
  override?: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >
) {
  type Methods = IMethods extends FunctionalMethods ? IMethods : {};

  return (props: P) => {
    const storedCtx = useRemoteStore(true);

    const set: FunctionalManagerMethods<Methods>["set"] = React.useCallback(
      (key, value) => {
        if (!value || !key) return;
        if (!(value instanceof Function))
          throw new Error(
            `set prop method only allow Functions but it provides ${
              Array.isArray(value) ? "array" : typeof value
            } type`
          );

        storedCtx.setMethodEntry(key, value);
        if (entries[key as keyof IMethods]) return;
        Object.assign(entries as object, {
          [key]: function () {
            if (override && override[key as keyof typeof override])
              return override[key as keyof typeof override].call(
                null,
                storedCtx.getMethodEntry,
                isInstanceMounted,
                ...[].slice.call(arguments)
              );
            if (!isInstanceMounted()) {
              const displayName: string = (Comp as any)?.displayName;
              throw new Error(
                `Cannot Execute Method '${key as string}' ${
                  displayName ? `from remote component '${displayName}'` : ""
                } because the Parent component doesn´t exists in React Tree`
              );
            }
            const func = storedCtx.getMethodEntry(key as keyof IMethods);
            return (func as Function).apply(null, arguments);
          },
        });
      },
      []
    );

    const watch = React.useCallback((watcher: string, value: any) => {
      storedCtx.emitWatchValue(watcher, value);
    }, []);

    return (
      <RemotePropsContextProvider set={set} watch={watch}>
        <RemoteMainManager componentChildren={props.children}>
          {typeof Comp === "function" ? (
            <Comp {...props} set={set} watch={watch} />
          ) : (
            Comp
          )}
        </RemoteMainManager>
      </RemotePropsContextProvider>
    );
  };
}
