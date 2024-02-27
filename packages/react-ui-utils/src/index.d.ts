import type {
  EffectCallback,
  DependencyList,
  ComponentType,
  PropsWithChildren,
  ReactNode,
  Key,
  Component as ReactComponent,
  ComponentState,
  Context,
  Dispatch,
  StaticLifecycle,
  ValidationMap,
  WeakValidationMap,
  FC,
} from "react";
//GLOBALS
export declare type ReactKey = Key | null | undefined;
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

export interface EventsList<IEvent extends keyof EventsMap<string>> {
  id: IEvent;
  callback: EventsMap<string>[IEvent];
}

declare class EventHandler<
  IEvents extends EventsMap<Extract<keyof IEvents, string>>
> {
  private list: EventsList<Extract<keyof IEvents, string>>[];

  public suscribe<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  private checkCallback(callback: Function): boolean;

  public isAnyEventSuscribed(): boolean;

  public isSuscribed<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): boolean;

  public listen<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  private executeEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  public listenAll(): void;

  public clear<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  public clearByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ): void;

  public clearAll(): void;
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

/* --- Hooks ---*/
export declare type EffectResult = void | EffectCallback;

//UseEffectAsync
/**Effect  with same function as `React.useEffect` that can be declared a promise in the callback
 * 
 * ```tsx
 * const Example = () => {
  const [value, setValue] = useState();

  useEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api)
  },[]);

  return <div>{value}</div>
}
 * ```
 */
export declare function useEffectAsync(
  effect: () => Promise<EffectResult>,
  deps?: DependencyList
): void;

//useIntervalEffect
export interface IntervalEffectMethods {
  /**Executes the interval if it has been stopped before */
  start: () => void;
  /**Stop the interval effect execution. When the method is called
   * the current effect´s cleanup could be execute before the effect`s cleanup
   */
  stop: (executeCallbackCleanup?: boolean) => void;
}
/**Hook that execute a callback into a Interval
 *
 * ```tsx
const Example = () => {
  const [count, setCount] = useState(0);
  const { restart, stop } = useIntervalEffect(
    ({ count }) => {
      console.log(count); // Shows the current count value in every interval
      setCount((prev) => prev + 1);
    },
    1000,
    { count }
  ); //Executes effect every second

  return (
    <div>
      <button onClick={() => restart()}>Restart</button>
      <button onClick={() => stop()}>Stop</button>
      <span>{count}</span>
    </div>
  );
};
```
 *
 */
export declare function useIntervalEffect<IDeps = {}>(
  effect: (intervalValues: IDeps) => EffectResult,
  ms?: number,
  intervalValues?: IDeps,
  inmediate?: boolean
): IntervalEffectMethods;

//useEventHandler
export interface HandleEvents<IEvents extends string> {
  addEventListenner: (event: IEvents, fn: EventsMap<string>[IEvents]) => void;
  removeEventListenner: (
    event: IEvents,
    fn: EventsMap<string>[IEvents]
  ) => void;
  listen: (
    event: IEvents,
    ...restValues: Parameters<EventsMap<string>[IEvents]>
  ) => void;
  listenAll: () => void;
  clearAll: () => void;
}

/**
 * Hook that executes a callback suscribing to one or several events into a component
 * ```tsx
 * const Example = () => {
    const { addEventListenner, removeEventListenner, listen } = useEventHandler<"change", string>();

    useEffect(() => {
      const listenner = (result: string) => {
        console.log("result: ", result)
      };
      addEventListenner("change", listenner); // Suscribing callback to Change event

      return () => {
        removeEventListenner("change", listenner); // Unsuscribing callback to Change event
      }
    },[]);

    const handleFetch = async () => {
      const res = await fetch("myapi");
      listen("change", await res.text()) // Listen Change event
    }

    return <button onClick={handleFetch}>Fetch</button>
  }

 * ```
 */
export declare function useEventHandler<
  Mapping extends EventsMap<string> = any
>(): HandleEvents<Extract<keyof Mapping, string>>;

//useLayoutEffectAsync
/**Effect with same function as `React.useLayoutEffect` that can be declared a promise in the callback
 * 
 * ```tsx
 * const Example = () => {
  const [value, setValue] = useState();

  useLayoutEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api)
  },[]);

  return <div>{value}</div>
}
 * ```
 */
export declare function useLayoutEffectAsync(
  effect: () => Promise<EffectResult>,
  deps: DependencyList
): void;

//useValueHandler
export declare type Value<IValue> = IValue | (() => IValue);

export declare type ValueSetter<IValue> = IValue | ((prev: IValue) => IValue);

