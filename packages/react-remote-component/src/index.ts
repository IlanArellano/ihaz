import createRemoteComponent from "./remote/comp";
import createViewManager from "./view/create";
import { remoteMethods } from "./common/methods";
import { useRemoteProps } from "./remote/hooks/useRemoteProps";
import { default as ShowView } from "./view/components/ShowView";

export {
  //HOCs
  createRemoteComponent,
  //Manager
  createViewManager,
  //Hooks
  useRemoteProps,
  //Components
  ShowView,
  //Utils
  remoteMethods,
};
