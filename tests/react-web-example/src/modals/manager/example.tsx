import React from "react";
import ModalBase from "../base";
import { ViewProps } from "@ihaz/react-ui-utils/hoc/view";

interface ExampleManagerModalProps extends ViewProps<boolean> {
  hideComponent: () => void;
}

export default function ExampleManagerModal({
  onClose,
  hideComponent,
}: ExampleManagerModalProps) {
  return (
    <ModalBase onClose={onClose} defaultResult={false}>
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <button onClick={hideComponent}>Hide</button>
    </ModalBase>
  );
}
