import React from "react";

//GLOBALS
export declare type ReactKey = React.Key | null | undefined;
type _Object = { [key: string]: any };

export declare type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

type ParametersWithoutFistParam<T extends (...args: any[]) => any> = T extends (
  firstArg: any,
  ...rest: infer R
) => any
  ? R
  : never;

export interface ItemManager<IResult, ItemEvents = string> {
  addEventListenner: (
    events: ItemEvents,
    callback: (value: IResult) => void
  ) => void;
  removeEventListenner: (
    events: ItemEvents,
    callback: (value: IResult) => void
  ) => void;
}

declare abstract class BaseHandler<T> {
  protected abstract value: T;

  /**
   * @deprecated This method dosent works in most of cases, recommed use other alternatives
   *
   */
  public getDeepCopy(): T;
}

declare class ValueHandler<T> extends BaseHandler<T> {
  protected value: T;

  get(): T;
  set(value: T): void;
}

export interface EventsList<IEvent extends keyof EventsMap<string>> {
  id: IEvent;
  callback: EventsMap<string>[IEvent];
}

export type EventHandlerOptions = Partial<{
  callPreviousListener: boolean;
}>;

export declare class EventHandler<
  IEvents extends EventsMap<Extract<keyof IEvents, string>>
> {
  private list: EventsList<Extract<keyof IEvents, string>>[];
  private options: EventHandlerOptions;
  private eventArgs: Map<
    Extract<keyof IEvents, string>,
    Parameters<EventsMap<string>[Extract<keyof IEvents, string>]>
  >;

  private _init(): void;

  public setOptions(options: EventHandlerOptions): this;

  private checkCallback(callback: Function): boolean;

  public suscribe<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  public isAnyEventSuscribed(): boolean;

  public isSuscribed<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): boolean;

  public isSuscribedByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ): boolean;

  public listen<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  private executeEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  listenAll(): void;

  public clear<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  public clearByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ): void;

  public clearAll(): void;
}

export class ViewTree {
  private componentMountEvents: Map<
    React.Key,
    EventHandler<EventHandlerRegisterMapping>
  >;
  private components: Map<string, Status>;

  public registerComponent(entry: ComponentRegister): void;

  public changeStatus(key: string, status: Status): void;

  private modifyEntry(entry: ComponentRegister): void;

  private addEntry(entry: ComponentRegister): void;

  public getComponentDetails(key: React.Key): Status;

  public getComponentHandler(
    key: React.Key
  ): EventHandler<EventHandlerRegisterMapping>;
}

//Remote Components
export type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};

export type RemoteInstanceProps = {
  key: symbol;
  /**Indicates whether the instance is global. Components are global when dont have declared a children */
  isGlobal: boolean;
};

export type RemoteInstanceCount = {
  globals: number;
  parents: number;
};

export type RemoteGlobalProps = {
  count: RemoteInstanceCount;
  instanceProps: Map<symbol, RemoteInstanceProps>;
  currentSeq: number;
  name: string;
};

export type RemoteMainContextProviderProps = {
  globalProps: RemoteGlobalProps;
};

export type RemoteMainContextProps = {
  getKey: () => symbol;
  generateKey: () => symbol;
  getInternalProps: () => RemoteInstanceProps | null;
  setInternalProps: (props: Omit<RemoteInstanceProps, "key">) => void;
  registerInstance: (type: keyof RemoteInstanceCount) => void;
  unregisterInstance: (type: keyof RemoteInstanceCount) => void;
  getGlobalInstancesCount: () => RemoteInstanceCount;
};

export type RemoteStoredContextProps = {
  getMethodEntry: <IKey extends keyof FunctionalMethods>(
    key: IKey
  ) => FunctionalMethods[IKey];
  setMethodEntry: <IKey extends keyof FunctionalMethods>(
    key: IKey,
    value: FunctionalMethods[IKey]
  ) => void;
  suscribeWatchValue: (name: string, fn: (value: any) => void) => () => void;
  emitWatchValue: (name: string, value: any) => void;
};

export type RemoteComponentResult<P = {}> = {
  Component: (props: P) => React.ReactElement<P>;
  isMounted: () => boolean;
};

