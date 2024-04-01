"use client";
import { HOC } from "@app/manager";
import ExampleManagerModal from "@app/modals/manager/example";
import { ViewContextProps } from "@ihaz/react-ui-utils";
import { useState } from "react";

interface ShowComponentProps extends ViewContextProps {
  hideComponent: () => void;
}

const ShowComponent = HOC.View.withViewContext(
  ({ hideComponent, show }: ShowComponentProps) => {
    const onShow = async () => {
      const example = await show(ExampleManagerModal, {
        hideComponent,
      });
      console.log({ example });
    };
    return <button onClick={onShow}>show</button>;
  },
  "example"
);

export default function Manager() {
  const [toggle, setToggle] = useState(true);

  const onToggle = () => {
    setToggle((prev) => !prev);
  };
  const hide = () => {
    setToggle((prev) => false);
  };

  return (
    <>
      {toggle && <ShowComponent hideComponent={hide} />}
      <button onClick={onToggle}>toggle</button>
      <HOC.View.Component />
    </>
  );
}
