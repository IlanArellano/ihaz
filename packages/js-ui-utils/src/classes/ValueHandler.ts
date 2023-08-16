import { CommonObject } from "@utils/namespaces";

export abstract class BaseHandler<T> {
  abstract value: T;

  getDeepCopy() {
    return CommonObject.DeepCopy(this.value);
  }
}

export class ValueHandler<T> extends BaseHandler<T> {
  value: T;

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
