import * as React from "react";
import type { TreeComponent, ViewTree } from "./types";

export const registerTreeComponent =
  (getTree: () => ViewTree): TreeComponent =>
  (ComponentWithRef, contextName) => {
    if (!contextName)
      throw new Error(
        "No contextName has provider for this register, this must have a unique identifier to manage the views binding to context"
      );
    return (props) => {
      React.useEffect(() => {
        const tree = getTree();
        tree.registerComponent({
          key: contextName,
          status: "mounted",
        });

        return () => {
          tree.changeStatus(contextName, "unmounted");
        };
      }, []);

      return <ComponentWithRef {...props} />;
    };
  };
