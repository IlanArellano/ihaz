import * as React from "react";
import { createAsyncEffect } from "../shared/effect";
import type { EffectResult } from "./types";

export default function useLayoutEffectAsync(
  effect: () => Promise<EffectResult>,
  deps: React.DependencyList
) {
  React.useLayoutEffect(createAsyncEffect(effect), deps);
}
