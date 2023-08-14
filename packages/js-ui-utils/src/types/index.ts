export type DeepRecord<T, IValue> = {
    [K in keyof T]: T[K] extends object ? DeepRecord<T[K], IValue> : IValue;
  };
  