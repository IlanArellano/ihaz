import { IntervalHandler } from "@ihaz/js-ui-utils";
import { EffectResult } from "@utils/types";
import { useEffect, useState } from "react";
import { IntervalEffectMethods } from "./types";
import useValueHandler from "../useValueHandler";

/**Hook that execute a callback into a Interval
 *
 * ```tsx
const Example = () => {
  const [count, setCount] = useState(0);
  const { restart, stop } = useIntervalEffect(
    ({ count }) => {
      console.log(count); // Shows the current count value in every interval
      setCount((prev) => prev + 1);
    },
    1000,
    { count }
  ); //Executes effect every second

  return (
    <div>
      <button onClick={() => restart()}>Restart</button>
      <button onClick={() => stop()}>Stop</button>
      <span>{count}</span>
    </div>
  );
};
```
 *
 */
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
  const [refresh, setRefresh] = useState(false);
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

  useEffect(() => {
    setStoredDependencies(intervalValues);
  }, [intervalValues]);

  useEffect(() => {
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
