declare abstract class BaseHandler<T> {
  protected abstract value: T;

  /**
   * @deprecated
   *
   */
  public getDeepCopy(): T;
}

export type Value<IValue> = IValue | (() => IValue);

export type ValueSetter<IValue> = IValue | ((prev: IValue) => IValue);

export type ValueHandlerResult<IValue> = [
  () => IValue,
  (value: ValueSetter<IValue>, cb?: (newValue: IValue) => void) => void,
  Omit<BaseHandler<IValue>, "value">
];

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
): ValueHandlerResult<IValue>;
