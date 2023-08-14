import React, { PureComponent } from "react";
import {
  type ViewComponentProps,
  type Entry,
  type ViewProps,
  ViewMainComponent,
} from "./comp";
import { Sleep } from "@utils/common";
import { EventHandlerRegister, VIEW_TREE_EVENT, ViewTree } from "./tree";
export interface ShowFunc {
  <TResult>(
    render: React.ComponentType<ViewProps<TResult>>,
    props?: {},
    context?: string
  ): Promise<TResult>;
  <TProps>(
    render: React.ComponentType<TProps>,
    props?: Omit<TProps, keyof ViewProps<any>>,
    context?: string
  ): Promise<TProps extends ViewProps<infer TResult> ? TResult : unknown>;
}

export interface ViewSyncStartOptions {
  delay: number;
}

export interface ViewSyncResult {
  start: (options?: Partial<ViewSyncStartOptions>) => void;
  /**Cierra el modal instanciado, devolviendo el resultado que previamente
   * fue seteado con la llamada @see `onClose` en caso de no ser llamado
   * devolvera undefined, si el modal fue previamente cerrado la funcion no
   * tendrá efecto
   */
  close: () => void;
}

export interface ShowFuncSync {
  <TResult>(
    render: React.ComponentType<ViewProps<TResult>>,
    props?: {},
    onCloseListenner?: (res: TResult) => void,
    context?: string
  ): ViewSyncResult;
  <TProps>(
    render: React.ComponentType<TProps>,
    props?: Omit<TProps, keyof ViewProps<any>>,
    onCloseListenner?: (
      res: TProps extends ViewProps<infer IResult> ? IResult : unknown
    ) => void,
    context?: string
  ): ViewSyncResult;
}

export type ConditionView = (x: Entry) => boolean;

export interface ViewManagerComponentProps {
  Tree: ViewTree;
}

export class ViewManagerComponent extends PureComponent<
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

  show = (
    render: React.ComponentType<ViewProps>,
    props: {},
    context?: string
  ): PromiseLike<any> => {
    return new Promise((resolve) => {
      const currId = this.state.nextId;

      const entry: Entry = {
        id: currId,
        render: render,
        props: {
          onClose: (result: any) => {
            this.handleClose(currId, resolve)(result);
            let handler: EventHandlerRegister | undefined;
            if (
              context &&
              (handler = this.props.Tree.getComponentHandler(context))
            ) {
              handler.event.clearByEvent(VIEW_TREE_EVENT);
            }
          },
          ...(props || {}),
        },
      };

      this.startModal(entry, resolve, context);
    });
  };

  showSync = (
    render: React.ComponentType<ViewProps>,
    props: {},
    onCloseListenner?: (res: any) => void,
    context?: string
  ): ViewSyncResult => {
    const currId = this.state.nextId;

    const entry: Entry = {
      id: currId,
      render: render,
      props: {
        ...(props || {}),
        onClose: (res) => {
          this.handleCloseSync(currId);
          let handler: EventHandlerRegister | undefined;
          if (
            context &&
            (handler = this.props.Tree.getComponentHandler(context))
          ) {
            handler.event.clearByEvent(VIEW_TREE_EVENT);
          }
          if (onCloseListenner) onCloseListenner(res);
        },
      },
    };

    return {
      start: (options) => {
        if (!options?.delay) return this.startModalSync(entry, context);
        Sleep(options.delay).then(() => this.startModalSync(entry, context));
      },
      close: () => {
        this.handleCloseSync(entry.id);
        if (onCloseListenner) onCloseListenner(undefined);
      },
    };
  };

  private startModal = (
    entry: Entry,
    resolve: (value: any) => void,
    context?: string
  ) => {
    if (context) {
      const componentDetails = this.props.Tree.getComponentDetails(context);
      const handler = this.props.Tree.getComponentHandler(context);
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

  private startModalSync = (entry: Entry, context?: string) => {
    if (context) {
      const componentDetails = this.props.Tree.getComponentDetails(context);
      const handler = this.props.Tree.getComponentHandler(context);
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
