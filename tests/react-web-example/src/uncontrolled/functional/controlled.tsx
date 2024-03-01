import { HOC } from "@app/manager";
import React from "react";

export default function ControlledFunctionComp() {
  const increment = () => {
    HOC.UncontrolledFC.increment();
  };
  const decrement = () => {
    HOC.UncontrolledFC.decrement();
  };
  const toogle = (state: boolean) => {
    HOC.UncontrolledFC.toogle(state);
  };
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => toogle(true)}>Show Component</button>
      <button onClick={() => toogle(false)}>Hide Component</button>
    </div>
  );
}
