import * as React from "react";
import type {
  IViewManager,
  ViewRemoteCompWithoutChildren,
  WithShowViewOptions,
} from "@pkg/types";
import ShowViewCompBase from "../components/ShowView";

export const createShowView = (manager: IViewManager) => {
  console.log("executed show view hoc");
  return React.forwardRef<
    ViewRemoteCompWithoutChildren,
    Omit<WithShowViewOptions, "maanger">
  >((props, ref) => {
    return <ShowViewCompBase {...props} manager={manager} ref={ref} />;
  });
};
