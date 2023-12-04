import React, {
  type FormHTMLAttributes,
  forwardRef,
  type InputHTMLAttributes,
} from "react";

export const Form = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement>
>((props, ref) => {
  return <form {...props} ref={ref} />;
});

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input {...props} ref={ref} />);
