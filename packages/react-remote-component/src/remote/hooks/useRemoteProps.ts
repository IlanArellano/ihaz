import * as React from "react";
import { RemotePropsContext } from "../context/props";
import type { FunctionalManagerMethods, FunctionalMethods } from "@pkg/types";
import { remoteContextInvariant } from "@pkg/common/invariant";

export function useRemoteProps<IMethods extends FunctionalMethods>() {
  const ctx = React.useContext(
    RemotePropsContext
  ) as FunctionalManagerMethods<IMethods>;

  remoteContextInvariant(
    ctx,
    "useRemoteProps",
    true,
    "This context only can be used in component that becomes in remote components"
  );

  return ctx;
}
