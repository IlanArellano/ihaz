import { useImperativeHandle, useRef } from "react";
import { EventHandler } from "../common/classes/EventHandler";

const getId = (event: string) => `_${event}`;

export interface HandleEvents<IEvents, IValue> {
  addEventListenner: (event: IEvents, fn: (value: IValue) => void) => void;
  removeEventListenner: (event: IEvents, fn: (value: IValue) => void) => void;
  listen: (event: IEvents, value: IValue) => void;
  listenAll: () => void;
  clearAll: () => void;
}

/**
 * Hook that executes callback suscribing to one or several events into a component
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
  IEvents extends string,
  IValue = any
>(): HandleEvents<IEvents, IValue> {
  const eventHandler = useRef<EventHandler<IValue> | null>(null);

  useImperativeHandle(eventHandler, () => new EventHandler<IValue>(), []);

  const addEventListenner = (event: IEvents, fn: (value: IValue) => void) => {
    const id = getId(event);
    if (eventHandler.current?.isSuscribed(id)) return;
    eventHandler.current?.suscribe(id, fn);
  };

  const removeEventListenner = (
    event: IEvents,
    fn: (value: IValue) => void
  ) => {
    const id = getId(event);
    eventHandler.current?.clear(id, fn);
  };

  const listen = (event: IEvents, value: IValue) => {
    const id = getId(event);
    eventHandler.current?.listen(id, value);
  };

  const listenAll = () => {
    eventHandler.current?.listenAll();
  };

  const clearAll = () => {
    eventHandler.current?.clearAll();
  };

  return {
    addEventListenner,
    removeEventListenner,
    listen,
    listenAll,
    clearAll,
  };
}
