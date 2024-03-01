"use client";

import Link from "next/link";
import Main from "@app/shared/layout/main";

export default function Home() {
  return (
    <Main>
      <article>
        <h1>pages</h1>
        <section>
          <Link href="/manager">View Manager</Link>
          <Link href="/uncontrolled">Uncontrolled Components</Link>
        </section>
      </article>
    </Main>
  );
}
