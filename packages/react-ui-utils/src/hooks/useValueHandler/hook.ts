import * as React from "react";
import Execute from "@jsUtils/namespaces/execute";
import ValueHandler from "@jsUtils/classes/ValueHandler";
import { Value, ValueHandlerResult, ValueSetter } from "./types";

const init = <IValue>(initial?: IValue) =>
  new ValueHandler(initial) as ValueHandler<IValue>;

export default function useValueHandler<IValue>(
  initial?: Value<IValue>
): ValueHandlerResult<IValue> {
  const value = React.useRef<ValueHandler<IValue> | null>(null);

  const initialResolved = React.useMemo(
    () => Execute.executeReturnedValue(initial),
    []
  );

  React.useImperativeHandle(
    value,
    () => init(initialResolved) as ValueHandler<IValue>,
    []
  );

  const getCurrValue = () =>
    value.current
      ? (value.current?.get() as IValue)
      : (initialResolved as IValue);

  const get = React.useCallback(getCurrValue, []);

  const set = React.useCallback(
    (newValue: ValueSetter<IValue>, cb?: (value: IValue) => void) => {
      const final = Execute.executeReturnedValue(newValue, getCurrValue());
      value.current?.set(final);
      if (value.current && cb) cb(final);
    },
    []
  );

  const getDeepCopy = React.useCallback(
    () => value.current?.getDeepCopy() as IValue,
    []
  );

  return [get, set, { getDeepCopy }];
}
