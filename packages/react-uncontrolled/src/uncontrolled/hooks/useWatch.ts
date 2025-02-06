import * as React from "react";
import { useUncontrolledStore } from "./useUncontrolledStore";

export function useWatch<IWatchers extends string>(watcher: IWatchers) {
  const [value, setValue] = React.useState();
  const storeCtx = useUncontrolledStore();

  React.useEffect(() => {
    const unsuscribe = storeCtx.suscribeWatchValue(watcher, (newValue) => {
      setValue(newValue);
    });

    return () => {
      unsuscribe();
    };
  }, []);

  return value;
}
