import React, { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import createRemoteComponent from "./comp";
import "@testing-library/jest-dom";
import type { FunctionalManagerMethods } from "@pkg/types";
import { remoteMethods } from "@pkg/common/methods";

type IRemoteMethods = {
  getCounter: () => number;
  setCounter: (counter: number) => void;
};

const Example = ({ set }: FunctionalManagerMethods<IRemoteMethods>) => {
  const [counter, setCounter] = useState(1);

  set("getCounter", () => counter);
  set("setCounter", (newCounter) => setCounter(newCounter));

  return <div>Render</div>;
};

describe("render functionComponentManager", () => {
  const manager = createRemoteComponent(Example);

  it("should render by default", () => {
    render(<manager.Component />);

    expect(screen.getByText(/Render/)).toBeInTheDocument();
  });

  it("should method getCounter return a number", () => {
    render(<manager.Component />);

    const methods = remoteMethods(manager);

    const getCounter = methods?.getCounter();

    setTimeout(() => {
      expect(getCounter).toBe(1);
    }, 500);
  });

  it("should increment the counter state and return the current value", () => {
    const methods = remoteMethods(manager);
    render(<manager.Component />);

    act(() => methods?.setCounter(10));

    const currentValue = methods?.getCounter();

    setTimeout(() => {
      expect(currentValue).toBe(10);
    }, 500);
  });
});
