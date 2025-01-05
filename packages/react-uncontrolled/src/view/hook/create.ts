import * as React from "react";
import type {
  ShowFuncSyncWithoutContext,
  ShowFuncWithoutContext,
  ViewContextHook,
  ViewTree,
  ViewUncontrolledComp,
} from "@pkg/types";
import { CHANGE_CONTEXT_NAME_ERROR, NO_REGISTER_ERROR } from "../constants";

export default function createViewContextHook(
  getMethods: () => ViewUncontrolledComp,
  getTree: () => ViewTree
) {
  return (contextName: string): ViewContextHook => {
    if (!contextName) throw new Error(NO_REGISTER_ERROR);
    const contextNameRef = React.useRef<string | undefined>(undefined);
    if (
      contextNameRef.current !== undefined &&
      contextName !== contextNameRef.current
    )
      throw new Error(CHANGE_CONTEXT_NAME_ERROR);

    const register = () => {
      contextNameRef.current = contextName;
      const tree = getTree();
      tree.registerComponent({
        key: contextName,
        status: "mounted",
      });
    };

    const unregister = () => {
      const tree = getTree();
      tree.changeStatus(contextName, "unmounted");
    };

    const showAsync: ShowFuncWithoutContext = (render, props) => {
      const manager = getMethods();
      return manager.showAsync(render, props, contextNameRef.current);
    };

    const show: ShowFuncSyncWithoutContext = (
      render,
      props,
      onCloseListener
    ) => {
      const manager = getMethods();
      return manager.show(
        render,
        props,
        onCloseListener,
        contextNameRef.current
      );
    };

    const getContext = () => contextNameRef.current!;

    return {
      getContext,
      register,
      show,
      showAsync,
      unregister,
    };
  };
}
