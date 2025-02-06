import * as React from "react";
import { uncontrolledContextInvariant } from "@pkg/common/invariant";
import { UncontrolledStoredContext } from "../context/stored";

export function useUncontrolledStore(internal?: boolean) {
  const ctx = React.useContext(UncontrolledStoredContext);

  uncontrolledContextInvariant(ctx, "useUncontrolledStore", internal);

  return ctx;
}
