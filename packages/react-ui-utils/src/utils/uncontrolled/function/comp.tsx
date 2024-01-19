import React, { forwardRef, type ComponentType, type FC } from "react";
import { CommonObject } from "@ihaz/js-ui-utils";
import type { ParametersWithoutFistParam, _Object } from "@utils/types";
import type { MethodsStored, UncontrolledComponent } from "../shared/types";
import type { FunctionalManagerMethods, FunctionalMethods } from "./types";

interface ContextManager<IMethods extends FunctionalMethods<IMethods>, IProps> {
  Parent: ComponentType<IProps>;
  isInstanceMounted: () => boolean;
  managerMethods: MethodsStored<IMethods>;
}

const createFunctionalInstance = <
  IComponent extends FC<P>,
  IMethods,
  P = IComponent extends FC<FunctionalManagerMethods<IMethods> & infer IProps>
    ? IProps
    : {}
>(
  Comp: IComponent
) => {
  const _instance: Partial<IMethods> = {};
  let callbackCalled = false;
  return forwardRef<Partial<IMethods>>((_, ref) => {
    const set: FunctionalManagerMethods<IMethods>["set"] = (key, value) => {
      if (key && value) _instance[key] = value;
      console.log({ _instance, key, value });
      if (!callbackCalled) {
        const refFunc = ref as (x: Partial<IMethods> | null) => void;
        refFunc(_instance);
        callbackCalled = true;
      }
    };

    return (
      <>
        {/* @ts-ignore */}
        <Comp set={set} />
      </>
    );
  });
};

const createFunctionalContextManager = <
  IComponent extends FC<P>,
  IMethods extends FunctionalMethods<IMethods>,
  P = IComponent extends FC<FunctionalManagerMethods<IMethods> & infer IProps>
    ? IProps
    : {}
>(
  Comp: IComponent,
  methods: FunctionalMethods<IMethods>
): ContextManager<IMethods, P> => {
  const Component = createFunctionalInstance<IComponent, IMethods, P>(Comp);
  let instance: Partial<IMethods> | null = null;
  const getInstance = () => instance;
  const isInstanceMounted = () => !!instance;

  const final = CommonObject.createObjectWithGetters(methods, (key, func) => {
    const newFunc = (...args: ParametersWithoutFistParam<typeof func>) => {
      if (!isInstanceMounted())
        throw new Error("Component has not been initializated");
      const currInstance = getInstance();
      if (!currInstance![key])
        throw new Error(
          `Method ${String(key)} has no been setted from uncontrolled component`
        );
      return func(currInstance as IMethods, ...args);
    };
    return newFunc;
  }) as unknown as MethodsStored<IMethods>;
  return {
    Parent: () => {
      const handleRef = (x: Partial<IMethods> | null) => {
        console.log({ x });
        instance = x;
      };
      return <Component ref={handleRef} />;
    },
    managerMethods: final,
    isInstanceMounted,
  };
};

const isFunctionalComponent = (component: any) =>
  typeof component === "function" && !component.prototype.isReactComponent;

export function createUncontrolledFC<
  IComponent extends FC<P>,
  IMethods extends _Object,
  P = IComponent extends FC<FunctionalManagerMethods<IMethods> & infer IProps>
    ? IProps
    : {}
>(
  Comp: IComponent,
  methods: FunctionalMethods<IMethods>
): MethodsStored<FunctionalMethods<IMethods>> &
  Omit<
    UncontrolledComponent<Omit<P, keyof FunctionalManagerMethods<IMethods>>>,
    "getStore"
  > {
  if (!isFunctionalComponent(Comp))
    throw new Error("this Method only allows functional components.");

  const context = createFunctionalContextManager<IComponent, IMethods, P>(
    Comp,
    methods
  );

  return {
    Component: context.Parent,
    isInstanceMounted: context.isInstanceMounted,
    ...context.managerMethods,
  };
}
