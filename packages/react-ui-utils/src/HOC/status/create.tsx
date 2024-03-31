import * as React from "react";
import CommonObject from "@jsUtils/namespaces/object";
import EventHandler from "@jsUtils/classes/EventHandler";
import StatusManagerClass from "./manager";
import type {
  StatusEventsMapping,
  StatusManagerProps,
  WithStatusResult,
} from "@utils/types";

export default function withStatus<IProps = any>(
  Comp: React.ComponentType<IProps>
): WithStatusResult<IProps> {
  const getEvents = CommonObject.createGetterResource(() =>
    new EventHandler<StatusEventsMapping>().setOptions({
      callPreviousListener: true,
    })
  );

  const addEventListener: WithStatusResult<IProps>["addEventListener"] = (
    id,
    callback
  ) => {
    getEvents().suscribe(id, callback);
  };

  const removeEventListenner: WithStatusResult<IProps>["removeEventListenner"] =
    (id, callback) => {
      getEvents().clear(id, callback);
    };

  const removeListennersByEvent: WithStatusResult<IProps>["removeListennersByEvent"] =
    (id) => {
      const events = getEvents();
      events.clearByEvent(id);
    };

  return {
    Component: (props: IProps & Pick<StatusManagerProps, "internalKey">) => (
      /* @ts-ignore */
      <StatusManagerClass internalKey={props.internalKey} getEvents={getEvents}>
        <Comp {...props} />
      </StatusManagerClass>
    ),
    addEventListener,
    removeEventListenner,
    removeListennersByEvent,
  };
}
