import {
  createFormManager,
  createViewManager,
  withStatus,
  createUncontrolledFC,
} from "@ihaz/react-ui-utils";
import StatusTest from "./Comp";
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

  export const UncontrolledFC = createUncontrolledFC(UncontrolledFunction);
}
