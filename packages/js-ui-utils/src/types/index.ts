export type DeepRecord<T, IValue> = {
  [K in keyof T]: T[K] extends object ? DeepRecord<T[K], IValue> : IValue;
};

export type ObjectKey = string | number | symbol;

export type _Object = { [key in ObjectKey]: any };
