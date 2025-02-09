import * as React from "react";
import { registerTreeComponent } from "./hocs/registerTreeComponent";
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
import { createShowView } from "./hocs/withShowView";

function createTree() {
  return new ViewTree();
}

export default function createViewManager(): IViewManager {
  const getTree = CommonObject.createGetterResource(
    createTree
  ) as unknown as () => ViewTreeType;

  const remote = createUncontrolledComponent<
    typeof BaseView,
    ViewUncontrolledComp
  >(BaseView);

  const useViewContext = createViewContextHook(remote.getMethods, getTree);

  const withViewContext = registerTreeComponent(useViewContext);

  let _ShowView: IViewManager["ShowView"];

  return {
    show: (options) => remote.getMethods().show(options),
    showAsync: (options) => remote.getMethods().showAsync(options),
    removeEntries: (condition) => remote.getMethods().removeEntries(condition),
    Component: () => <remote.Component getTree={getTree} />,
    withViewContext,
    useViewContext,
    get ShowView() {
      _ShowView ??= createShowView(this);
      return _ShowView;
    },
  };
}
