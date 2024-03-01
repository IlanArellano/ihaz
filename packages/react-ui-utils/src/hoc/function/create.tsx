import * as React from "react";
import type {
  FunctionalManagerMethods,
  FunctionalMethods,
  MethodsWithStore,
} from "./types";
import { createFunctionalInstance } from "./manager";

interface ContextManager<IMethods extends FunctionalMethods, IProps> {
  Parent: (props: IProps) => React.ReactNode;
  isInstanceMounted: () => boolean;
  managerMethods: IMethods;
}

export function createFunctionalContextManager<
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
  override?: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >
): ContextManager<IMethods extends FunctionalMethods ? IMethods : {}, P> {
  const methods = {} as IMethods;
  const Component = createFunctionalInstance<IComponent, IMethods, P>(
    Comp,
    methods,
    override
  );
  let instanceMounted: boolean = false;
  const isInstanceMounted = () => instanceMounted;

  return {
    Parent: (props) => {
      React.useEffect(() => {
        instanceMounted = true;
        return () => {
          instanceMounted = false;
        };
      }, []);
      return <Component {...(props as JSX.IntrinsicAttributes & P)} />;
    },
    managerMethods: methods as IMethods extends FunctionalMethods
      ? IMethods
      : {},
    isInstanceMounted,
  };
}
