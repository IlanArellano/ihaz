import { DependencyList, useEffect } from "react";
import { EffectResult } from "@utils/types";
import { createAsyncEffect } from "../shared/effect";

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
) {
  useEffect(createAsyncEffect(effect), deps);
}
