declare type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

export interface HandleEvents<IEvents extends string> {
  addEventListenner: (event: IEvents, fn: EventsMap<string>[IEvents]) => void;
  removeEventListenner: (
    event: IEvents,
    fn: EventsMap<string>[IEvents]
  ) => void;
  listen: (
    event: IEvents,
    ...restValues: Parameters<EventsMap<string>[IEvents]>
  ) => void;
  listenAll: () => void;
  clearAll: () => void;
}

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
>(): HandleEvents<Extract<keyof Mapping, string>>;
