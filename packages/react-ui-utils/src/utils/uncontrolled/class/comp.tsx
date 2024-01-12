import React, {
  Component as ReactComponent,
  useReducer,
  createContext,
  useEffect,
} from "react";
import type {
  ComponentState,
  Context,
  Reducer,
  PropsWithChildren,
} from "react";
import { ParametersWithoutFistParam, _Object } from "@utils/types";
import { CommonObject } from "@ihaz/js-ui-utils";
import {
  CustomComponentClass,
  Methods,
  MethodsWithInstance,
  Options,
  UncontolledContextAction,
  UncontrolledComponent,
  UncontrolledContextValue,
} from "./types";

const isClassComponent = (component: any) =>
  typeof component === "function" && !!component.prototype.isReactComponent;

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
export function createUncontrolledClassComponent<
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
): Methods<IComponent, IMethods> & UncontrolledComponent<P> {
  if (!isClassComponent(Comp))
    throw new Error("This Method only allows class components.");

  let instance: IComponent | null = null;
  let ctx: Context<UncontrolledContextValue> | undefined;
  let _store: _Object | undefined;
  let mounted_instances = 0;

  const strictMode = options?.strictMode ?? true;

  if (
    options &&
    options.contextOptions &&
    options.contextOptions.initialValues
  ) {
    const initial = options.contextOptions.initialValues;
    const reducer = options.contextOptions.reducer;
    if (!reducer)
      throw new Error(
        "Initial setup context from uncontrolled component needs to declare a reducer"
      );
    ctx = createContext<UncontrolledContextValue>({
      getStore: () => initial,
      dispatch: () => {},
    });
    Comp.contextType = ctx;
  }

  const getInstance = () => instance;

  const getStore = () => Object.freeze(CommonObject.DeepCopy(_store));

  const handleRef = (x: IComponent | null) => {
    instance = x;
  };

  const isInstanceMounted = () => !!instance;

  const ComponentContextProvider = ({ children }: PropsWithChildren) => {
    const ctxOptions = options && options.contextOptions;
    const reducer = ctxOptions?.reducer;
    const initialValues = ctxOptions?.initialValues;
    const [store, dispatch] = useReducer(
      reducer as Reducer<_Object | undefined, UncontolledContextAction>,
      initialValues
    );

    _store = store;

    const getStore = () => store;

    return ctx ? (
      <ctx.Provider value={{ getStore, dispatch }}>{children}</ctx.Provider>
    ) : null;
  };

  const Component = (props: Readonly<P>) => {
    useEffect(() => {
      mounted_instances++;
      if (mounted_instances > 1) {
        const message =
          "Component instance has been declare more than once in DOM";
        if (strictMode) throw new Error(message);
        else console.warn(message);
      }
      return () => {
        mounted_instances--;
      };
    }, []);

    if (ctx) {
      return (
        <ComponentContextProvider>
          <Comp {...(props ?? {})} ref={handleRef} />
        </ComponentContextProvider>
      );
    }
    return <Comp {...(props ?? {})} ref={handleRef} />;
  };

  const final = Object.fromEntries(
    Object.entries(methods).map((method) => {
      const [k, func] = method;
      const newFunc = (...args: ParametersWithoutFistParam<typeof func>) => {
        if (!isInstanceMounted() && strictMode)
          throw Error("Component has not been initializated");
        return func(getInstance as () => IComponent, ...args);
      };
      return [k, newFunc];
    })
  ) as Methods<IComponent, IMethods>;

  return { Component, isInstanceMounted, getStore, ...final };
}
