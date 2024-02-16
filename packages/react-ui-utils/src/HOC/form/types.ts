import type { ItemManager } from "@utils/types/validation";
import type { PropsWithChildren, ReactNode } from "react";

export type ValidationPredicate<IValue> = (value: IValue) => boolean;

export type FormEventsMapping = {
  change: <T>(result: FormValueState<T>) => void;
};

export type Validation<T> = {
  [K in keyof T]?: T[K] extends object
    ? Validation<T>
    : ValidationPredicate<T[K]>;
};

export interface FormValueState<T> {
  value: T | undefined;
  isValidated: ValidationResolve<T>;
}

export interface FormValueStateResolved<T> {
  /**Returns the current value from the internal form state */
  value: T | undefined;
  /**Returns the current status from the internal form validation if `validate` params is declare */
  isValidated: boolean | undefined;
}

export type ValidationResolve<T> = {
  [K in keyof T]?: T[K] extends object ? ValidationResolve<T> : boolean;
};

export interface FormContext<T = any> {
  value: T | undefined;
  validation?: Validation<T>;
  validationResolved: ValidationResolve<T>;
  onChange:
    | (<Key extends keyof T>(field: Key, value: T[Key]) => void)
    | undefined;
  itemManager: ItemManager<FormValueState<T>, "change">;
}

export type FormProps<T, TProps extends { [k: string]: any }> = {
  render?: React.ComponentType<TProps>;
  ref?: React.Ref<any>;
  onSubmit?: (result: T) => void;
  children?: ReactNode;
} & (Partial<Pick<TProps, "value">> &
  Pick<TProps, Exclude<keyof TProps, "value" | "onChange" | "onSubmit">> & {
    onChange?: TProps["onChange"] | null;
  });

export type FieldProps<TProps extends { [k: string]: any }, T> = {
  render?: React.ComponentType<TProps>;
  field: keyof T;
  ref?: React.Ref<any>;
} & (Partial<Pick<TProps, "value">> &
  Pick<TProps, Exclude<keyof TProps, "value" | "onChange">> & {
    onChange?: TProps["onChange"] | null;
  });

export interface FormManager<T> {
  Form: <
    TProps extends {
      [k: string]: any;
    } = React.InputHTMLAttributes<HTMLInputElement>
  >(
    props: FormProps<T, TProps>
  ) => React.JSX.Element;
  Field: <
    TProps extends {
      [k: string]: any;
    } = React.InputHTMLAttributes<HTMLInputElement>
  >(
    props: FieldProps<TProps, T>
  ) => React.JSX.Element;
  Submit: ({ children }: PropsWithChildren) => React.JSX.Element | null;
  useFormValue: () => FormValueStateResolved<T>;
}
