import * as React from "react";
import { createFunctionalInstance } from "./manager";
import type {
  ContextManager,
  FunctionalManagerMethods,
  FunctionalMethods,
  MethodsWithStore,
} from "@utils/types";

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
  let instanceMounted: boolean = false;
  const isInstanceMounted = () => instanceMounted;
  const Component = createFunctionalInstance<IComponent, IMethods, P>(
    Comp,
    methods,
    isInstanceMounted,
    override
  );

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
