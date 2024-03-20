import { HOC } from "@app/manager";

export default function ControlledFunctionComp() {
  const increment = () => {
    HOC.UncontrolledFC.methods.increment();
  };
  const decrement = () => {
    HOC.UncontrolledFC.methods.decrement();
  };
  const toogle = (state: boolean) => {
    HOC.UncontrolledFC.methods.toogle(state);
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
