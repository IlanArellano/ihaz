export type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

export interface EventsList<IEvent extends keyof EventsMap<string>> {
  id: IEvent;
  callback: EventsMap<string>[IEvent];
}

export type EventHandlerOptions = Partial<{
  callPreviousListener: boolean;
}>;

export default class EventHandler<
  IEvents extends EventsMap<Extract<keyof IEvents, string>>
> {
  private list: EventsList<Extract<keyof IEvents, string>>[];
  private options: EventHandlerOptions;
  private eventArgs: Map<
    Extract<keyof IEvents, string>,
    Parameters<EventsMap<string>[Extract<keyof IEvents, string>]>
  >;

  private _init() {
    this.list = [];
    this.eventArgs = new Map();
  }

  public setOptions(options: EventHandlerOptions) {
    this.options = options || {};
    return this;
  }

  constructor() {
    this._init();
    this.options = {};
  }

  private checkCallback = (callback: Function) =>
    callback && callback instanceof Function;

  public suscribe<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ) {
    if (this.isSuscribed(id, callback)) return;
    this.list.push({ callback, id });
    if (this.options.callPreviousListener && this.eventArgs.has(id))
      callback(...(this.eventArgs.get(id) ?? []));
  }

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

  public isSuscribedByEvent = <
    IKeyEvents extends Extract<keyof IEvents, string>
  >(
    id: IKeyEvents
  ): boolean => {
    return this.list.some((evt) => evt.id === id);
  };

  public listen<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ) {
    this.executeEvent(id, ...restValues);
    if (this.options.callPreviousListener) this.eventArgs.set(id, restValues);
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
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ) {
    if (!this.checkCallback(callback)) return;
    const listFiltered = this.list.filter(
      (evt) =>
        evt.id !== id && evt.callback?.toString() !== callback?.toString()
    );
    if (
      this.options.callPreviousListener &&
      this.list.length - 1 === listFiltered.length
    )
      this.eventArgs.delete(id);
    this.list = listFiltered;
  }

  public clearByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ) {
    const listFiltered = this.list.filter((evt) => evt.id !== id);
    if (
      this.options.callPreviousListener &&
      this.list.length - 1 === listFiltered.length
    )
      this.eventArgs.delete(id);
    this.list = listFiltered;
  }

  public clearAll() {
    this._init();
  }
}
