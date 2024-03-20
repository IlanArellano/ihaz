"use client";
import { HOC } from "@app/manager";
import ExampleManagerModal from "@app/modals/manager/example";
import { useState } from "react";

const ShowComponent = HOC.View.withViewContext(
  ({ hideComponent }: { hideComponent: () => void }) => {
    const onShow = async () => {
      const example = await HOC.View.show(
        ExampleManagerModal,
        {
          hideComponent,
        },
        "example"
      );
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
