import type { DependencyList, EffectCallback } from "react";

export declare type EffectResult = void | EffectCallback;

/**Effect with same function as `React.useLayoutEffect` that can be declared a promise in the callback
 * 
 * ```tsx
 * const Example = () => {
  const [value, setValue] = useState();

  useLayoutEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api)
  },[]);

  return <div>{value}</div>
}
 * ```
 */
export default function useLayoutEffectAsync(
  effect: () => Promise<EffectResult>,
  deps: DependencyList
): void;
