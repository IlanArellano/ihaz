export declare type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

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

declare abstract class BaseHandler<T> {
  protected abstract value: T;

  /**
   * @deprecated
   *
   */
  public getDeepCopy(): T;
}

declare class ValueHandler<T> extends BaseHandler<T> {
  protected value: T;

  get(): T;
  set(value: T): void;
}

export class ViewTree {
  private componentMountEvents: ValueHandler<EventHandlerRegister[]>;
  private components: ValueHandler<ComponentRegister[]>;

  public registerComponent(entry: ComponentRegister): void;

  public changeStatus(key: string, status: Status): void;

  private modifyEntry(entry: ComponentRegister, index: number): void;

  private addEntry(entry: ComponentRegister): void;

  public getComponentDetails(key: string): ComponentRegister | undefined;
  public getComponentHandler(key: string): EventHandlerRegister | undefined;
}

export declare type _Object = { [key: string]: any };

declare type UncontrolledComponent<P = {}> = {
  Component: (props: P) => React.ReactElement<P>;
  isInstanceMounted: () => boolean;
  getStore: () => _Object | undefined;
};

export declare type OnCloseResult<T> = (result?: T) => void;

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

export declare type ShowFunc = <TProps>(
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

export declare type ShowFuncSync = <TProps>(
  render: React.ComponentType<TProps>,
  props?: Omit<TProps, keyof ViewProps<any>>,
  onCloseListenner?: (
    res: TProps extends ViewProps<infer IResult> ? IResult : never
  ) => void,
  context?: string
) => ViewSyncResult;

export declare type ConditionView = (x: Entry) => boolean;

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
  Component: () => React.ReactElement;
  getTree: () => ViewTree;
  withViewContext: TreeComponent;
}

export declare type IViewManager = Omit<ViewUncontrolledComp, "Component"> &
  ViewMethods;

export declare type TreeComponent = <IProps = any>(
  ComponentWithRef: React.ComponentType<IProps>,
  contextName: string
) => (props: IProps) => React.ReactElement;

export declare type Status = "mounted" | "unmounted";

export interface ComponentRegister {
  key: string;
  status: Status;
}

export declare type EventHandlerRegisterMapping = {
  close: () => void;
};

export interface EventHandlerRegister {
  key: string;
  event: EventHandler<EventHandlerRegisterMapping>;
}

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
export default function createViewManager(): IViewManager;
