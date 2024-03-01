"use client";
import ControlledFunctionComp from "@app/uncontrolled/functional/controlled";
import { HOC } from "@app/manager";

export default function UncontrolledPage() {
  return (
    <article>
      <section>
        <h1>Controlled Section</h1>
        <ControlledFunctionComp />
      </section>
      <section>
        <h1>Uncontrolled Section</h1>
        <HOC.UncontrolledFC.Component />
      </section>
    </article>
  );
}
