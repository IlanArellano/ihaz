import * as React from "react";
import EventHandler, { EventsMap } from "@jsUtils/classes/EventHandler";
import { HandleEvents } from "./types";

export default function useEventHandler<
  Mapping extends EventsMap<string> = any
>(): HandleEvents<Extract<keyof Mapping, string>> {
  type IKeys = Extract<keyof Mapping, string>;
  const eventHandler = React.useRef<EventHandler<Mapping> | null>(null);

  React.useImperativeHandle(
    eventHandler,
    () => new EventHandler<Mapping>(),
    []
  );

  const addEventListenner = React.useCallback(
    <Key extends IKeys>(event: Key, fn: EventsMap<IKeys>[IKeys]) => {
      if (eventHandler.current?.isSuscribed(event, fn)) return;
      eventHandler.current?.suscribe(event, fn);
    },
    []
  );

  const removeEventListenner = React.useCallback(
    <Key extends IKeys>(event: Key, fn: EventsMap<IKeys>[IKeys]) => {
      eventHandler.current?.clear(event, fn);
    },
    []
  );

  const listen = React.useCallback(
    <Key extends IKeys>(
      event: Key,
      ...restValues: Parameters<EventsMap<IKeys>[Key]>
    ) => {
      eventHandler.current?.listen(event, ...restValues);
    },
    []
  );

  const listenAll = React.useCallback(() => {
    eventHandler.current?.listenAll();
  }, []);

  const clearAll = React.useCallback(() => {
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
