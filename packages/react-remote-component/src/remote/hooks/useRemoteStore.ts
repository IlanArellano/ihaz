import * as React from "react";
import { remoteContextInvariant } from "@pkg/common/invariant";
import { RemoteStoredContext } from "../context/stored";

export function useRemoteStore(internal?: boolean) {
  const ctx = React.useContext(RemoteStoredContext);

  remoteContextInvariant(ctx, "useRemoteStore", internal);

  return ctx;
}
