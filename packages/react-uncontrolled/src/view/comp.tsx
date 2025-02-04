import * as React from "react";
import type { ViewComponentProps } from "@pkg/types";

export function ViewMainComponent({ views }: ViewComponentProps) {
  const x = views;
  if (x.length === 0) return null;
  return (
    <React.Fragment>
      {x.map((view) => {
        const C = view.children;
        return typeof C === "function" ? (
          <C key={view.id} {...view.props} />
        ) : (
          C
        );
      })}
    </React.Fragment>
  );
}
