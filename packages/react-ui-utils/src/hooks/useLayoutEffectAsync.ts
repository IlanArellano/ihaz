import { DependencyList, EffectCallback, useLayoutEffect } from "react";

type EffectResult = void | EffectCallback;

/**Effect with same function that `React.useLayoutEffect` that can be declared a promise in the callback
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
) {
  useLayoutEffect(() => {
    let res: EffectResult | null = null;
    effect().then((result) => (res = result));
    return () => {
      if (res && typeof res === "function") res();
    };
  }, deps);
}
