import * as React from "react";
import type {
  UncontrolledInstanceCount,
  UncontrolledInstanceProps,
  UncontrolledMainContextProps,
  UncontrolledMainContextProviderProps,
} from "@pkg/types";

export const UncontrolledMainContext =
  React.createContext<UncontrolledMainContextProps>(
    undefined as unknown as UncontrolledMainContextProps
  );

export function UncontrolledMainContextProvider({
  globalProps,
  children,
}: React.PropsWithChildren<UncontrolledMainContextProviderProps>) {
  const keyRef = React.useRef<symbol | null>(null);
  const internalProps = React.useRef<UncontrolledInstanceProps | null>(null);

  const getInternalProps = React.useCallback(() => internalProps.current, []);

  const setInternalProps = React.useCallback(
    (props: Omit<UncontrolledInstanceProps, "key">) => {
      const final: UncontrolledInstanceProps = {
        ...props,
        key: keyRef.current!,
      };
      internalProps.current = Object.freeze(Object.create(final));
      globalProps.instanceProps.set(keyRef.current!, Object.create(final));
    },
    []
  );

  const getKey = React.useCallback(() => keyRef.current!, []);

  const generateKey = React.useCallback(() => {
    if (!keyRef.current) {
      keyRef.current = Symbol.for(
        `${globalProps.name}_${++globalProps.currentSeq}`
      );
    }
    return keyRef.current!;
  }, []);

  const registerInstance = React.useCallback(
    (type: keyof UncontrolledInstanceCount) => {
      globalProps.count[type]++;
    },
    [globalProps]
  );

  const unregisterInstance = React.useCallback(
    (type: keyof UncontrolledInstanceCount) => {
      globalProps.count[type]--;
    },
    [globalProps]
  );

  const getGlobalInstancesCount = React.useCallback(() => {
    return globalProps.count;
  }, [globalProps]);

  return (
    <UncontrolledMainContext.Provider
      value={{
        getKey,
        setInternalProps,
        generateKey,
        getInternalProps,
        registerInstance,
        unregisterInstance,
        getGlobalInstancesCount,
      }}
    >
      {children}
    </UncontrolledMainContext.Provider>
  );
}
