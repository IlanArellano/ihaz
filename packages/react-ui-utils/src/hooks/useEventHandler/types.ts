import { type EventsMap } from "@ihaz/js-ui-utils";

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
