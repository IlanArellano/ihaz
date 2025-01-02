import Validation from "@jsUtils/namespaces/validation";
import type { EffectResult } from "@utils/types";

export const createAsyncEffect =
  (effect: () => Promise<EffectResult> | EffectResult) => () => {
    let res: EffectResult | null = null;
    const effectResult = effect();
    if (Validation.isPromiseLike(effectResult))
      effectResult.then((result) => (res = result));
    else res = effectResult;

    return () => {
      if (res && typeof res === "function") res();
    };
  };
