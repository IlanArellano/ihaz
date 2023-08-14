type Callback<IValue> = ((value?: IValue) => void) | undefined;

export const getEventId = (event: string) => `_${event}`;

interface EventsList<IValue> {
  id: string;
  callback: Callback<IValue>;
}

export class EventHandler<IValue = any> {
  private list: EventsList<IValue>[] = [];

  suscribe(id: string, callback: Callback<IValue>) {
    this.list.push({ callback, id });
  }

  isAnyEventSuscribed = () => !!this.list.length;

  isSuscribed = (id: string) => this.list.some((evt) => evt.id === id);

  listen(id: string, value?: IValue) {
    if (!this.list.length) return;
    this.executeEvent(id, value);
  }

  private executeEvent(id: string, value?: IValue) {
    this.list.forEach(x => {
      if(x.id !== id) return;
      if(x.callback) x.callback(value);
    })
  }

  listenAll() {
    this.list.forEach((evt) => evt && evt.callback && evt.callback());
    this.clearAll();
  }

  clear(id: string, callback: Callback<IValue>) {
    this.list = this.list.filter((evt) => evt.id !== id && evt.callback !== callback);
  }

  clearByEvent(id: string) {
    this.list = this.list.filter((evt) => evt.id !== id);
  }

  clearAll() {
    this.list = [];
  }

}
