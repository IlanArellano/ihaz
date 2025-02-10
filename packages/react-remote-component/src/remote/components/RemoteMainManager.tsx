import * as React from "react";
import { useRemoteMainComponent } from "../hooks/useRemoteMainComponent";
import { logger } from "@pkg/common/logger";

export default function RemoteMainManager({
  componentChildren,
  children,
}: React.PropsWithChildren<{
  componentChildren: React.ReactNode;
}>): React.JSX.Element {
  const ctx = useRemoteMainComponent(true);

  React.useEffect(() => {
    return () => {
      ctx.unregisterInstance(
        ctx.getInternalProps()?.isGlobal ? "globals" : "parents"
      );
    };
  }, []);

  React.useEffect(() => {
    const isGlobal =
      componentChildren === null || componentChildren === undefined;
    const currentProps = ctx.getInternalProps();
    if (currentProps && currentProps.isGlobal === isGlobal) return;
    if (isGlobal) {
      if (
        currentProps &&
        !currentProps.isGlobal &&
        ctx.getGlobalInstancesCount().globals > 1
      )
        logger.throwable(
          "It not must be have more than one global component with same instance."
        );
      ctx.registerInstance("globals");
      if (ctx.getKey() !== null) ctx.unregisterInstance("parents"); //it means whether the instance has been rendered in React Tree, change the instance status
    } else {
      if (currentProps && currentProps.isGlobal)
        logger.debug(
          "Remove a children from your remote component instance having a content children previusly can make some issues in the app."
        );
      ctx.registerInstance("parents");
      if (ctx.getKey() !== null) ctx.unregisterInstance("globals"); //it means whether the instance has been rendered in React Tree, change the instance status
    }
    ctx.generateKey(); //Generate Key according to internal sequence
    ctx.setInternalProps({
      isGlobal,
    });
  }, [componentChildren]);

  return <React.Fragment>{children}</React.Fragment>;
}
