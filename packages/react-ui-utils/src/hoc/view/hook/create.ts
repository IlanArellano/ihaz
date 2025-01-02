import * as React from "react";
import type {
  ShowFuncSyncWithoutContext,
  ShowFuncWithoutContext,
  ViewContextHook,
  ViewTree,
  ViewUncontrolledComp,
} from "@utils/types";
import { CHANGE_CONTEXT_NAME_ERROR, NO_REGISTER_ERROR } from "../constants";

export default function createViewContextHook(
  getManager: () => ViewUncontrolledComp,
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

    const show: ShowFuncWithoutContext = (render, props) => {
      const manager = getManager();
      return manager.show(render, props, contextNameRef.current);
    };

    const showSync: ShowFuncSyncWithoutContext = (
      render,
      props,
      onCloseListener
    ) => {
      const manager = getManager();
      return manager.showSync(
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
      showSync,
      unregister,
    };
  };
}
