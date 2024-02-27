import type { ComponentType, FC } from "react";

declare type ParametersWithoutFistParam<T extends (...args: any[]) => any> =
  T extends (firstArg: any, ...rest: infer R) => any ? R : never;

export declare type _Object = { [key: string]: any };

export type MethodsWithInstance<IComponent> = {
  [key: string]: (instance: () => IComponent, ...agrs: any[]) => any;
};
export type MethodsWithStore<IStore> = {
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

export default function createUncontrolledFC<
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
