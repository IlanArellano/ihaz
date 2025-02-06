import * as React from "react";
import type { FunctionalManagerMethods, FunctionalMethods } from "@pkg/types";
import { logger } from "@pkg/common/logger";
import { useUncontrolledMainComponent } from "../hooks/useUncontrolledMainComponent";

export const UncontrolledPropsContext = React.createContext<
  FunctionalManagerMethods<FunctionalMethods>
>(undefined as unknown as FunctionalManagerMethods<FunctionalMethods>);

export function UncontrolledPropsContextProvider({
  children,
  ...uncontrolledProps
}: React.PropsWithChildren<FunctionalManagerMethods<FunctionalMethods>>) {
  const ctx = useUncontrolledMainComponent(true);

  React.useEffect(() => {
    return () => {
      ctx.unregisterInstance(
        ctx.getInternalProps()?.isGlobal ? "globals" : "parents"
      );
    };
  }, []);

  React.useEffect(() => {
    const isGlobal = children === null || children === undefined;
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
          "Remove a children from your uncontrolled component instance having a content children previusly can make some issues in the app."
        );
      ctx.registerInstance("parents");
      if (ctx.getKey() !== null) ctx.unregisterInstance("globals"); //it means whether the instance has been rendered in React Tree, change the instance status
    }
    ctx.generateKey(); //Generate Key according to internal sequence
    ctx.setInternalProps({
      isGlobal,
    });
  }, [children]);

  return (
    <UncontrolledPropsContext.Provider value={{ ...uncontrolledProps }}>
      {children}
    </UncontrolledPropsContext.Provider>
  );
}
