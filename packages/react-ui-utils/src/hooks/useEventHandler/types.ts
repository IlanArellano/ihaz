export interface HandleEvents<IEvents, IValue> {
  addEventListenner: (event: IEvents, fn: (value: IValue) => void) => void;
  removeEventListenner: (event: IEvents, fn: (value: IValue) => void) => void;
  listen: (event: IEvents, value: IValue) => void;
  listenAll: () => void;
  clearAll: () => void;
}
