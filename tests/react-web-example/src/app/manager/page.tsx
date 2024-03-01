"use client";
import { HOC } from "@app/manager";
import ExampleManagerModal from "@app/modals/manager/example";

export default function Manager() {
  const onShow = async () => {
    const example = await HOC.View.show(ExampleManagerModal);
    console.log({ example });
  };

  return (
    <>
      <button onClick={onShow}>show</button>
      <HOC.View.Component />
    </>
  );
}
