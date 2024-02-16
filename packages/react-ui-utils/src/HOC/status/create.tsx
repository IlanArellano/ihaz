import React, { type ComponentType } from "react";
import { CommonObject, EventHandler } from "@ihaz/js-ui-utils";
import { createUncontrolledClassComponent } from "@utils/utils";
import StatusManagerClass, { StatusManagerProps } from "./manager";
import type { StatusEventsMapping } from "./types";

interface WithStatusResult<IProps> {
  Component: ComponentType<IProps>;
  addEventListener: <
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(
    id: IKeyEvents,
    callback: StatusEventsMapping[IKeyEvents]
  ) => void;
}

function createStatusEvent() {
  return new EventHandler<StatusEventsMapping>();
}

export default function withStatus<IProps = any>(
  Comp: ComponentType<IProps>
): WithStatusResult<IProps> {
  const getEvents = CommonObject.createGetterResource(createStatusEvent);

  const manager = createUncontrolledClassComponent(StatusManagerClass, {
    addEventListener: <
      IKeyEvents extends Extract<keyof StatusEventsMapping, string>
    >(
      instance: () => StatusManagerClass,
      id: IKeyEvents,
      callback: StatusEventsMapping[IKeyEvents]
    ) => {
      instance().addEventListener(id, callback);
    },
  });

  return {
    Component: (props: IProps & Pick<StatusManagerProps, "internalKey">) => (
      <manager.Component internalKey={props.internalKey} getEvents={getEvents}>
        <Comp {...props} />
      </manager.Component>
    ),
    addEventListener: manager.addEventListener,
  };
}
