import type { EffectResult } from "@utils/types";

export const createAsyncEffect =
  (effect: () => Promise<EffectResult>) => () => {
    let res: EffectResult | null = null;
    effect().then((result) => (res = result));
    return () => {
      if (res && typeof res === "function") res();
    };
  };