export type RemoteInstance<IMethods extends FunctionalMethods, P> = Omit<
  RemoteComponentResult<P>,
  "getStore"
> & {
  getMethods: () => IMethods;
};

export type RemoteInstanceIntrisic<
  IMethods extends FunctionalMethods,
  P
> = RemoteInstance<IMethods, P> & {
  _internal_: {
    _methods: IMethods;
  };
};

export type RemoteComponent = <
  IComponent extends React.ComponentType<any>,
  IMethods extends FunctionalMethods = IComponent extends React.ComponentType<
    infer IProps
  >
    ? IProps extends FunctionalManagerMethods<infer M>
      ? M
      : {}
    : {},
  P = IComponent extends React.ComponentType<infer IProps>
    ? Omit<IProps, keyof FunctionalManagerMethods<any>>
    : {}
>(
  Comp: IComponent | React.ReactNode,
  options?: RemoteManagerOptions<IMethods>
) => RemoteInstance<IMethods, P>;

export type MethodsWithStore<IStore extends FunctionalMethods> = {
  [key: string]: (
    get: <IKey extends keyof IStore>(key: IKey) => IStore[IKey],
    isInstanceMounted: () => boolean,
    ...agrs: any[]
  ) => any;
};

export interface ContextManager<IMethods extends FunctionalMethods, IProps> {
  Parent: (props: IProps) => React.ReactNode;
  isInstanceMounted: () => boolean;
  managerMethods: IMethods;
}

export type InstanceMap<IMethods> = Map<
  keyof IMethods,
  IMethods[keyof IMethods]
>;

export type FunctionalMethods = {
  [key: string | number | symbol]: (...args: any[]) => any;
};

export interface FunctionalManagerMethods<
  IMethods extends FunctionalMethods,
  IWatchers extends string = string
> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
  watch: (watcher: IWatchers, value: any) => void;
}

export type RemoteManagerOptions<IMethods> = Partial<{
  name: string;
  override: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >;
}>;

//createViewManager
export type OnCloseResult<T> = (result?: T) => void;

export interface ViewProps<IResult = never> {
  /**Close the View, the arg value represents the result of the view when has been closed and resolve
   * the `show` method or call onCloseListener from `showSync` method
   */
  onClose: OnCloseResult<IResult>;
  /**Default value which will returned in `show` or `showSync` method when the binding context
   * component that has registered in `withViewContext` or `useViewContext` was unmounted
   */
  defaultValue?: IResult;
}

export type OmittedViewProps = keyof Pick<ViewProps<any>, "onClose">;

export interface ViewEntry {
  id: number;
  children: React.ReactNode | React.ComponentType<any>;
  props: ViewProps;
}

export interface ViewComponentProps {
  views: ViewEntry[];
}

export interface ViewIdManager {
  currentId: number;
  nextId: number;
}

export type ShowFuncOptions<TProps> = {
  children: React.ReactNode | React.ComponentType<TProps>;
  props?: TProps extends unknown ? never : Omit<TProps, OmittedViewProps>;
  context?: React.Key;
};

export type ShowFuncSyncOptions<TProps> = ShowFuncOptions<TProps> & {
  onCloseListener?: (
    res: TProps extends ViewProps<infer IResult> ? IResult : undefined
  ) => void;
};

export type ViewAsyncResult<TProps> = Promise<
  TProps extends ViewProps<infer TResult> ? TResult : unknown
>;

export type ShowFuncAsync = <TProps>(
  options: ShowFuncOptions<TProps>
) => ViewAsyncResult<TProps>;

export type ShowFuncAsyncWithoutContext = <TProps>(
  options: Omit<ShowFuncOptions<TProps>, "context">
) => ViewAsyncResult<TProps>;

export type ShowFuncAsyncWithoutChildren = <TProps>(
  options: Omit<ShowFuncOptions<TProps>, "children">
) => ViewAsyncResult<TProps>;

export type ShowFuncAsyncOnlyChildren = <TProps>() => ViewAsyncResult<TProps>;

export interface ViewSyncResult {
  start: () => void;
  close: () => void;
}

export type ShowFuncSync = <TProps>(
  options: ShowFuncSyncOptions<TProps>
) => ViewSyncResult;

