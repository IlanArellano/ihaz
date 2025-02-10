import * as React from "react";
import type { FunctionalManagerMethods, FunctionalMethods } from "@pkg/types";

export const RemotePropsContext = React.createContext<
  FunctionalManagerMethods<FunctionalMethods>
>(undefined as unknown as FunctionalManagerMethods<FunctionalMethods>);

export function RemotePropsContextProvider({
  children,
  ...remoteProps
}: React.PropsWithChildren<FunctionalManagerMethods<FunctionalMethods>>) {
  return (
    <RemotePropsContext.Provider value={remoteProps}>
      {children}
    </RemotePropsContext.Provider>
  );
}
