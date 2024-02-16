export type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

export interface EventsList<IEvent extends keyof EventsMap<string>> {
  id: IEvent;
  callback: EventsMap<string>[IEvent];
}

export class EventHandler<
  IEvents extends EventsMap<Extract<keyof IEvents, string>>
> {
  private list: EventsList<Extract<keyof IEvents, string>>[];

  constructor() {
    this.list = [];
  }

  public suscribe<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ) {
    this.list.push({ callback, id });
  }

  private checkCallback = (callback: Function) =>
    callback && callback instanceof Function;

  public isAnyEventSuscribed = () => !!this.list.length;

  public isSuscribed = <IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): boolean => {
    if (!this.checkCallback(callback)) return false;
    return this.list.some(
      (evt) =>
        evt.id === id && evt.callback?.toString() === callback?.toString()
    );
  };

  public listen<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ) {
    if (!this.list.length) return;
    this.executeEvent(id, ...restValues);
  }

  private executeEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ) {
    this.list.forEach((x) => {
      if (x.id !== id) return;
      if (x.callback) x.callback(...restValues);
    });
  }

  listenAll() {
    this.list.forEach((evt) => evt && evt.callback && evt.callback());
    this.clearAll();
  }

  public clear<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    callback: EventsMap<string>[IKeyEvents]
  ) {
    if (!this.checkCallback(callback)) return;
    this.list = this.list.filter(
      (evt) =>
        evt.id !== id && evt.callback?.toString() !== callback?.toString()
    );
  }

  public clearByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ) {
    this.list = this.list.filter((evt) => evt.id !== id);
  }

  public clearAll() {
    this.list = [];
  }
}
