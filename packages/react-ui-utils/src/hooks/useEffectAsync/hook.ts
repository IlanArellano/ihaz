import * as React from "react";
import { createAsyncEffect } from "../shared/effect";
import { EffectResult } from "./types";

export default function useEffectAsync(
  effect: () => Promise<EffectResult>,
  deps?: React.DependencyList
) {
  React.useEffect(createAsyncEffect(effect), deps);
}
