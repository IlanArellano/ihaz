import { useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Execute } from "@utils/common/namespaces/execute";
import { ValueHandler } from "../common/classes/ValueHandler";
import { Value, ValueHandlerResult, ValueSetter } from "@utils/types/ValueHandler";


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

  const get = useCallback(() => {
    const curr = value.current?.get() as IValue;

    return value.current && curr ? curr : (initialResolved as IValue);
  }, []);

  const set = useCallback(
    (newValue: ValueSetter<IValue>, cb?: (value: IValue) => void) => {
      if (!value.current) return;
      const curr = value.current.get() as IValue;
      const final = Execute.executeReturnedValue(
        newValue,
        value.current && curr ? curr : (initialResolved as IValue)
      );
      value.current.set(final);
      if (cb) cb(final);
    },
    []
  );

  const getDeepCopy = useCallback(
    () => value.current?.getDeepCopy() as IValue,
    []
  );

  return [get, set, { getDeepCopy }];
}
