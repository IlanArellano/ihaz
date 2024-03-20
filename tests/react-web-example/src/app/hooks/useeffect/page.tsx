"use client";

import { useEffectAsync, useLayoutEffectAsync } from "@ihaz/react-ui-utils";

export default function EffectPage() {
  useLayoutEffectAsync(async () => {
    console.log("useLayoutEffectAsync Loading");
    const res = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    console.log({ useLayoutEffectAsyncRes: res });
  }, []);
  useEffectAsync(async () => {
    console.log("useEffectAsync Loading");
    const res = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    console.log({ useEffectAsyncRes: res });
  }, []);

  return <div>Effect</div>;
}
