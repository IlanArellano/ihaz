import { createFunctionalContextManager } from "./create";
import type { RemoteInstanceIntrisic, RemoteComponent } from "@pkg/types";

const isFunctionalComponent = (component: any) =>
  typeof component === "function" && !component.prototype.isReactComponent;

const createRemoteComponent: RemoteComponent = (Comp, options) => {
  if (!isFunctionalComponent(Comp))
    throw new Error("this Method only allows functional components.");

  const context = createFunctionalContextManager(Comp as any, options);

  return {
    Component: context.Parent,
    isMounted: context.isInstanceMounted,
    getMethods: () => context.managerMethods,
    _internal_: {
      _methods: context.managerMethods,
    },
  } as RemoteInstanceIntrisic<any, any>;
};

export default createRemoteComponent;
