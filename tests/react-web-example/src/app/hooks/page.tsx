import Main from "@app/shared/layout/main";
import Link from "next/link";
import React from "react";

export default function HooksPage() {
  return (
    <Main>
      <article>
        <h1>Hooks</h1>
        <section>
          <Link href="hooks/useeffect">Effect Async</Link>
        </section>
      </article>
    </Main>
  );
}
