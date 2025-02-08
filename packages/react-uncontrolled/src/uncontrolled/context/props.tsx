import * as React from "react";
import type { FunctionalManagerMethods, FunctionalMethods } from "@pkg/types";

export const UncontrolledPropsContext = React.createContext<
  FunctionalManagerMethods<FunctionalMethods>
>(undefined as unknown as FunctionalManagerMethods<FunctionalMethods>);

export function UncontrolledPropsContextProvider({
  children,
  ...uncontrolledProps
}: React.PropsWithChildren<FunctionalManagerMethods<FunctionalMethods>>) {
  return (
    <UncontrolledPropsContext.Provider value={{ ...uncontrolledProps }}>
      {children}
    </UncontrolledPropsContext.Provider>
  );
}
