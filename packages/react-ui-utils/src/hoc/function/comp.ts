import * as React from "react";
import type {
  FunctionalManagerMethods,
  FunctionalMethods,
  MethodsStored,
  UncontrolledComponent,
  _Object,
} from "./types";
import { createFunctionalContextManager } from "./create";

const isFunctionalComponent = (component: any) =>
  typeof component === "function" && !component.prototype.isReactComponent;

export default function createUncontrolledFC<
  IComponent extends React.FC<P>,
  IMethods extends _Object,
  P = IComponent extends React.FC<
    FunctionalManagerMethods<IMethods> & infer IProps
  >
    ? IProps
    : {}
>(
  Comp: IComponent,
  methods: FunctionalMethods<IMethods>
): MethodsStored<FunctionalMethods<IMethods>> &
  Omit<
    UncontrolledComponent<Omit<P, keyof FunctionalManagerMethods<IMethods>>>,
    "getStore"
  > {
  if (!isFunctionalComponent(Comp))
    throw new Error("this Method only allows functional components.");

  const context = createFunctionalContextManager<IComponent, IMethods, P>(
    Comp,
    methods
  );

  return {
    Component: context.Parent,
    isInstanceMounted: context.isInstanceMounted,
    ...context.managerMethods,
  };
}
