import {
  Component as ReactComponent,
  ComponentState,
  Context,
  Dispatch,
  StaticLifecycle,
  ValidationMap,
  WeakValidationMap,
  ComponentType,
} from "react";

declare type ParametersWithoutFistParam<T extends (...args: any[]) => any> =
  T extends (firstArg: any, ...rest: infer R) => any ? R : never;

export declare type _Object = { [key: string]: any };

export declare type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};
export declare type MethodsWithStore<IStore> = {
  [key: string]: (
    get: <IKey extends keyof IStore>(key: IKey) => IStore[IKey],
    ...agrs: any[]
  ) => any;
};
export type Methods<
  IComponent,
  IMethodInstance extends MethodsWithInstance<IComponent>
> = {
  [key in keyof IMethodInstance]: (
    ...args: ParametersWithoutFistParam<IMethodInstance[key]>
  ) => ReturnType<IMethodInstance[key]>;
};

export type MethodsStored<
  IMethodInstance extends MethodsWithStore<IMethodInstance>
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

export type InstanceMap<IMethods> = Map<
  keyof IMethods,
  IMethods[keyof IMethods]
>;

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
export default function createUncontrolledClassComponent<
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
