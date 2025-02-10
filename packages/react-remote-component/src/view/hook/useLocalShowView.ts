import * as React from "react";
import type {
  LocalShowViewResult,
  ShowFuncAsyncOnlyChildren,
  ShowFuncSyncOnlyChildren,
} from "@pkg/types";

export default function useLocalShowView(): LocalShowViewResult {
  const [showState, setShowState] = React.useState(false);

  const show: ShowFuncSyncOnlyChildren = React.useCallback(() => {
    return new Promise(() => {
      setShowState(true);
    });
  }, []);

  const showAsync: ShowFuncAsyncOnlyChildren = React.useCallback(() => {
    setShowState(true);
  }, []);

  return {
    show,
    showAsync,
    showState,
  };
}
