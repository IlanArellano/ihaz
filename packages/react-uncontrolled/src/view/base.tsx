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
} from "@pkg/types";
import { ViewMainComponent } from "./comp";
import Stack from "@jsUtils/namespaces/stack";

export const VIEW_TREE_EVENT = "close";

export function BaseView({
  set,
  getTree,
}: FunctionalManagerMethods<ViewUncontrolledComp> & ViewManagerComponentProps) {
  const [state, setState] = React.useState<ViewComponentProps>(() => ({
    nextId: 0,
    views: [],
  }));

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

  const addEntry = React.useCallback((entry: ViewEntry) => {
    setState((prev) => ({
      views: prev.views.concat(entry),
      nextId: prev.nextId + 1,
    }));
  }, []);

  const startView = React.useCallback(
    (entry: ViewEntry, context?: React.Key, resolve?: (value: any) => void) => {
      const tree = getTree();
      if (context) {
        const componentStatus = tree.getComponentDetails(context);
        if (componentStatus === "mounted") {
          const handler = tree.getComponentHandler(context);
          addEntry(entry);
          handler.suscribe(VIEW_TREE_EVENT, () => {
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
    (render, props, context) => {
      return new Promise((resolve) => {
        const currId = state.nextId;
        const tree = getTree();

        const entry: ViewEntry = {
          id: currId,
          render,
          props: {
            onClose: (result: any) => {
              handleClose(currId, resolve)(result);
              let handler:
                | EventHandler<EventHandlerRegisterMapping>
                | undefined;
              if (context && (handler = tree.getComponentHandler(context))) {
                handler.clearByEvent(VIEW_TREE_EVENT);
              }
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
    (render, props, onCloseListener, context) => {
      const currId = state.nextId;
      const tree = getTree();

      const entry: ViewEntry = {
        id: currId,
        render,
        props: {
          ...(props || {}),
          onClose: (res) => {
            handleClose(currId);
            let handler: EventHandler<EventHandlerRegisterMapping> | undefined;
            if (context && (handler = tree.getComponentHandler(context))) {
              handler.clearByEvent(VIEW_TREE_EVENT);
            }
            if (onCloseListener) onCloseListener(res as never);
          },
        },
      };

      return {
        start: (options) => {
          if (!options?.delay) return startView(entry, context);
          Stack.Sleep(options.delay).then(() => startView(entry, context));
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

  return <ViewMainComponent {...state} />;
}
