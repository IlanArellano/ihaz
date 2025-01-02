import * as React from "react";
import { ViewManagerComponent } from "./manager";
import { registerTreeComponent } from "./registerTreeComponent";
import { ViewTree } from "./tree";
import CommonObject from "@jsUtils/namespaces/object";
import createUncontrolledClassComponent from "../class/comp";
import type {
  ConditionView,
  IViewManager,
  ShowFunc,
  ShowFuncSync,
  ViewUncontrolledComp,
  ViewTree as ViewTreeType,
} from "@utils/types";
import createViewContextHook from "./hook/create";

function createTree() {
  return new ViewTree();
}

export default function createViewManager(): IViewManager {
  const getTree = CommonObject.createGetterResource(
    createTree
  ) as unknown as () => ViewTreeType;

  const manager = createUncontrolledClassComponent(ViewManagerComponent, {
    show: (
      instance: () => ViewManagerComponent,
      render: Parameters<ShowFunc>[0],
      props: Parameters<ShowFunc>[1],
      context: Parameters<ShowFunc>[2]
    ) => {
      return new Promise((resolve) => {
        instance().show(render, props, context).then(resolve);
      });
    },
    showSync: (
      instance: () => ViewManagerComponent,
      render: Parameters<ShowFuncSync>[0],
      props: Parameters<ShowFuncSync>[1],
      onCloseListener: Parameters<ShowFuncSync>[2],
      context: Parameters<ShowFuncSync>[3]
    ) => {
      return instance().showSync(render, props, onCloseListener, context);
    },
    removeEntries: (instance, condition?: ConditionView) => {
      instance().removeSomeEntries(condition);
    },
  }) as ViewUncontrolledComp;

  const getManager = () => manager;

  const useViewContext = createViewContextHook(getManager, getTree);

  const withViewContext = registerTreeComponent(useViewContext);

  return {
    ...manager,
    Component: () => <manager.Component getTree={getTree} />,
    withViewContext,
    useViewContext,
  };
}
