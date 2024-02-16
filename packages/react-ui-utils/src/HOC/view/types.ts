import { EventHandler } from "@ihaz/js-ui-utils";
import { _Object } from "@utils/types";
import { UncontrolledComponent } from "@utils/utils";
import { ComponentType } from "react";
import { ViewTree } from "./tree";

export type OnCloseResult<T> = (result?: T) => void;

export interface ViewProps<IResult = never> {
  onClose: OnCloseResult<IResult>;
}

export interface Entry {
  id: number;
  render: React.ComponentType<any>;
  props: ViewProps;
}

export interface ViewComponentProps {
  views: Entry[];
  nextId: number;
}

export type ShowFunc = <TProps>(
  render: React.ComponentType<TProps>,
  props?: Omit<TProps, keyof ViewProps<any>>,
  context?: string
) => Promise<TProps extends ViewProps<infer TResult> ? TResult : unknown>;

export interface ViewSyncStartOptions {
  delay: number;
}

export interface ViewSyncResult {
  start: (options?: Partial<ViewSyncStartOptions>) => void;
  /**
   *
   * Cierra el modal instanciado, devolviendo el resultado que previamente
   * fue seteado con la llamada @see `onClose` en caso de no ser llamado
   * devolvera undefined, si el modal fue previamente cerrado la funcion no
   * tendrá efecto
   */
  close: () => void;
}

export type ShowFuncSync = <TProps>(
  render: React.ComponentType<TProps>,
  props?: Omit<TProps, keyof ViewProps<any>>,
  onCloseListenner?: (
    res: TProps extends ViewProps<infer IResult> ? IResult : never
  ) => void,
  context?: string
) => ViewSyncResult;

export type ConditionView = (x: Entry) => boolean;

export interface ViewManagerComponentProps {
  getTree: () => ViewTree;
}

export interface ViewUncontrolledComp
  extends UncontrolledComponent<ViewManagerComponentProps> {
  show: ShowFunc;
  showSync: ShowFuncSync;
  removeEntries: (condition?: ConditionView) => void;
}

export interface ViewMethods {
  Component: ComponentType;
  getTree: () => ViewTree;
  withViewContext: TreeComponent;
}

export type IViewManager = Omit<ViewUncontrolledComp, "Component"> &
  ViewMethods;

export type TreeComponent = <T extends _Object>(
  ComponentWithRef: ComponentType<T>,
  contextName: string
) => ComponentType<T>;

export type Status = "mounted" | "unmounted";

export interface ComponentRegister {
  key: string;
  status: Status;
}

export type EventHandlerRegisterMapping = {
  close: () => void;
};

export interface EventHandlerRegister {
  key: string;
  event: EventHandler<EventHandlerRegisterMapping>;
}
