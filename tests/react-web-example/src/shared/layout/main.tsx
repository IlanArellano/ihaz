import React, { PropsWithChildren } from "react";

export default function Main({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {children}
    </main>
  );
}
