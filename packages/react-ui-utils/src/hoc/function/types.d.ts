import type { ComponentType, FC } from "react";

declare type ParametersWithoutFistParam<T extends (...args: any[]) => any> =
  T extends (firstArg: any, ...rest: infer R) => any ? R : never;

export declare type _Object = { [key: string]: any };

export type UncontrolledFC = <
  IComponent extends (props: P) => React.ReactNode,
  IMethods = IComponent extends (props: infer IProps) => React.ReactNode
    ? IProps extends FunctionalManagerMethods<infer Methods>
      ? Methods
      : {}
    : {},
  P = IComponent extends (props: infer IProps) => React.ReactNode
    ? Omit<IProps, keyof FunctionalManagerMethods<any>>
    : {}
>(
  Comp: IComponent,
  override?: MethodsWithStore<
    IMethods extends FunctionalMethods ? IMethods : {}
  >
) => { methods: IMethods } & Omit<UncontrolledComponent<P>, "getStore">;

export type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};
export type MethodsWithStore<IStore extends FunctionalMethods> = {
  [key: string]: (
    get: <IKey extends keyof IStore>(key: IKey) => IStore[IKey],
    ...agrs: any[]
  ) => any;
};

export interface ContextManager<IMethods extends FunctionalMethods, IProps> {
  Parent: React.ComponentType<IProps>;
  isInstanceMounted: () => boolean;
  managerMethods: IMethods;
}

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
  Component: (props: P) => React.ReactNode;
  isInstanceMounted: () => boolean;
  getStore: () => _Object | undefined;
};

export type InstanceMap<IMethods> = Map<
  keyof IMethods,
  IMethods[keyof IMethods]
>;

export type FunctionalMethodResult<IMethods> = (
  get: <IKey extends keyof IMethods>(key: IKey) => IMethods[IKey],
  ...agrs: any[]
) => any;

export type FunctionalMethods = {
  [key: string]: (...args: any[]) => any;
};

export interface FunctionalManagerMethods<IMethods extends FunctionalMethods> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
}

declare const createUncontrolledFC: UncontrolledFC;

export default createUncontrolledFC;
