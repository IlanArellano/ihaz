import type { DependencyList, EffectCallback } from "react";

export declare type EffectResult = void | EffectCallback;

/**Effect  with same function as `React.useEffect` that can be declared a promise in the callback
 * 
 * ```tsx
 * const Example = () => {
  const [value, setValue] = useState();

  useEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api)
  },[]);

  return <div>{value}</div>
}
 * ```
 */
export default function useEffectAsync(
  effect: () => Promise<EffectResult>,
  deps?: DependencyList
): void;
