import * as React from "react";
import type { ViewComponentProps } from "@pkg/types";

export function ViewMainComponent(props: ViewComponentProps) {
  const x = props.views;
  if (x.length === 0) return null;
  return (
    <React.Fragment>
      {x.map((view) => {
        const C = view.render;
        return <C key={view.id} {...view.props} />;
      })}
    </React.Fragment>
  );
}
