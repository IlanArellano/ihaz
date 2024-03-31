import * as React from "react";
import type { ViewComponentProps } from "@utils/types";

export function ViewMainComponent(props: ViewComponentProps) {
  const x = props.views;
  if (x.length === 0) return null;
  return (
    <>
      {x.map((view) => {
        const C = view.render;
        return <C key={view.id} {...view.props} />;
      })}
    </>
  );
}
