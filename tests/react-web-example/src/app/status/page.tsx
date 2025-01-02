"use client";

import { HOC } from "@app/manager";
import { useEffect, useState } from "react";

export default function StatusPage() {
  const [mount, setMount] = useState(true);

  useEffect(() => {
    HOC.Status.addEventListener("onMount", (index) => {
      console.log("mount", index);
    });
    HOC.Status.addEventListener("onUnmount", () => {
      console.log("unmount");
    });
    HOC.Status.addEventListener("onInit", () => {
      console.log("init");
    });
  }, []);

  const onToggle = () => {
    setMount((prev) => !prev);
  };

  return (
    <>
      <div>
        <h1>Component Status</h1>
        <button onClick={onToggle}>toggle</button>
      </div>
      {mount && (
        <>
          <HOC.Status.Component />
          <HOC.Status.Component />
          <HOC.Status.Component />
        </>
      )}
    </>
  );
}
