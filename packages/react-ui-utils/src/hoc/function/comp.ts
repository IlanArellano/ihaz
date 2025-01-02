import { createFunctionalContextManager } from "./create";
import type { UncontrolledFC } from "@utils/types";

const isFunctionalComponent = (component: any) =>
  typeof component === "function" && !component.prototype.isReactComponent;

const createUncontrolledFC: UncontrolledFC = (Comp, override) => {
  if (!isFunctionalComponent(Comp))
    throw new Error("this Method only allows functional components.");

  const context = createFunctionalContextManager(Comp as any, override);

  return {
    Component: context.Parent,
    isInstanceMounted: context.isInstanceMounted,
    methods: context.managerMethods,
  } as any;
};

export default createUncontrolledFC;
