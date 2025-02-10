import * as React from "react";
import EventEmmiter from "@jsUtils/classes/EventEmitter";
import type {
  FunctionalMethods,
  InstanceMap,
  RemoteStoredContextProps,
} from "@pkg/types";

export const RemoteStoredContext =
  React.createContext<RemoteStoredContextProps>(
    undefined as unknown as RemoteStoredContextProps
  );

export function RemoteStoredContextProvider({
  children,
}: React.PropsWithChildren) {
  const methodsMapRef = React.useRef<InstanceMap<FunctionalMethods> | null>(
    null
  );
  const watchEmittersRef = React.useRef<EventEmmiter<
    Record<any, string[]>
  > | null>(null);

  const getEntriesMap = React.useCallback(() => {
    if (!methodsMapRef.current) {
      methodsMapRef.current = new Map();
    }
    return methodsMapRef.current!;
  }, []);

  const getWatchEmitters = React.useCallback(() => {
    if (!watchEmittersRef.current) {
      watchEmittersRef.current = new EventEmmiter();
    }

    return watchEmittersRef.current!;
  }, []);

  const emitWatchValue = React.useCallback((name: string, value: any) => {
    const emitters = getWatchEmitters();
    emitters.emit(name, value);
  }, []);

  const suscribeWatchValue = React.useCallback(
    (name: string, fn: (value: any) => void) => {
      const emitters = getWatchEmitters();
      emitters.on(name, fn);

      return () => {
        emitters.off(name, fn);
      };
    },
    []
  );

  const getMethodEntry = React.useCallback(
    <IKey extends keyof FunctionalMethods>(
      key: IKey
    ): FunctionalMethods[IKey] => {
      return getEntriesMap().get(key)! as FunctionalMethods[IKey];
    },
    []
  );

  const setMethodEntry = React.useCallback(
    <IKey extends keyof FunctionalMethods>(
      key: IKey,
      value: FunctionalMethods[IKey]
    ) => {
      getEntriesMap().set(key, value);
    },
    []
  );

  return (
    <RemoteStoredContext.Provider
      value={{
        getMethodEntry,
        setMethodEntry,
        emitWatchValue,
        suscribeWatchValue,
      }}
    >
      {children}
    </RemoteStoredContext.Provider>
  );
}
