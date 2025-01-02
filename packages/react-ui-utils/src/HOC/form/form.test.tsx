import * as React from "react";
import "@testing-library/jest-dom";
import ReactDOM from "react-dom/client";
import { act } from "@testing-library/react";
import createFormManager from "./main";

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) document.body.removeChild(container);
  container = null;
});

describe("render Form Manager", () => {
  const initial = {
    name: "",
    lastName: "",
    phoneNumber: 0,
  };
  it("should change state from each render field", async () => {
    const { Form, Field } = createFormManager(initial);
    const ExampleForm = () => {
      const onSubmit = (res: typeof initial) => {
        console.log({ res });
      };

      return (
        <>
          <Form onSubmit={onSubmit} id="form">
            <Field field="name" id="name" />
            <Field field="lastName" id="lastName" />
            <Field field="phoneNumber" id="phoneNumber" type="number" />
          </Form>
        </>
      );
    };
    act(() => {
      ReactDOM.createRoot(container!).render(<ExampleForm />);
    });

    const name = document.querySelector<HTMLInputElement>("#name");
    const lastName = document.querySelector<HTMLInputElement>("#lastName");
    const phoneNumber =
      document.querySelector<HTMLInputElement>("#phoneNumber");
    const form = document.querySelector<HTMLFormElement>("#form");

    act(() => {
      name?.dispatchEvent(new KeyboardEvent("change", { code: "4", key: "4" }));
    });
    act(() => {
      lastName?.dispatchEvent(
        new KeyboardEvent("change", { code: "4", key: "4" })
      );
    });
    act(() => {
      phoneNumber?.dispatchEvent(
        new KeyboardEvent("change", { code: "4", key: "4" })
      );
    });

    act(() => {
      form?.submit();
    });

    expect(form).toContainElement(name);
  });
});
