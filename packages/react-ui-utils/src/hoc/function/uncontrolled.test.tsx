import React, { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import createUncontrolledFC from "./comp";
import "@testing-library/jest-dom";
import type { FunctionalManagerMethods } from "@utils/types";

type IUncontrolledMethods = {
  getCounter: () => number;
  setCounter: (counter: number) => void;
};

const Example = ({ set }: FunctionalManagerMethods<IUncontrolledMethods>) => {
  const [counter, setCounter] = useState(1);

  set("getCounter", () => counter);
  set("setCounter", (newCounter) => setCounter(newCounter));

  return <div>Render</div>;
};

describe("render functionComponentManager", () => {
  const manager = createUncontrolledFC(Example);

  it("should render by default", () => {
    render(<manager.Component />);

    expect(screen.getByText(/Render/)).toBeInTheDocument();
  });

  it("should method getCounter return a number", () => {
    render(<manager.Component />);

    const getCounter = manager.methods.getCounter();

    setTimeout(() => {
      expect(getCounter).toBe(1);
    }, 500);
  });

  it("should increment the counter state and return the current value", () => {
    render(<manager.Component />);

    act(() => manager.methods.setCounter(10));

    const currentValue = manager.methods.getCounter();

    setTimeout(() => {
      expect(currentValue).toBe(10);
    }, 500);
  });
});
