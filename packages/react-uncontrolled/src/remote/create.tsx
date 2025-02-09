import * as React from "react";
import { createFunctionalInstance } from "./manager";
import type {
  ContextManager,
  FunctionalManagerMethods,
  FunctionalMethods,
  RemoteManagerOptions,
} from "@pkg/types";
import { createRemoteGlobalProps } from "./init";
import { RemoteMainContextProvider } from "./context/main";
import { RemoteStoredContextProvider } from "./context/stored";

export function createFunctionalContextManager<
  IComponent extends React.ComponentType<P & FunctionalManagerMethods<any>>,
  IMethods = IComponent extends React.ComponentType<infer IProps>
    ? IProps extends FunctionalManagerMethods<infer Methods>
      ? Methods
      : {}
    : {},
  P = IComponent extends React.ComponentType<infer IProps>
    ? Omit<IProps, keyof FunctionalManagerMethods<any>>
    : {}
>(
  Comp: IComponent | React.ReactNode,
  options?: RemoteManagerOptions<IMethods>
): ContextManager<IMethods extends FunctionalMethods ? IMethods : {}, P> {
  const methods = {} as IMethods;
  let instanceMounted: boolean = false;
  const isInstanceMounted = () => instanceMounted;
  const globalProps = createRemoteGlobalProps(Comp, options?.name);
  const InstanceComponent = createFunctionalInstance<IComponent, IMethods, P>(
    Comp,
    methods,
    isInstanceMounted,
    options?.override
  );

  return {
    Parent: (props) => {
      return (
        <RemoteMainContextProvider globalProps={globalProps}>
          <RemoteStoredContextProvider>
            <InstanceComponent {...(props as JSX.IntrinsicAttributes & P)} />
          </RemoteStoredContextProvider>
        </RemoteMainContextProvider>
      );
    },
    managerMethods: methods as IMethods extends FunctionalMethods
      ? IMethods
      : {},
    isInstanceMounted,
  };
}
