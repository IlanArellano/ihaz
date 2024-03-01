import { ViewProps } from "@ihaz/react-ui-utils/hoc/view";
import { Dialog } from "primereact/dialog";
import { PropsWithChildren } from "react";

interface ModalBaseProps extends PropsWithChildren<ViewProps<any>> {
  defaultResult?: any;
}

export default function ModalBase({
  onClose,
  children,
  defaultResult,
}: ModalBaseProps) {
  return (
    <Dialog
      header="Header"
      visible
      draggable={false}
      style={{ width: "50vw" }}
      onHide={() => onClose(defaultResult)}
    >
      {children}
    </Dialog>
  );
}
