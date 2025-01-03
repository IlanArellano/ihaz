import * as React from "react";
import EventHandler from "@jsUtils/classes/EventHandler";
import ValueHandler from "@jsUtils/classes/ValueHandler";
import CommonObject from "@jsUtils/namespaces/object";
import { ControlForm, ControlView } from "./controlView";
import type {
  FieldProps,
  FormContext,
  FormEventsMapping,
  FormManager,
  FormProps,
  FormValueState,
  FormValueStateResolved,
  Validation,
  ValidationResolve,
} from "@utils/types";

const EvalValidation = <T, Key extends keyof T>(
  value: T[Key],
  key: Key,
  validation: Validation<T>
): ValidationResolve<T> => {
  const validationPredicate = validation[key];
  let result: ValidationResolve<T> = {};
  if (validationPredicate instanceof Function)
    result = {
      [key]: validationPredicate(value),
    } as ValidationResolve<T>;
  if (
    validationPredicate &&
    typeof validationPredicate === "object" &&
    !Array.isArray(validationPredicate)
  )
    result = EvalValidation(value, key, validationPredicate as Validation<T>);

  return result;
};

const CheckValidation = <T,>(
  validationResolved: ValidationResolve<T>
): boolean =>
  Object.keys(validationResolved).some((x) => {
    const v = validationResolved[x as keyof T];
    if (v && typeof v === "object" && !Array.isArray(v))
      return CheckValidation(v as ValidationResolve<T>);
    return v === true;
  });

export default function createFormManager<T extends { [key: string]: any }>(
  initial: T,
  validation?: Validation<T>
): FormManager<T> {
  if (!initial) throw new Error("initial form value not provided");
  if (typeof initial !== "object" || Array.isArray(initial))
    throw new Error(
      `initial value allows only object values but it provides ${
        Array.isArray(initial) ? "array" : typeof initial
      }`
    );
  const _event = new EventHandler<FormEventsMapping>();
  const _field_register = new ValueHandler<(keyof T)[]>([]);
  const initialFormCtx: FormContext<T> = {
    value: initial,
    itemManager: {
      addEventListenner: (event, fn) => {
        _event.suscribe(event, fn);
      },
      removeEventListenner: (event, fn) => {
        _event.clear(event, fn);
      },
    },
    onChange: undefined,
    validation,
    validationResolved: {},
  };

  const FormCxt = React.createContext<FormContext<T>>(
    initialFormCtx as FormContext<T>
  );

  class Form<
    TProps extends {
      [k: string]: any;
    } = React.FormHTMLAttributes<HTMLFormElement>
  > extends React.PureComponent<
    FormProps<T, TProps>,
    { value: T; validationResolved: ValidationResolve<T> }
  > {
    private formRef: React.RefObject<T>;
    constructor(props: FormProps<T, TProps>) {
      super(props);
      this.state = {
        value: initial,
        validationResolved: validation
          ? CommonObject.ChangeValueFromObject(validation as T, false, true)
          : {},
      };
      this.formRef = React.createRef();
    }

    handleChange = <Key extends keyof T>(field: Key, value: T[Key]) => {
      const newValue = { ...this.state.value, [field]: value };
      const validationPredicate: ValidationResolve<T> = validation
        ? EvalValidation(value, field, validation)
        : {};
      this.setState((prev) => ({
        ...prev,
        value: newValue,
        validationResolved: {
          ...prev.validationResolved,
          ...validationPredicate,
        },
      }));
      _event.listen("change", {
        value: newValue,
        isValidated: validationPredicate,
      });
    };

    handleSubmit = (ev: any) => {
      if (ev.preventDefault) ev.preventDefault();
      if (validation && !CheckValidation(this.state.validationResolved)) return;
      if (this.props.onSubmit) this.props.onSubmit(this.state.value);
    };

    getFormRef = () => {
      return this.formRef;
    };

    render() {
      const { value, validationResolved } = this.state;
      return (
        <FormCxt.Provider
          value={{
            ...initialFormCtx,
            value,
            onChange: this.handleChange.bind(this),
            validationResolved,
          }}
        >
          <ControlForm
            {...this.props}
            value={value}
            onSubmit={this.handleSubmit.bind(this)}
            ref={this.formRef}
          />
        </FormCxt.Provider>
      );
    }
  }

  function Submit({ children }: React.PropsWithChildren) {
    const formCtx = React.useContext(FormCxt);

    const _eval = React.useMemo(
      () => CheckValidation(formCtx.validationResolved),
      [formCtx.validationResolved]
    );

    if (!_eval) return null;
    return <>{children}</>;
  }

  function FieldComp<
    TProps extends {
      [k: string]: any;
    } = React.InputHTMLAttributes<HTMLInputElement>
  >(props: FieldProps<TProps, T>, ref: React.ForwardedRef<any>) {
    const formctx = React.useContext(FormCxt);
    if (formctx === undefined)
      throw new Error(
        "<Field> Component only can be rendered by <Form> Component from the HOC call"
      );

    React.useEffect(() => {
      _field_register.set(_field_register.get().concat(props.field));
      if (_field_register.get().filter((x) => x === props.field).length > 1) {
        console.warn(
          `Field '${
            props.field as string
          }' has been declare more than once, it might cause some conflicts`
        );
      }

      return () => {
        if (_field_register.get().some((x) => x === props.field))
          _field_register.set(
            _field_register.get().filter((x) => x !== props.field)
          );
      };
    }, []);

    function handleChange<Key extends keyof T>(key: Key, newValue: T[Key]) {
      if (formctx.onChange) formctx.onChange(key, newValue);
    }

    const isDisabled = props.onChange === null || props.disabled;

    return (
      <ControlView
        {...props}
        value={formctx.value?.[props.field]}
        onChange={!isDisabled && handleChange}
        disabled={isDisabled}
        ref={ref}
      />
    );
  }

  const Field = React.forwardRef(
    FieldComp as <
      TProps extends {
        [k: string]: any;
      } = React.InputHTMLAttributes<HTMLInputElement>
    >(
      props: FieldProps<TProps, T>
    ) => ReturnType<typeof FieldComp>
  ) as FormManager<T>["Field"];

  function useFormValue() {
    const { value: FormValue, itemManager } = React.useContext(FormCxt);
    const [value, setValue] = React.useState<FormValueStateResolved<T>>(() => ({
      value: FormValue,
      isValidated: undefined,
    }));

    React.useEffect(() => {
      const listenner = (state: FormValueState<T>) => {
        const validated = CheckValidation(state.isValidated);
        setValue({
          value: state.value,
          isValidated: validated,
        });
      };

      itemManager.addEventListenner("change", listenner);

      return () => {
        itemManager.removeEventListenner("change", listenner);
      };
    }, []);

    return value;
  }

  return {
    Field,
    Form: Form as unknown as FormManager<T>["Form"],
    useFormValue,
    Submit,
  };
}
