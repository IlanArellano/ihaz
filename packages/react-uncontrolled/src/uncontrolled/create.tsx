import * as React from "react";
import { createFunctionalInstance } from "./manager";
import type {
  ContextManager,
  FunctionalManagerMethods,
  FunctionalMethods,
  UncontrolledManagerOptions,
} from "@pkg/types";
import { createUncontrolledGlobalProps } from "./init";
import { UncontrolledMainContextProvider } from "./context/main";
import { UncontrolledStoredContextProvider } from "./context/stored";

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
  options?: UncontrolledManagerOptions<IMethods>
): ContextManager<IMethods extends FunctionalMethods ? IMethods : {}, P> {
  const methods = {} as IMethods;
  let instanceMounted: boolean = false;
  const isInstanceMounted = () => instanceMounted;
  const globalProps = createUncontrolledGlobalProps(Comp, options?.name);
  const InstanceComponent = createFunctionalInstance<IComponent, IMethods, P>(
    Comp,
    methods,
    isInstanceMounted,
    options?.override
  );

  return {
    Parent: (props) => {
      return (
        <UncontrolledMainContextProvider globalProps={globalProps}>
          <UncontrolledStoredContextProvider>
            <InstanceComponent {...(props as JSX.IntrinsicAttributes & P)} />
          </UncontrolledStoredContextProvider>
        </UncontrolledMainContextProvider>
      );
    },
    managerMethods: methods as IMethods extends FunctionalMethods
      ? IMethods
      : {},
    isInstanceMounted,
  };
}
