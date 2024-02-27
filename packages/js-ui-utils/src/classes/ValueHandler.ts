import CommonObject from "../namespaces/object";

export abstract class BaseHandler<T> {
  protected abstract value: T;

  /**
   * @deprecated
   *
   */
  getDeepCopy() {
    return CommonObject.DeepCopy(this.value);
  }
}

export default class ValueHandler<T> extends BaseHandler<T> {
  protected value: T;

  constructor(initial: T) {
    super();
    this.value = initial;
  }

  get() {
    return this.value;
  }

  set(value: T) {
    this.value = value;
  }
}
