import { ParametersWithoutFistParam, _Object } from "@utils/types";
import {
  Component as ReactComponent,
  ComponentState,
  ComponentType,
  Context,
  Dispatch,
  StaticLifecycle,
  ValidationMap,
  WeakValidationMap,
} from "react";

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

export type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};
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