export declare type ValueHandlerResult<IValue> = [
  () => IValue,
  (value: ValueSetter<IValue>, cb?: (newValue: IValue) => void) => void,
  Omit<BaseHandler<IValue>, "value">
];
/**Hook that provides an uncontrolled internal state storing the value with ref, meaning the value handler never affects
 * the component lifecycle
 * ```tsx
 * const Example = () => {
 *const [counter, setCounter] = useValueHandler(0); // initial 0
 *
 *
 * const handleChange = () => {
 *  setCounter(prev => prev + 1); //increment
 * console.log(counter()) //value incremented synchronously
 *}
 *
 * return <button onChange={handleChange}>count: {counter()}</button> //Never changes till you change a state that modify the lifecycle component
 * }
 * ```
 *
 */
export declare function useValueHandler<IValue>(
  initial?: Value<IValue>
): ValueHandlerResult<IValue>;

/* --- HOCs ---*/
//createFormManager
export type ValidationPredicate<IValue> = (value: IValue) => boolean;

export type FormEventsMapping = {
  change: <T>(result: FormValueState<T>) => void;
};

export type Validation<T> = {
  [K in keyof T]?: T[K] extends object
    ? Validation<T>
    : ValidationPredicate<T[K]>;
};

export interface FormValueState<T> {
  value: T | undefined;
  isValidated: ValidationResolve<T>;
}

export interface FormValueStateResolved<T> {
  /**Returns the current value from the internal form state */
  value: T | undefined;
  /**Returns the current status from the internal form validation if `validate` params is declare */
  isValidated: boolean | undefined;
}

export type ValidationResolve<T> = {
  [K in keyof T]?: T[K] extends object ? ValidationResolve<T> : boolean;
};

export interface FormContext<T = any> {
  value: T | undefined;
  validation?: Validation<T>;
  validationResolved: ValidationResolve<T>;
  onChange:
    | (<Key extends keyof T>(field: Key, value: T[Key]) => void)
    | undefined;
  itemManager: ItemManager<FormValueState<T>, "change">;
}

export type FormProps<T, TProps extends { [k: string]: any }> = {
  render?: React.ComponentType<TProps>;
  ref?: React.Ref<any>;
  onSubmit?: (result: T) => void;
  children?: ReactNode;
} & (Partial<Pick<TProps, "value">> &
  Pick<TProps, Exclude<keyof TProps, "value" | "onChange" | "onSubmit">> & {
    onChange?: TProps["onChange"] | null;
  });

export type FieldProps<TProps extends { [k: string]: any }, T> = {
  render?: React.ComponentType<TProps>;
  field: keyof T;
  ref?: React.Ref<any>;
} & (Partial<Pick<TProps, "value">> &
  Pick<TProps, Exclude<keyof TProps, "value" | "onChange">> & {
    onChange?: TProps["onChange"] | null;
  });

export interface FormManager<T> {
  Form: <
    TProps extends {
      [k: string]: any;
    } = React.InputHTMLAttributes<HTMLInputElement>
  >(
    props: FormProps<T, TProps>
  ) => React.JSX.Element;
  Field: <
    TProps extends {
      [k: string]: any;
    } = React.InputHTMLAttributes<HTMLInputElement>
  >(
    props: FieldProps<TProps, T>
  ) => React.JSX.Element;
  Submit: ({ children }: PropsWithChildren) => React.JSX.Element | null;
  useFormValue: () => FormValueStateResolved<T>;
}

/**
 * @experimental
 * Returns a Form enviroment that provides a `Form` component that can be used and handled by internal state using a `Field`
 * component that can change every prop from the state
 * @param initial Initial value state
 * @param validation A callback collection that evaluate a validation to every prop of the state 
 *
 * ```tsx
 * const initial = {
  name: "",
  lastName: "",
  age: 0,
  birthAge: new Date(),
};

const { Form, Field, Submit, useFormValue } = createFormManager(initial, {
  name: (value) => value.length > 10, // Validation for the name
});
 *const Component = () => {
  const { value, isValidated } = useFormValue();

  const onSubmit = (result: typeof initial) => {
    console.log(result); // Current state of form value
    //...
  };

  return (
    <Form onSubmit={onSubmit}>
      <Field field="name" />
      <Field field="lastName" />
      <Field field="birthAge" />
      <Field field="age" />
      <Submit>
        <button type="submit">submit</button>
      </Submit>
    </Form>
  );
};
 * ```
 */
export declare function createFormManager<
  T extends {
    [key: string]: any;
  }
>(initial: T, validation?: Validation<T>): FormManager<T>;

