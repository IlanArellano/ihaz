import * as React from "react";
import { CommonObject, Client } from "@jsUtils/namespaces";
import { Form, Input } from "./FormComp";
import type { FieldProps, FormProps } from "@utils/types";

export const ControlView = React.forwardRef<
  any,
  FieldProps<{ [k: string]: any }, any>
>((props, ref) => {
  const Component = props.render;
  const CompProps = React.useMemo(
    () => CommonObject.Omit(props, "field", "render", "value", "onChange"),
    [props]
  );
  const value = (props.value as any)?.[props.field];

  const handleChange = (ev: any) => {
    const value = ev.value || ev.target.value || ev;
    props.onChange(props.field, value);
  };

  if (!Component) {
    if (!Client.isClientSide()) return null;
    return (
      <Input {...CompProps} value={value} ref={ref} onChange={handleChange} />
    );
  }

  return (
    <Component {...CompProps} value={value} ref={ref} onChange={handleChange} />
  );
});

export const ControlForm = React.forwardRef<
  any,
  FormProps<any, { [k: string]: any }>
>((props, ref) => {
  const Component = props.render;
  const CompProps = React.useMemo(
    () => CommonObject.Omit(props, "field", "render", "value", "onChange"),
    [props]
  );

  const isClient = React.useMemo(() => Client.isClientSide(), []);

  if (!Component) {
    if (isClient) return <Form {...CompProps} ref={ref} />;
    return <>{props.children}</>;
  }
  return <Component ref={ref} {...CompProps} />;
});
