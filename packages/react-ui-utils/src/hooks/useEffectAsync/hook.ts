import * as React from "react";
import { createAsyncEffect } from "../shared/effect";
import type { EffectResult } from "@utils/types";

export default function useEffectAsync(
  effect: () => Promise<EffectResult>,
  deps?: React.DependencyList
) {
  React.useEffect(createAsyncEffect(effect), deps);
}
