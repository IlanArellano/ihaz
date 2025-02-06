import * as React from "react";
import type { UncontrolledGlobalProps } from "@pkg/types";

const UNCONTROLLED_KEY_PREFIX = "uncontrolled_instance_";

function getComponentName(
  Comp: React.ComponentType<any> | React.ReactNode,
  defaultName?: string
): string {
  if (defaultName) return defaultName;
  if (Comp instanceof Function) {
    if (Comp.displayName) return Comp.displayName;
    const name = Comp.name;
    if (!name || name === "anonymous" || name === "default") return "";
    return name;
  }
  return "";
}

function generateName(
  Comp: React.ComponentType<any> | React.ReactNode,
  defaultName?: string
) {
  const name = getComponentName(Comp, defaultName);

  return UNCONTROLLED_KEY_PREFIX.concat(name);
}

export function createUncontrolledGlobalProps(
  Comp: React.ComponentType<any> | React.ReactNode,
  defaultName?: string
): UncontrolledGlobalProps {
  const props: UncontrolledGlobalProps = {
    count: {
      globals: 0,
      parents: 0,
    },
    instanceProps: new Map(),
    currentSeq: 0,
    name: generateName(Comp, defaultName),
  };

  return props;
}
