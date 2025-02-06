import * as React from "react";
import { UncontrolledMainContext } from "../context/main";
import { uncontrolledContextInvariant } from "@pkg/common/invariant";

export function useUncontrolledMainComponent(internal?: boolean) {
  const ctx = React.useContext(UncontrolledMainContext);

  uncontrolledContextInvariant(ctx, "useUncontrolledMainComponent", internal);

  return ctx;
}
