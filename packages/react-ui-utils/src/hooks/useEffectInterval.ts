import { IntervalHandler } from "@utils/common/classes/IntervalHandler";
import { EffectCallback, useEffect, DependencyList } from "react";

type EffectResult = void | EffectCallback;

/**Hook that execute a callback into a Interval  */
export default function useEffectInterval(
  effect: () => EffectResult,
  deps: DependencyList,
  ms: number,
  inmediate = false
) {
  useEffect(() => {
    const interval = new IntervalHandler();
    let effectRes: EffectResult | undefined;
    if (inmediate) effectRes = effect();
    interval.set(() => {
      effectRes = effect();
    }, ms);
    return () => {
      if (effectRes && typeof effectRes === "function") effectRes();
      interval.clear();
    };
  }, deps);
}
