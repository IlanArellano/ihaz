import * as React from "react";
import Stack from "@jsUtils/namespaces/stack";
import { ViewMainComponent } from "./comp";
import { VIEW_TREE_EVENT } from "./tree";
import type {
  ConditionView,
  Entry,
  EventHandlerRegister,
  ShowFunc,
  ShowFuncSync,
  ViewComponentProps,
  ViewManagerComponentProps,
} from "./types";

export class ViewManagerComponent extends React.PureComponent<
  ViewManagerComponentProps,
  ViewComponentProps
> {
  constructor(props: ViewManagerComponentProps) {
    super(props);
    this.state = {
      views: [],
      nextId: 0,
    };
  }

  show: ShowFunc = (render, props, context) => {
    return new Promise((resolve) => {
      const currId = this.state.nextId;
      const tree = this.props.getTree();

      const entry: Entry = {
        id: currId,
        render,
        props: {
          onClose: (result: any) => {
            this.handleClose(currId, resolve)(result);
            let handler: EventHandlerRegister | undefined;
            if (context && (handler = tree.getComponentHandler(context))) {
              handler.event.clearByEvent(VIEW_TREE_EVENT);
            }
          },
          ...(props || {}),
        },
      };

      this.startView(entry, resolve, context);
    });
  };

  showSync: ShowFuncSync = (render, props, onCloseListenner, context) => {
    const currId = this.state.nextId;
    const tree = this.props.getTree();

    const entry: Entry = {
      id: currId,
      render,
      props: {
        ...(props || {}),
        onClose: (res) => {
          this.handleCloseSync(currId);
          let handler: EventHandlerRegister | undefined;
          if (context && (handler = tree.getComponentHandler(context))) {
            handler.event.clearByEvent(VIEW_TREE_EVENT);
          }
          if (onCloseListenner) onCloseListenner(res as never);
        },
      },
    };

    return {
      start: (options) => {
        if (!options?.delay) return this.startViewSync(entry, context);
        Stack.Sleep(options.delay).then(() =>
          this.startViewSync(entry, context)
        );
      },
      close: () => {
        this.handleCloseSync(entry.id);
        if (onCloseListenner) onCloseListenner(undefined as never);
      },
    };
  };

  private startView = (
    entry: Entry,
    resolve: (value: any) => void,
    context?: string
  ) => {
    const tree = this.props.getTree();
    if (context) {
      const componentDetails = tree.getComponentDetails(context);
      const handler = tree.getComponentHandler(context);
      if (
        componentDetails &&
        componentDetails.status === "mounted" &&
        handler
      ) {
        this.addEntry(entry);
        handler.event.suscribe(VIEW_TREE_EVENT, () => {
          this.handleClose(entry.id, resolve)(undefined);
        });
      } else {
        console.warn(
          `Cannot render this view because the parent component with context ${context} its no longer available in React Tree`
        );
        resolve(undefined);
      }
    } else {
      this.addEntry(entry);
    }
  };

  private startViewSync = (entry: Entry, context?: string) => {
    const tree = this.props.getTree();
    if (context) {
      const componentDetails = tree.getComponentDetails(context);
      const handler = tree.getComponentHandler(context);
      if (
        componentDetails &&
        componentDetails.status === "mounted" &&
        handler
      ) {
        this.addEntry(entry);
        handler.event.suscribe(VIEW_TREE_EVENT, () => {
          this.handleCloseSync(entry.id);
        });
      } else {
        console.warn(
          `Cannot render this view because the parent component with context ${context} its no longer available in React Tree`
        );
      }
    } else {
      this.addEntry(entry);
    }
  };

  removeSomeEntries = (condition?: ConditionView) => {
    if (this.state.views.length === 0) return;
    this.setState((prev) => ({
      views: !condition ? [] : prev.views.filter(condition),
    }));
  };

  private addEntry = (entry: Entry) => {
    this.setState((prev) => ({
      views: prev.views.concat(entry),
      nextId: prev.nextId + 1,
    }));
  };

  private removeEntry = (id: number) => {
    this.setState((prev) => ({
      views: prev.views.filter((view) => view.id !== id),
    }));
  };

  private handleClose =
    (id: number, resolve: (result: any) => void) => (result: any) => {
      resolve(result);

      this.removeEntry(id);
    };

  private handleCloseSync = (id: number) => {
    this.removeEntry(id);
  };

  render() {
    return <ViewMainComponent {...this.state} />;
  }
}
