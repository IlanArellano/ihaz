import withStatus from "@ihaz/react-ui-utils/hoc/status";
import createViewManager from "@ihaz/react-ui-utils/hoc/view";
import createFormManager from "@ihaz/react-ui-utils/hoc/form";
import StatusTest from "./Comp";
import { createUncontrolledFC } from "@ihaz/react-ui-utils";
import UncontrolledFunction from "@app/uncontrolled/functional/uncontrolled";

const INITIAL_FORM = {
  name: "",
  age: 2,
  birthDate: new Date(),
};

export namespace HOC {
  export const View = createViewManager();

  export const Status = withStatus(StatusTest);

  export const Form = createFormManager(INITIAL_FORM);

  export const UncontrolledFC = createUncontrolledFC(UncontrolledFunction, {
    get: (get) => {
      const getCounter = get("get");
      return getCounter();
    },
    increment: (get) => {
      const incrementValue = get("increment");
      return incrementValue();
    },
    decrement: (get) => {
      const dercrementValue = get("decrement");
      return dercrementValue();
    },
    toogle: (get, state) => {
      const toogleState = get("toogle");
      return toogleState(state);
    },
  });
}
