import { FunctionalManagerMethods } from "@ihaz/react-ui-utils";
import React, { useState } from "react";
import { UncontrolledFunctionalMethods } from "./type";

export default function UncontrolledFunction({
  set,
}: FunctionalManagerMethods<UncontrolledFunctionalMethods>) {
  const [counter, setCounter] = useState(0);
  const [show, setShow] = useState(true);

  set("get", () => counter);
  set("increment", () => setCounter((prev) => prev + 1));
  set("decrement", () => setCounter((prev) => prev - 1));
  set("toogle", (state) => setShow(state));

  return (
    <div>
      <span>Counter: {counter}</span>
      {show && <div>Show Element</div>}
    </div>
  );
}

UncontrolledFunction.displayName = "UncontrolledFunction";
