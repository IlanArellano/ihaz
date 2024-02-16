import { EventHandler, EventsMap } from "@ihaz/js-ui-utils";
import { useCallback, useImperativeHandle, useRef } from "react";
import { HandleEvents } from "./types";

/**
 * Hook that executes a callback suscribing to one or several events into a component
 * ```tsx
 * const Example = () => {
    const { addEventListenner, removeEventListenner, listen } = useEventHandler<"change", string>();

    useEffect(() => {
      const listenner = (result: string) => {
        console.log("result: ", result)
      };
      addEventListenner("change", listenner); // Suscribing callback to Change event

      return () => {
        removeEventListenner("change", listenner); // Unsuscribing callback to Change event
      }
    },[]);

    const handleFetch = async () => {
      const res = await fetch("myapi");
      listen("change", await res.text()) // Listen Change event
    }

    return <button onClick={handleFetch}>Fetch</button>
  }

 * ```
 */
export default function useEventHandler<
  Mapping extends EventsMap<string> = any
>(): HandleEvents<Extract<keyof Mapping, string>> {
  type IKeys = Extract<keyof Mapping, string>;
  const eventHandler = useRef<EventHandler<Mapping> | null>(null);

  useImperativeHandle(eventHandler, () => new EventHandler<Mapping>(), []);

  const addEventListenner = useCallback(
    <Key extends IKeys>(event: Key, fn: EventsMap<IKeys>[IKeys]) => {
      if (eventHandler.current?.isSuscribed(event, fn)) return;
      eventHandler.current?.suscribe(event, fn);
    },
    []
  );

  const removeEventListenner = useCallback(
    <Key extends IKeys>(event: Key, fn: EventsMap<IKeys>[IKeys]) => {
      eventHandler.current?.clear(event, fn);
    },
    []
  );

  const listen = useCallback(
    <Key extends IKeys>(
      event: Key,
      ...restValues: Parameters<EventsMap<IKeys>[Key]>
    ) => {
      eventHandler.current?.listen(event, ...restValues);
    },
    []
  );

  const listenAll = useCallback(() => {
    eventHandler.current?.listenAll();
  }, []);

  const clearAll = useCallback(() => {
    eventHandler.current?.clearAll();
  }, []);

  return {
    addEventListenner,
    removeEventListenner,
    listen,
    listenAll,
    clearAll,
  };
}
