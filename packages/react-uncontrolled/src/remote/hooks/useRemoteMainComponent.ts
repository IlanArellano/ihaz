import * as React from "react";
import { RemoteMainContext } from "../context/main";
import { remoteContextInvariant } from "@pkg/common/invariant";

export function useRemoteMainComponent(internal?: boolean) {
  const ctx = React.useContext(RemoteMainContext);

  remoteContextInvariant(ctx, "useRemoteMainComponent", internal);

  return ctx;
}