//withStatus
export interface StatusManagerProps {
  getEvents: () => EventHandler<StatusEventsMapping>;
  internalKey?: ReactKey;
}
export type StatusEventsMapping = {
  onMount: (key: ReactKey) => void;
  onUnmount: (key: ReactKey) => void;
  onUpdate: (
    nextProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    nextState: Readonly<{}>,
    nextContext: any,
    key: ReactKey
  ) => void;
  onCatch: (error: Error, errorInfo: React.ErrorInfo, key: ReactKey) => void;
  onInit: (key: ReactKey) => void;
  onSnapshotBeforeUpdate: (
    prevProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    prevState: Readonly<{}>,
    key: ReactKey
  ) => void;
};

interface WithStatusResult<IProps> {
  Component: ComponentType<IProps>;
  addEventListener: <
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(
    id: IKeyEvents,
    callback: StatusEventsMapping[IKeyEvents]
  ) => void;
}

export declare function withStatus<IProps = any>(
  Comp: ComponentType<IProps>
): WithStatusResult<IProps>;

//Uncontrolled Components
export type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};
//Class
export interface CustomComponentClass<
  IComponent extends ReactComponent,
  P,
  S = ComponentState
> extends StaticLifecycle<P, S> {
  new (props: P, context?: any): IComponent;
  propTypes?: WeakValidationMap<P> | undefined;
  contextType?: Context<any> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  childContextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

export type UncontolledContextAction = {
  type: string;
  payload: _Object;
};

export interface UncontrolledContextValue<
  State = _Object,
  Action = UncontolledContextAction
> {
  getStore: () => State | undefined;
  dispatch: Dispatch<Action>;
}

export interface UncontrolledContext {
  reducer: (state: _Object, action: UncontolledContextAction) => _Object;
  initialValues: _Object;
}

export interface Options {
  strictMode: boolean;
  contextOptions: UncontrolledContext;
}

export type Methods<
  IComponent,
  IMethodInstance extends MethodsWithInstance<IComponent>
> = {
  [key in keyof IMethodInstance]: (
    ...args: ParametersWithoutFistParam<IMethodInstance[key]>
  ) => ReturnType<IMethodInstance[key]>;
};

export type UncontrolledComponent<P = {}> = {
  Component: ComponentType<P>;
  isInstanceMounted: () => boolean;
  getStore: () => _Object | undefined;
};

/**Provides a React Class Component that internal methods can be malipulated by other React component throught their own instance
 * 
 * @param {IComponent} Comp
 * @param {IMethods} methods
 * @param {Options} options
 * 
 * ```tsx
 * import { Component } from "react";
*import {createUncontrolledClassComponent} from "@ihaz/react-ui-utils";
*
*class ExampleClassComponent extends Component<any, {selector: number}> {
 *   constructor(props: any) {
  *      super(props);
   *     this.state = {
   *         selector: 1
   *     }
   * }
*
 *   getSelector = () => this.state.selector;
 *   changeSelector = (new_selector: number) => this.setState({ selector: new_selector });
*
 *   render() {
  *      return ... //JSX
   * }
*}
*
*
*const UncontrolledExample = createUncontrolledClassComponent(ExampleClassComponent, {
 *   getSelector: (instance) => instance().getSelector(),
 * changeSelector: (instance, new_selector: number) => instance().changeSelector(new_selector),
*});
*
*
*export const Main = () => {
*
 *   const show = () => {
  *      console.log(UncontrolledExample.getSelector()) // 1
   * }
   *   const changeSelector = () => {
  *  UncontrolledExample.changeSelector(2); //Changes internal selector state to 2
  * };
*
 *   return <>
  *  <UncontrolledExample.Component />
   * <button onClick={show}>Show Selector</button>
   * <button onClick={changeSelector}>Change Selector</button>
   * </>
*}
```
 */
export declare function createUncontrolledClassComponent<
  IComponent extends ReactComponent<P, S>,
  IMethods extends MethodsWithInstance<IComponent>,
  P = IComponent extends ReactComponent<infer IProps> ? IProps : {},
  S = IComponent extends ReactComponent<any, infer IState>
    ? IState
    : ComponentState
>(
  Comp: CustomComponentClass<IComponent, P, S>,
  methods: IMethods,
  options?: Partial<Options>
): Methods<IComponent, IMethods> & UncontrolledComponent<P>;

//Function
export type FunctionalMethodResult<IMethods> = (
  get: <IKey extends keyof IMethods>(key: IKey) => IMethods[IKey],
  ...agrs: any[]
) => any;

export type FunctionalMethods<IMethods> = {
  [key in keyof IMethods]: FunctionalMethodResult<IMethods>;
};

export interface FunctionalManagerMethods<IMethods> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
}

export type MethodsStored<
  IMethodInstance extends MethodsWithStore<IMethodInstance>
> = {
  [key in keyof IMethodInstance]: (
    ...args: ParametersWithoutFistParam<IMethodInstance[key]>
  ) => ReturnType<IMethodInstance[key]>;
};

