import * as React from "react";
import type {
  FunctionalManagerMethods,
  FunctionalMethodResult,
  FunctionalMethods,
  InstanceMap,
  MethodsStored,
  ParametersWithoutFistParam,
} from "./types";
import { createFunctionalInstance } from "./manager";

interface ContextManager<IMethods extends FunctionalMethods<IMethods>, IProps> {
  Parent: React.ComponentType<IProps>;
  isInstanceMounted: () => boolean;
  managerMethods: MethodsStored<IMethods>;
}

export function createFunctionalContextManager<
  IComponent extends React.FC<P>,
  IMethods extends FunctionalMethods<IMethods>,
  P = IComponent extends React.FC<
    FunctionalManagerMethods<IMethods> & infer IProps
  >
    ? IProps
    : {}
>(
  Comp: IComponent,
  methods: FunctionalMethods<IMethods>
): ContextManager<IMethods, P> {
  const Component = createFunctionalInstance<IComponent, IMethods, P>(Comp);
  let instance: InstanceMap<IMethods> | null = null;
  const getInstance = () => instance;
  const isInstanceMounted = () => !!instance;

  const final = Object.fromEntries(
    Object.entries(methods).map((entry) => {
      const [key, func] = entry as [
        keyof IMethods,
        FunctionalMethodResult<IMethods>
      ];
      const newFunc = (...args: ParametersWithoutFistParam<typeof func>) => {
        if (!isInstanceMounted())
          throw new Error("Component has not been initializated");
        const currInstance = getInstance();
        if (!currInstance || !currInstance.has(key))
          throw new Error(
            `Method ${String(
              key
            )} has no been setted from uncontrolled component`
          );
        const get = <IKey extends keyof IMethods>(key: IKey) => {
          return currInstance.get(key) as IMethods[IKey];
        };
        return func(get, ...args);
      };
      return [key, newFunc];
    })
  ) as MethodsStored<IMethods>;
  return {
    Parent: () => {
      const handleRef = (x: InstanceMap<IMethods> | null) => {
        instance = x;
      };
      return <Component ref={handleRef} />;
    },
    managerMethods: final,
    isInstanceMounted,
  };
}
