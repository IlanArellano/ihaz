import React, { forwardRef, useMemo } from "react";
import { CommonObject, Client } from "@ihaz/js-ui-utils";
import { Form, Input } from "./FormComp";
import type { FieldProps, FormProps } from "./types";

export const ControlView = forwardRef<
  any,
  FieldProps<{ [k: string]: any }, any>
>((props, ref) => {
  const Component = props.render;
  const CompProps = useMemo(
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

export const ControlForm = forwardRef<
  any,
  FormProps<any, { [k: string]: any }>
>((props, ref) => {
  const Component = props.render;
  const CompProps = useMemo(
    () => CommonObject.Omit(props, "field", "render", "value", "onChange"),
    [props]
  );

  const isClient = useMemo(() => Client.isClientSide(), []);

  if (!Component) {
    if (isClient) return <Form {...CompProps} ref={ref} />;
    return <>{props.children}</>;
  }
  return <Component ref={ref} {...CompProps} />;
});
