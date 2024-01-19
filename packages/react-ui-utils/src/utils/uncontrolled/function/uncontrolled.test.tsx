import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createUncontrolledFC, FunctionalManagerMethods } from ".";

interface IUncontrolledMethods {
  getCounter: () => number;
  setCounter: (counter: number) => void;
}

const Example = ({ set }: FunctionalManagerMethods<IUncontrolledMethods>) => {
  const [counter, setCounter] = useState(0);

  set("getCounter", () => counter);
  set("setCounter", (newCounter) => setCounter(newCounter));

  return <div>Render</div>;
};

describe("render functionComponentManager", () => {
  const manager = createUncontrolledFC(Example, {
    setCounter: (instance, newCounter) => {
      return instance.setCounter(newCounter);
    },
    getCounter: (instance) => {
      return instance.getCounter();
    },
  });

  it("should render by default", () => {
    render(<manager.Component />);

    expect(screen.getByText(/Render/)).toBeInTheDocument();
  });

  it("should method getCounter return a number", () => {
    render(<manager.Component />);

    const getCounter = manager.getCounter();

    setTimeout(() => {
      expect(getCounter).toBe(0);
    }, 500);
  });
});
