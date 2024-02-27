import type { EffectCallback } from "react";

export declare type EffectResult = void | EffectCallback;

export interface IntervalEffectMethods {
  /**Executes the interval if it has been stopped before */
  start: () => void;
  /**Stop the interval effect execution. When the method is called
   * the current effect´s cleanup could be execute before the effect`s cleanup
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
  inmediate?: boolean
): IntervalEffectMethods;
