import * as React from "react";
import type {
  RemoteInstanceCount,
  RemoteInstanceProps,
  RemoteMainContextProps,
  RemoteMainContextProviderProps,
} from "@pkg/types";

export const RemoteMainContext = React.createContext<RemoteMainContextProps>(
  undefined as unknown as RemoteMainContextProps
);

export function RemoteMainContextProvider({
  globalProps,
  children,
}: React.PropsWithChildren<RemoteMainContextProviderProps>) {
  const keyRef = React.useRef<symbol | null>(null);
  const internalProps = React.useRef<RemoteInstanceProps | null>(null);

  const getInternalProps = React.useCallback(() => internalProps.current, []);

  const setInternalProps = React.useCallback(
    (props: Omit<RemoteInstanceProps, "key">) => {
      const final: RemoteInstanceProps = {
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
    (type: keyof RemoteInstanceCount) => {
      globalProps.count[type]++;
    },
    [globalProps]
  );

  const unregisterInstance = React.useCallback(
    (type: keyof RemoteInstanceCount) => {
      globalProps.count[type]--;
    },
    [globalProps]
  );

  const getGlobalInstancesCount = React.useCallback(() => {
    return globalProps.count;
  }, [globalProps]);

  return (
    <RemoteMainContext.Provider
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
    </RemoteMainContext.Provider>
  );
}
