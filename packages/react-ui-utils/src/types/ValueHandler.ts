import { BaseHandler } from "@utils/common/classes/ValueHandler";

export type Value<IValue> = IValue | (() => IValue);

export type ValueSetter<IValue> = IValue | ((prev: IValue) => IValue);

export type ValueHandlerResult<IValue> = [
  () => IValue,
  (value: ValueSetter<IValue>, cb?: (newValue: IValue) => void) => void,
  Omit<BaseHandler<IValue>, "value">
];