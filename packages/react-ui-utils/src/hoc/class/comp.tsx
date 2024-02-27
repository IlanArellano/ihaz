import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import type {
  ParametersWithoutFistParam,
  _Object,
  CustomComponentClass,
  Options,
  UncontolledContextAction,
  UncontrolledContextValue,
  Methods,
  MethodsWithInstance,
  UncontrolledComponent,
} from "./types";

const isClassComponent = (component: any) =>
  typeof component === "function" && !!component.prototype.isReactComponent;

export default function createUncontrolledClassComponent<
  IComponent extends React.Component<P, S>,
  IMethods extends MethodsWithInstance<IComponent>,
  P = IComponent extends React.Component<infer IProps> ? IProps : {},
  S = IComponent extends React.Component<any, infer IState>
    ? IState
    : React.ComponentState
>(
  Comp: CustomComponentClass<IComponent, P, S>,
  methods: IMethods,
  options?: Partial<Options>
): Methods<IComponent, IMethods> & UncontrolledComponent<P> {
  if (!isClassComponent(Comp))
    throw new Error("This Method only allows class components.");

  let instance: IComponent | null = null;
  let ctx: React.Context<UncontrolledContextValue> | undefined;
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
    ctx = React.createContext<UncontrolledContextValue>({
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

  const ComponentContextProvider = ({ children }: React.PropsWithChildren) => {
    const ctxOptions = options && options.contextOptions;
    const reducer = ctxOptions?.reducer;
    const initialValues = ctxOptions?.initialValues;
    const [store, dispatch] = React.useReducer(
      reducer as React.Reducer<_Object | undefined, UncontolledContextAction>,
      initialValues
    );

    _store = store;

    const getStore = () => store;

    return ctx ? (
      <ctx.Provider value={{ getStore, dispatch }}>{children}</ctx.Provider>
    ) : null;
  };

  const Component = (props: Readonly<P>) => {
    React.useEffect(() => {
      if (++mounted_instances > 1) {
        const message =
          "Component instance has been declare more than once in React Tree";
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
