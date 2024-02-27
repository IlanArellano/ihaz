import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import EventHandler from "@jsUtils/classes/EventHandler";
import StatusManagerClass from "./manager";
import type {
  StatusEventsMapping,
  StatusManagerProps,
  WithStatusResult,
} from "./types";
import createUncontrolledClassComponent from "../class/comp";

function createStatusEvent() {
  return new EventHandler<StatusEventsMapping>();
}

export default function withStatus<IProps = any>(
  Comp: React.ComponentType<IProps>
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
      /* @ts-ignore */
      <manager.Component internalKey={props.internalKey} getEvents={getEvents}>
        <Comp {...props} />
      </manager.Component>
    ),
    addEventListener: manager.addEventListener,
  };
}
