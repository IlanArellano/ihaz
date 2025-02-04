import * as React from "react";
import {
  ViewUncontrolledCompWithoutChildren,
  WithShowViewOptions,
} from "@pkg/types";

const ShowViewCompManager = React.forwardRef<
  ViewUncontrolledCompWithoutChildren,
  Omit<WithShowViewOptions, "local">
>(({ manager, children }, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      show: (options) =>
        manager.show({
          ...options,
          children,
        }),
      showAsync: (options) =>
        manager.showAsync({
          ...options,
          children,
        }),
      removeEntries: manager.removeEntries,
    }),
    [manager]
  );

  React.useEffect(() => {
    if (!manager) throw new Error("No View Manager has been provided");
  }, []);

  return null;
});

ShowViewCompManager.displayName = "ShowViewManager";

export default ShowViewCompManager;
