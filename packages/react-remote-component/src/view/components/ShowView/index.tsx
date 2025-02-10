import * as React from "react";
import { ViewRemoteCompWithoutChildren, WithShowViewOptions } from "@pkg/types";
import ShowViewCompLocal from "./local";
import ShowViewCompManager from "./manager";

const ShowViewCompBase = React.forwardRef<
  ViewRemoteCompWithoutChildren,
  WithShowViewOptions
>(({ local, manager, children }, ref) => {
  if (local) return <ShowViewCompLocal ref={ref}>{children}</ShowViewCompLocal>;
  return (
    <ShowViewCompManager manager={manager} ref={ref}>
      {children}
    </ShowViewCompManager>
  );
});

ShowViewCompBase.displayName = "ShowView";

export default ShowViewCompBase;