export type ShowFuncSyncWithoutContext = <TProps>(
  options: Omit<ShowFuncSyncOptions<TProps>, "context">
) => ViewSyncResult;

export type ShowFuncSyncWithoutChildren = <TProps>(
  options: Omit<ShowFuncSyncOptions<TProps>, "children">
) => ViewSyncResult;

export type ShowFuncSyncOnlyChildren = (
  options: Pick<ShowFuncSyncOptions<never>, "onCloseListener">
) => ViewSyncResult;

export type ConditionView = (x: ViewEntry) => boolean;

export interface ViewManagerComponentProps {
  getTree: () => ViewTree;
}

export type ViewRemoteExtraProps = {
  removeEntries: (condition?: ConditionView) => void;
};

export type ViewRemoteComp = {
  showAsync: ShowFuncAsync;
  show: ShowFuncSync;
} & ViewRemoteExtraProps;

export type ViewRemoteCompWithoutChildren = {
  showAsync: ShowFuncAsyncWithoutChildren;
  show: ShowFuncSyncWithoutChildren;
} & ViewRemoteExtraProps;

export type LocalShowViewResult = {
  showAsync: ShowFuncAsyncOnlyChildren;
  show: ShowFuncSyncOnlyChildren;
  showState: boolean;
};

export interface ViewMethods {
  /**Parent Component which create a instance for manage all View Collections. It must be in React Tree for have
   * the access for all the rest of methods
   */
  Component: () => React.ReactElement;
  /**HOC that bind a component to a internal context to close all the views when component was unmounted */
  withViewContext: TreeComponent;
  /**Hook that bind a component to a internal context to close all the views when component was unmounted */
  useViewContext: (contextName: string) => ViewContextHook;
  /**Component tha handle the `View Manager` inside the UI */
  ShowView: React.ForwardRefExoticComponent<
    Omit<WithShowViewOptions, "manager"> &
      React.RefAttributes<ViewRemoteCompWithoutChildren>
  >;
}

export type IViewManager = ViewRemoteComp & ViewMethods;

export enum VIEW_NATIVE_EVENTS {
  CLOSE = "close",
}

export declare type TreeComponent = <IProps = any>(
  ComponentWithRef: React.ComponentType<IProps & ViewContextProps>,
  contextName: string
) => (props: Omit<IProps, keyof ViewContextProps>) => React.ReactElement;

export type Status = "mounted" | "unmounted";

export type WithShowViewOptions = React.PropsWithChildren<{
  manager: IViewManager;
  local?: boolean;
}>;

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

export interface ViewContextHook {
  register: () => void;
  unregister: () => void;
  showAsync: ShowFuncAsyncWithoutContext;
  show: ShowFuncSyncWithoutContext;
  getContext: () => string;
}

export type ViewContextProps = Omit<ViewContextHook, "register" | "unregister">;

//Package Declarations

export declare function useRemoteProps<
  IMethods extends FunctionalMethods
>(): FunctionalManagerMethods<IMethods, string>;

export declare const createRemoteComponent: RemoteComponent;

/**Create a view manager that can handle the mount-unmount behavior from the own parent `Tree` component
   * through the `show` and `onClose` methods. Every component is added
   * to internal Parent component state, components inherit a prop called `onClose` when
   * the method is called it will remove from the internal state, the method can also
   * return a result when the component is closed
   *
   * ```tsx
   * const manager = createViewManager();

const ViewComponent = ({ onClose }: ViewProps<string>) => {
  return (
    <div>
      <h1>View example</h1>
      <button onClick={() => onClose("hello")}>Close</button>
    </div>
  );
};

const Example = () => {
  const onShow = async () => {
    const response = await manager.show(ViewComponent);
    console.log(response); // Hello
  };

  return (
    <div>
      <button onClick={onShow}>Show</button>
      <manager.Component />
    </div>
  );
};

   * 
   * ```
   */
export declare function createViewManager(): IViewManager;

export declare const ShowView: React.ForwardRefExoticComponent<
  WithShowViewOptions & React.RefAttributes<ViewRemoteCompWithoutChildren>
>;

export declare function remoteMethods<IMethods extends FunctionalMethods, P>(
  instance: RemoteInstance<IMethods, P>
): IMethods | null;
