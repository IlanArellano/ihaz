import { CommonObject } from "@ihaz/js-ui-utils";
import React, {
  ComponentType,
  createContext,
  FC,
  forwardRef,
  MutableRefObject,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
} from "react";
import { FunctionalMethods } from "./types";

interface FunctionalManagerMethods<IMethods> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
}

interface ContextManager<IMethods> {
  Provider: ComponentType<PropsWithChildren>;
  managerMethods: FunctionalManagerMethods<IMethods>;
}

const createFunctionalCostumer = <
  IComponent extends FC<FunctionalManagerMethods<IMethods>>,
  IMethods extends FunctionalMethods<IMethods>
>(
  Comp: IComponent
) => {
  return forwardRef<
    IMethods,
    IComponent extends FC<infer IProps> ? IProps : {}
  >((_, ref) => {
    const set: FunctionalManagerMethods<IMethods>["set"] = (key, value) => {
      const methods = (ref as MutableRefObject<IMethods>).current;
      if (value && methods[key]) Object.defineProperty(methods, key, value);
    };

    return <Comp set={set} />;
  });
};

const createFunctionalContextManager = <
  IComponent extends FC<any>,
  IMethods extends FunctionalMethods<IMethods>
>(
  Comp: IComponent,
  methods: IMethods | null
): ContextManager<IMethods> => {
  const Costumer = createFunctionalCostumer(Comp);
  return {
    Provider: ({ children }) => {
      const handleRef = (x: FunctionalManagerMethods<IMethods> | null) => {
        instance = x;
      };
      return <Costumer ref={(ref) => ref} />;
    },
    managerMethods: {
      set,
    },
  };
};

const isFunctionalComponent = (component: any) =>
  typeof component === "function" && !component.prototype.isReactComponent;

export function createUncontrolledFunctionalComponent<
  IComponent extends FC<P>,
  IMethods extends FunctionalMethods<IMethods>,
  P = IComponent extends FC<infer IProps> ? IProps : {}
>(Comp: IComponent, methods: IMethods) {
  if (!isFunctionalComponent(Comp))
    throw new Error("this Method only allows functional components.");

  let methodsCopy: IMethods | null = CommonObject.DeepCopy(methods);
  const FinalComponent = createFunctionalContextManager(Comp, methodsCopy);
}
