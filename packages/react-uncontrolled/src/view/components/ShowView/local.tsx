import * as React from "react";
import {
  ViewUncontrolledCompWithoutChildren,
  WithShowViewOptions,
} from "@pkg/types";
import useLocalShowView from "../../hook/useLocalShowView";

const ShowViewCompLocal = React.forwardRef<
  ViewUncontrolledCompWithoutChildren,
  Omit<WithShowViewOptions, "local" | "manager">
>(({ children }, ref) => {
  const localProps = useLocalShowView();

  React.useImperativeHandle(
    ref,
    () => ({
      show: (options) =>
        localProps.show({ onCloseListener: options.onCloseListener }),
      showAsync: () => localProps.showAsync(),
      removeEntries: () => {},
    }),
    [localProps]
  );

  if (localProps.showState) return <React.Fragment>{children}</React.Fragment>;
  return null;
});

ShowViewCompLocal.displayName = "ShowViewLocal";

export default ShowViewCompLocal;
