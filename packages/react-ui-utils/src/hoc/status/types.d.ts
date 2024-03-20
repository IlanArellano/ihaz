import type { ComponentType, Key } from "react";

export declare type ReactKey = Key | null | undefined;

declare type EventsMap<IEvents extends string> = {
  [IEvent in IEvents]: (...args: any[]) => void;
};

interface EventsList<IEvent extends keyof EventsMap<string>> {
  id: IEvent;
  callback: EventsMap<string>[IEvent];
}
export type EventHandlerOptions = Partial<{
  callPreviousListener: boolean;
}>;

export declare class EventHandler<
  IEvents extends EventsMap<Extract<keyof IEvents, string>>
> {
  private list: EventsList<Extract<keyof IEvents, string>>[];
  private options: EventHandlerOptions;
  private eventArgs: Map<
    Extract<keyof IEvents, string>,
    Parameters<EventsMap<string>[Extract<keyof IEvents, string>]>
  >;

  private _init(): void;

  public setOptions(options: EventHandlerOptions): this;

  private checkCallback(callback: Function): boolean;

  public suscribe<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  public isAnyEventSuscribed(): boolean;

  public isSuscribed<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): boolean;

  public isSuscribedByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ): boolean;

  public listen<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  private executeEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: string,
    ...restValues: Parameters<EventsMap<string>[IKeyEvents]>
  ): void;

  listenAll(): void;

  public clear<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents,
    callback: EventsMap<string>[IKeyEvents]
  ): void;

  public clearByEvent<IKeyEvents extends Extract<keyof IEvents, string>>(
    id: IKeyEvents
  ): void;

  public clearAll(): void;
}

interface StatusManagerProps {
  getEvents: () => EventHandler<StatusEventsMapping>;
  internalKey?: ReactKey;
}

export type StatusEventsMapping = {
  onMount: (key: ReactKey) => void;
  onUnmount: (key: ReactKey) => void;
  onUpdate: (
    nextProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    nextState: Readonly<{}>,
    nextContext: any,
    key: ReactKey
  ) => void;
  onCatch: (error: Error, errorInfo: React.ErrorInfo, key: ReactKey) => void;
  onInit: (key: ReactKey) => void;
  onSnapshotBeforeUpdate: (
    prevProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    prevState: Readonly<{}>,
    key: ReactKey
  ) => void;
};

interface WithStatusResult<IProps> {
  Component: (
    props: IProps & Pick<StatusManagerProps, "internalKey">
  ) => React.ReactElement<IProps>;
  addEventListener: <
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(
    id: IKeyEvents,
    callback: StatusEventsMapping[IKeyEvents]
  ) => void;
  removeEventListenner: <
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(
    id: IKeyEvents,
    callback: StatusEventsMapping[IKeyEvents]
  ) => void;
  removeListennersByEvent: <
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(
    id: IKeyEvents
  ) => void;
}

export default function withStatus<IProps = any>(
  Comp: ComponentType<IProps>
): WithStatusResult<IProps>;
