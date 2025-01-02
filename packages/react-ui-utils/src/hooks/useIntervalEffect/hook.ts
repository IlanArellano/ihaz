import * as React from "react";
import IntervalHandler from "@jsUtils/classes/IntervalHandler";
import useValueHandler from "../useValueHandler/hook";
import type { EffectResult, IntervalEffectMethods } from "@utils/types";

export default function useIntervalEffect<IDeps = {}>(
  effect: (intervalValues: IDeps) => EffectResult,
  ms?: number,
  intervalValues?: IDeps,
  inmediate = false
): IntervalEffectMethods {
  if (
    !intervalValues ||
    typeof intervalValues !== "object" ||
    Array.isArray(intervalValues)
  )
    throw new Error(
      `Inverval Effect dependencies expect an object but receive ${
        Array.isArray(intervalValues) ? "Array" : typeof intervalValues
      }`
    );
  const [refresh, setRefresh] = React.useState(false);
  const [interval, _setInterval] = useValueHandler<
    IntervalHandler | undefined
  >();
  const [currEffectCallback, setCurrEffectCallback] = useValueHandler<
    EffectResult | undefined
  >();
  const [storedDependencies, setStoredDependencies] = useValueHandler<
    IDeps | undefined
  >();

  const stop = (executeCallbackCleanup?: boolean) => {
    clear(executeCallbackCleanup);
  };

  const start = () => {
    if (interval() !== undefined) return;
    setRefresh((prev) => !prev);
  };

  const clear = (executeCallbackCleanup?: boolean) => {
    const int = interval();
    const effectRes = currEffectCallback();
    if (!int && !effectRes) return;
    if (executeCallbackCleanup && effectRes && typeof effectRes === "function")
      effectRes();
    if (int) int.clear();
    _setInterval(undefined);
    setCurrEffectCallback(undefined);
    setStoredDependencies(undefined);
  };

  React.useEffect(() => {
    setStoredDependencies(intervalValues);
  }, [intervalValues]);

  React.useEffect(() => {
    _setInterval(new IntervalHandler());
    const int = interval();
    if (inmediate) setCurrEffectCallback(effect(storedDependencies()!));

    int!.set(() => {
      setCurrEffectCallback(effect(storedDependencies()!));
    }, ms);
    return () => {
      clear(true);
    };
  }, [refresh]);

  return {
    start,
    stop,
  };
}
