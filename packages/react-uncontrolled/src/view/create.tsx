import * as React from "react";
import { registerTreeComponent } from "./registerTreeComponent";
import { ViewTree } from "./tree";
import CommonObject from "@jsUtils/namespaces/object";
import type {
  IViewManager,
  ViewTree as ViewTreeType,
  ViewUncontrolledComp,
} from "@pkg/types";
import createViewContextHook from "./hook/create";
import createUncontrolledComponent from "@pkg/uncontrolled/comp";
import { BaseView } from "./base";

function createTree() {
  return new ViewTree();
}

export default function createViewManager(): IViewManager {
  const getTree = CommonObject.createGetterResource(
    createTree
  ) as unknown as () => ViewTreeType;

  const manager = createUncontrolledComponent<
    typeof BaseView,
    ViewUncontrolledComp
  >(BaseView);

  const getMethods = () => manager.methods;

  const useViewContext = createViewContextHook(getMethods, getTree);

  const withViewContext = registerTreeComponent(useViewContext);

  return {
    ...manager.methods,
    Component: () => <manager.Component getTree={getTree} />,
    withViewContext,
    useViewContext,
  };
}
