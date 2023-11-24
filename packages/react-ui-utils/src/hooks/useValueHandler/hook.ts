import { useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Execute, ValueHandler } from "@ihaz/js-ui-utils";
import { Value, ValueHandlerResult, ValueSetter } from "./types";

const init = <IValue>(initial?: IValue) =>
  new ValueHandler(initial) as ValueHandler<IValue>;

/**Hook that provides an uncontrolled internal state storing the value with ref, meaning the value handler never affects
 * the component lifecycle
 * ```tsx
 * const Example = () => {
 *const [counter, setCounter] = useValueHandler(0); // initial 0
 *
 *
 * const handleChange = () => {
 *  setCounter(prev => prev + 1); //increment
 * console.log(counter()) //value incremented synchronously
 *}
 *
 * return <button onChange={handleChange}>count: {counter()}</button> //Never changes till you change a state that modify the lifecycle component
 * }
 * ```
 *
 */
export default function useValueHandler<IValue>(
  initial?: Value<IValue>
): ValueHandlerResult<IValue> {
  const value = useRef<ValueHandler<IValue> | null>(null);

  const initialResolved = useMemo(
    () => Execute.executeReturnedValue(initial),
    []
  );

  useImperativeHandle(
    value,
    () => init(initialResolved) as ValueHandler<IValue>,
    []
  );

  const getCurrValue = () =>
    value.current
      ? (value.current?.get() as IValue)
      : (initialResolved as IValue);

  const get = useCallback(getCurrValue, []);

  const set = useCallback(
    (newValue: ValueSetter<IValue>, cb?: (value: IValue) => void) => {
      const final = Execute.executeReturnedValue(newValue, getCurrValue());
      value.current?.set(final);
      if (value.current && cb) cb(final);
    },
    []
  );

  const getDeepCopy = useCallback(
    () => value.current?.getDeepCopy() as IValue,
    []
  );

  return [get, set, { getDeepCopy }];
}
