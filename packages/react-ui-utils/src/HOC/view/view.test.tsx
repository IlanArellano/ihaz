import * as React from "react";
import "@testing-library/jest-dom";
import createViewManager from "./create";
import ReactDOM from "react-dom/client";
import { act } from "@testing-library/react";
import { ViewProps } from "./types";

interface ExampleProps extends ViewProps<boolean> {
  message: string;
}

const Example = ({ message }: ExampleProps) => {
  return <span>Show View {message}</span>;
};
let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) document.body.removeChild(container);
  container = null;
});

describe("render View to show components", () => {
  it("should render by show method", async () => {
    const manager = createViewManager();
    act(() => {
      ReactDOM.createRoot(container!).render(<manager.Component />);
    });
    const message = "Hello";

    act(() => {
      manager.show(Example, { message }).then();
    });

    const domMessage = document.querySelector("span");

    expect(domMessage?.innerHTML).toBe(`Show View ${message}`);
  });

  it("should render by show sync method", () => {
    const manager = createViewManager();
    act(() => {
      ReactDOM.createRoot(container!).render(<manager.Component />);
    });
    const message = "Hello";

    act(() => {
      const view = manager.showSync(Example, { message });
      view.start();
    });

    const domMessage = document.querySelector("span");

    expect(domMessage?.innerHTML).toBe(`Show View ${message}`);
  });
});
