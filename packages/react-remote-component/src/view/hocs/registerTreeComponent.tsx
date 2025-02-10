import * as React from "react";
import type { TreeComponent, ViewContextHook } from "@pkg/types";

export const registerTreeComponent =
  (useViewContext: (contextName: string) => ViewContextHook): TreeComponent =>
  (ComponentWithRef, contextName) => {
    return (props) => {
      const { register, unregister, show, showAsync, getContext } =
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
          showAsync={showAsync}
          show={show}
          getContext={getContext}
        />
      );
    };
  };
