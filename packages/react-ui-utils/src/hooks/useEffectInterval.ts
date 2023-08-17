import { IntervalHandler } from "@ihaz/js-ui-utils";
import { EffectCallback, useEffect, useState } from "react";
import useValueHandler from "./useValueHandler";

type EffectResult = void | EffectCallback;

interface IntervalEffectMethods {
  /**Executes the interval again if it has been stopped before */
  restart: () => void;
  /**Stop the interval effect execution. When the method is called
   * the current effect´s cleanup could be execute before the effect
   * call the cleanup
   */
  stop: (executeCallbackCleanup?: boolean) => void;
}

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
    intervalValues &&
    (typeof intervalValues !== "object" || Array.isArray(intervalValues))
  )
    throw new Error(
      `Inverval Effect dependencies expect an object but receive ${
        Array.isArray(intervalValues) ? "Array" : typeof intervalValues
      }`
    );
  const [refresh, setRefresh] = useState(false);
  const [interval, setInterval] = useValueHandler<
    IntervalHandler | undefined
  >();
  const [currEffectResCallback, setCurrEffectResCallback] = useValueHandler<
    EffectResult | undefined
  >();

  const stop = (executeCallbackCleanup?: boolean) => {
    clear(executeCallbackCleanup);
  };

  const restart = () => {
    if (interval() !== undefined) return;
    setRefresh((prev) => !prev);
  };

  const clear = (executeCallbackCleanup?: boolean) => {
    const int = interval();
    const effectRes = currEffectResCallback();
    if (executeCallbackCleanup && effectRes && typeof effectRes === "function")
      effectRes();
    if (int) int.clear();
    setInterval(undefined);
    setCurrEffectResCallback(undefined);
  };

  useEffect(() => {
    setInterval(new IntervalHandler());
    const int = interval();
    if (inmediate) setCurrEffectResCallback(effect(intervalValues as IDeps));
    int!.set(() => {
      setCurrEffectResCallback(effect(intervalValues as IDeps));
    }, ms);
    return () => {
      clear(true);
    };
  }, [refresh]);

  return {
    restart,
    stop,
  };
}
