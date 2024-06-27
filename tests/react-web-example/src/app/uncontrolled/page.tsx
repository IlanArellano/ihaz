"use client";
import ControlledFunctionComp from "@app/uncontrolled/functional/controlled";
import { HOC } from "@app/manager";
import { useState } from "react";

export default function UncontrolledPage() {
  const [mount, setMount] = useState(true);
  return (
    <article>
      <section>
        <h1>Controlled Section</h1>
        <ControlledFunctionComp setMount={setMount} />
      </section>
      <section>
        <h1>Uncontrolled Section</h1>
        {mount && <HOC.UncontrolledFC.Component />}
      </section>
    </article>
  );
}
