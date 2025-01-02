import * as React from "react";
export const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>((props, ref) => {
  return <form {...props} ref={ref} />;
});

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input {...props} ref={ref} />);
