import * as React from "react";
import { UncontrolledPropsContext } from "../context/props";
import type { FunctionalManagerMethods, FunctionalMethods } from "@pkg/types";
import { uncontrolledContextInvariant } from "@pkg/common/invariant";

export function useUncontrolledProps<IMethods extends FunctionalMethods>() {
  const ctx = React.useContext(
    UncontrolledPropsContext
  ) as FunctionalManagerMethods<IMethods>;

  uncontrolledContextInvariant(ctx, "useUncontrolledProps");

  return ctx;
}
