import { ReactKey } from "@utils/types";
import { StatusManagerProps } from "./manager";

export type StatusEventsMapping = {
  onMount: (key: ReactKey) => void;
  onUnmount: (key: ReactKey) => void;
  onUpdate: (
    nextProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    nextState: Readonly<{}>,
    nextContext: any,
    key: ReactKey
  ) => void;
  onCatch: (error: Error, errorInfo: React.ErrorInfo, key: ReactKey) => void;
  onInit: (key: ReactKey) => void;
  onSnapshotBeforeUpdate: (
    prevProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    prevState: Readonly<{}>,
    key: ReactKey
  ) => void;
};