export type MethodsWithStore<IStore> = {
  [Key in keyof IStore]: FunctionalMethodResult<IStore>;
};

export declare function createUncontrolledFC<
  IComponent extends FC<P>,
  IMethods extends _Object,
  P = IComponent extends FC<FunctionalManagerMethods<IMethods> & infer IProps>
    ? IProps
    : {}
>(
  Comp: IComponent,
  methods: FunctionalMethods<IMethods>
): MethodsStored<any> &
  Omit<
    UncontrolledComponent<Omit<P, keyof FunctionalManagerMethods<IMethods>>>,
    "getStore"
  >;

//createViewManager
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

/* --- Cache ---*/
declare class CacheManager<T = any> {
  private store: CacheState<T>;

  public getStore(): CacheState<T>;

  private reducer(action: AppCacheAction): CacheState<T>;

  public dispatch(action: AppCacheAction): void;
}

export type CacheResourceFuncWithInstance = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  resourceConf: CacheConfig<Extract<keyof T, string>>
) => NamedResource<T, TName>;

export interface ICacheResourceUncontrolled {
  key: string;
  createCache: CacheResourceFuncWithInstance;
  getCacheStore: () => CacheState;
  clearCache: () => void;
}

export interface CacheManagers {
  key: string;
  manager: CacheManager;
}

export type CacheActions = "cache" | "clear";

export type JSONValue =
  | string
  | number
  | boolean
  | {}
  | any[]
  | null
  | undefined;

export type CachePayload = JSONValue | PromiseLike<JSONValue>;

export interface CacheValue {
  payload: CachePayload;
  async: boolean;
}

export interface CacheEntry {
  id: number;
  args: JSONValue[];
  value: CacheValue;
}

export interface CacheConfig<IKeys extends string> {
  cache?: IKeys[];
  clear?: IKeys[];
  depends?: string[];
}

export interface FunctionCache {
  entries: CacheEntry[];
  error?: Error;
}

export type CacheResource<T> = {
  [key in keyof T]: FunctionCache;
};

export type CacheState<T = any> = {
  [key: string]:
    | {
        cache: CacheResource<T>;
        depends: string[];
      }
    | undefined;
};

export type AppCacheAction =
  | {
      type: "clear";
    }
  | {
      type: "resource";
      payload: {
        resource: string;
        /**Nombres de los resources que dependen de este resource */
        depends: string[];
        action: ResourceCacheAction<string>;
      };
    }
  | {
      type: "clearRec";
      payload: {
        resource: string;
      };
    };

export type ResourceCacheAction<TKeys extends string> =
  | {
      type: "clear";
      payload: { config: CacheConfig<TKeys> };
    }
  | {
      type: "func";
      payload: { func: TKeys; action: FunctionCacheAction };
    };

export type FunctionCacheAction =
  | {
      type: "setEntry";
      payload: { entry: CacheEntry; config: CacheResourceConfig };
    }
  | {
      type: "clear";
    }
  | {
      type: "resolvePromise";
      payload: { id: number; value: JSONValue };
    }
  | {
      type: "error";
      payload: { error: Error };
    };

export interface CacheResourceConfig {
  /**Cantidad máxima de elementos en el cache */
  maxSize: number;
}

/**Un objeto de funciones */
export type Resource<TKeys extends string> = {
  [K in TKeys]: (...args: any[]) => any;
};

export type ResourceFuncs<T> = {
  [K in keyof T]: T[K];
};

export type NamedResource<T extends Resource<string>, TName extends string> = {
  /**Nombre del resource */
  name: TName;
  /**Nombre de los resources que se deben de limpiar al invalidar este resourceks*/
  depends: string[];

  /**Funciones del resource */
  funcs: ResourceFuncs<T>;
};

export type CacheResourceFunc = <
  T extends Resource<string>,
  TName extends string
>(
  name: TName,
  resource: T,
  resourceConf: CacheConfig<Extract<keyof T, string>>
) => NamedResource<T, TName>;

/**
 * Cache Resource Manager
 * @deprecated
 * These methods is no longer supported and it will be remove in future versions, use `@ihaz/cache-manager` package instead
 */
export declare namespace CacheResource {
  /**Clear all Cache by the key of any `Resource Managers` created by `createCacheResources` method
   * @deprecated
   * This method is no longer supported and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function clearCacheByResource(key: string): void;
  /**Creates a enviroment that can set a method's collection
   * @deprecated
   * This method is no longer support and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function createCacheResources(): ICacheResourceUncontrolled;
  /**Remove the Cache for all the store from `Resource Managers` created
   * @deprecated
   * This method is no longer support and it will be remove in future versions, use `@ihaz/cache-manager` package instead
   */
  export function clearAllCache(): void;
}
