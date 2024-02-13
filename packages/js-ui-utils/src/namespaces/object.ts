import { DeepRecord, _Object } from "@utils/types";
import { Client } from "./client";

type MapObjectOut<T, TOut> = { [K in keyof T]: TOut };

export namespace CommonObject {
  export const Omit = <T extends { [k: string]: any }, K extends keyof T>(
    obj: T,
    ...omits: K[]
  ): Omit<T, K> =>
    omits.reduce((prev, curr) => {
      const { [curr]: omitted, ...rest } = prev as T;
      return rest;
    }, obj as Omit<T, K>);

  export const Pick = <T extends { [k: string]: any }, K extends keyof T>(
    obj: T,
    ...picks: K[]
  ): Pick<T, K> =>
    picks.reduce(
      (prev, curr) => ({ ...prev, [curr]: obj[curr] }),
      {} as Pick<T, K>
    );

  export function mapObject<T, TOut>(
    obj: T,
    map: <K extends keyof T>(value: T[K], key: K) => TOut
  ): MapObjectOut<T, TOut> {
    const ret = {} as MapObjectOut<T, TOut>;
    for (const key in obj) {
      const value = obj[key];
      ret[key] = map(value, key);
    }
    return ret;
  }

  export const createObjectWithGetters = <T extends { [key: string]: any }>(
    obj: T,
    get: (key: keyof T, value: T[keyof T]) => any,
    excludedKeys?: (keyof T)[]
  ): T => {
    const newObj = {} as T;
    const hasExcluded = Array.isArray(excludedKeys);

    Object.keys(obj).forEach((key) => {
      Object.defineProperty(newObj, key, {
        get: () =>
          hasExcluded && excludedKeys[key] ? obj[key] : get(key, obj[key]),
      });
    });

    return newObj;
  };

  export const createGetterResource = <
    T extends (...args: any[]) => any,
    IResult extends T extends (...args: any[]) => infer Res ? Res : never
  >(
    func: T
  ): ((...args: any[]) => IResult) => {
    let value: IResult | null = null;
    return function () {
      if (value === null) {
        value = func.apply(null, arguments);
      }
      return value!;
    };
  };

  export function ChangeValueFromObject<
    T extends { [key: string]: any },
    IValue
  >(obj: T, value: IValue): Record<keyof T, IValue>;
  export function ChangeValueFromObject<
    T extends { [key: string]: any },
    IValue
  >(obj: T, value: IValue, deep: boolean): DeepRecord<T, IValue>;
  export function ChangeValueFromObject<
    T extends { [key: string]: any },
    IValue
  >(
    obj: T,
    value: IValue,
    deep?: boolean
  ): DeepRecord<T, IValue> | Record<keyof T, IValue> {
    if (!deep)
      return Object.fromEntries(
        Object.keys(obj).map((x) => [x, value])
      ) as Record<keyof T, IValue>;
    return Object.fromEntries(
      Object.keys(obj).map((x) => {
        const currValue = obj[x as keyof T];
        if (currValue && typeof currValue === "object")
          return [x, ChangeValueFromObject(currValue, value)];
        return [x, value];
      })
    );
  }

  export const DeepEqual = <
    T extends { [key: string]: any },
    U extends { [key: string]: any }
  >(
    obj1: T,
    obj2: U
  ) => {
    if (obj1 === (obj2 as unknown as T)) return true;

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      typeof obj1 === null ||
      typeof obj2 === null
    )
      return false;

    const obj1_keys = Object.keys(obj1);
    const obj2_keys = Object.keys(obj2);

    if (obj1_keys.length !== obj2_keys.length) return false;

    for (const k of obj1_keys) {
      if (!DeepEqual(obj1[k], obj2[k])) return false;
    }

    return true;
  };

  export const objectToString = <T extends _Object>(obj: T): string => {
    if (
      (typeof obj !== "object" && typeof obj !== "function") ||
      obj === null
    ) {
      return String(obj);
    }
    if (typeof obj === "function") {
      return (obj as Function).toString();
    }
    if (Array.isArray(obj)) {
      return (obj as any[]).map((it) => objectToString(it as T)).join("\n");
    }
    const newObj: { [key in keyof T]: string } = {} as {
      [key in keyof T]: string;
    };
    for (let key in obj as T) {
      newObj[key] = objectToString(obj[key]);
    }
    return JSON.stringify(newObj);
  };

  export const DeepCopy = <T>(value: T) =>
    Client.isClientSide()
      ? window.structuredClone(value)
      : (JSON.parse(JSON.stringify(value)) as T);

  export const isEmptyObject = <T extends { [key: string]: any }>(
    obj: T
  ): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return JSON.stringify(obj) === "{}";
  };
}
