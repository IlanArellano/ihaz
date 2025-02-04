import * as React from "react";
import {
  EventHandlerRegisterMapping,
  FunctionalManagerMethods,
  ShowFuncAsync,
  ViewComponentProps,
  ViewEntry,
  ViewManagerComponentProps,
  ViewUncontrolledComp,
  EventHandler,
  ShowFuncSync,
  ConditionView,
  VIEW_NATIVE_EVENTS,
} from "@pkg/types";
import { ViewMainComponent } from "./comp";

export function BaseView({
  set,
  getTree,
}: FunctionalManagerMethods<ViewUncontrolledComp> & ViewManagerComponentProps) {
  const [state, setState] = React.useState<ViewComponentProps>(() => ({
    views: [],
  }));
  const nextIdRef = React.useRef(0);

  const removeEntry = React.useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      views: prev.views.filter((view) => view.id !== id),
    }));
  }, []);

  const handleClose = React.useCallback(
    (id: number, resolve?: (result: any) => void) => (result: any) => {
      if (resolve) resolve(result);

      removeEntry(id);
    },
    []
  );

  const clearEvents = React.useCallback(
    (context?: React.Key) => {
      const tree = getTree();
      let handler: EventHandler<EventHandlerRegisterMapping> | undefined;
      if (context && (handler = tree.getComponentHandler(context))) {
        handler.clearByEvent(VIEW_NATIVE_EVENTS.CLOSE);
      }
    },
    [getTree]
  );

  const addEntry = React.useCallback((entry: ViewEntry) => {
    setState((prev) => ({
      views: prev.views.concat(entry),
    }));
    if (entry.id >= nextIdRef.current)
      nextIdRef.current = nextIdRef.current + 1; //if a view is reopened prevents to increment the id view counter
  }, []);

  const startView = React.useCallback(
    (entry: ViewEntry, context?: React.Key, resolve?: (value: any) => void) => {
      const tree = getTree();
      if (context) {
        const componentStatus = tree.getComponentDetails(context);
        if (componentStatus === "mounted") {
          const handler = tree.getComponentHandler(context);
          addEntry(entry);
          handler.suscribe(VIEW_NATIVE_EVENTS.CLOSE, () => {
            handleClose(entry.id, resolve)(entry.props.defaultValue);
          });
        } else {
          console.warn(
            `Cannot render this view because the parent component with context ${context} its no longer available in React Tree`
          );
          if (resolve) resolve(undefined);
        }
      } else {
        addEntry(entry);
      }
    },
    [getTree]
  );

  const showAsync: ShowFuncAsync = React.useCallback(
    ({ children, context, props }) => {
      return new Promise((resolve) => {
        const currId = nextIdRef.current;

        const entry: ViewEntry = {
          id: currId,
          children,
          props: {
            onClose: (result: any) => {
              handleClose(currId, resolve)(result);
              clearEvents(context);
            },
            ...(props || {}),
          },
        };

        startView(entry, context, resolve);
      });
    },
    [state, getTree]
  );

  const show: ShowFuncSync = React.useCallback(
    ({ children, props, onCloseListener, context }) => {
      const currId = nextIdRef.current;

      const entry: ViewEntry = {
        id: currId,
        children,
        props: {
          ...(props || {}),
          onClose: (res) => {
            handleClose(currId)(undefined);
            clearEvents(context);
            if (onCloseListener) onCloseListener(res as never);
          },
        },
      };

      return {
        start: () => {
          startView(entry, context);
        },
        close: () => {
          handleClose(entry.id);
          if (onCloseListener)
            onCloseListener(entry.props.defaultValue as never);
        },
      };
    },
    [state, getTree]
  );

  const removeEntries = React.useCallback(
    (condition?: ConditionView) => {
      if (state.views.length === 0) return;
      setState((prev) => ({
        ...prev,
        views: !condition ? [] : prev.views.filter(condition),
      }));
    },
    [state]
  );

  set("show", show);
  set("showAsync", showAsync);
  set("removeEntries", removeEntries);

  return <ViewMainComponent views={state.views} />;
}
