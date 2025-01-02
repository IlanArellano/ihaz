import * as React from "react";
import type { TreeComponent, ViewContextHook } from "@utils/types";

export const registerTreeComponent =
  (useViewContext: (contextName: string) => ViewContextHook): TreeComponent =>
  (ComponentWithRef, contextName) => {
    return (props) => {
      const { register, unregister, show, showSync, getContext } =
        useViewContext(contextName);
      React.useEffect(() => {
        register();
        return () => {
          unregister();
        };
      }, []);

      return (
        <ComponentWithRef
          {...(props as any)}
          show={show}
          showSync={showSync}
          getContext={getContext}
        />
      );
    };
  };
