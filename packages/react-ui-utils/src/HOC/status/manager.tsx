import * as React from "react";
import type {
  ReactKey,
  StatusEventsMapping,
  StatusManagerProps,
} from "./types";

let StatusManagerRenderCount: number = 0;

function increment(maxValue?: number) {
  if (maxValue !== undefined && StatusManagerRenderCount > maxValue) {
    StatusManagerRenderCount = 0;
    return;
  }
  StatusManagerRenderCount++;
}

function decrement() {
  if (++StatusManagerRenderCount <= 0) StatusManagerRenderCount = 0;
}

export default class StatusManagerClass extends React.PureComponent<
  React.PropsWithChildren<StatusManagerProps>
> {
  constructor(props: React.PropsWithChildren<StatusManagerProps>) {
    super(props);
    if (!this.hasInternalKey()) increment();
    const events = this.props.getEvents();
    events.listen("onInit", this.getKey());
  }

  //Internal Methods
  private hasInternalKey() {
    return (
      this.props.internalKey !== undefined && this.props.internalKey !== null
    );
  }

  private getKey() {
    return this.hasInternalKey()
      ? this.props.internalKey
      : (StatusManagerRenderCount as ReactKey);
  }

  public addEventListener<
    IKeyEvents extends Extract<keyof StatusEventsMapping, string>
  >(id: IKeyEvents, callback: StatusEventsMapping[IKeyEvents]) {
    const events = this.props.getEvents();
    events.suscribe(id, callback);
  }

  //React LifeCycle Events
  componentWillUnmount(): void {
    const events = this.props.getEvents();
    events.listen("onUnmount", this.getKey());
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const events = this.props.getEvents();
    events.listen("onCatch", error, errorInfo, this.getKey());
  }

  componentDidUpdate(
    prevProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    const events = this.props.getEvents();
    events.listen("onUpdate", prevProps, prevState, snapshot, this.getKey());
  }

  getSnapshotBeforeUpdate(
    prevProps: Readonly<React.PropsWithChildren<StatusManagerProps>>,
    prevState: Readonly<{}>
  ) {
    const events = this.props.getEvents();
    events.listen(
      "onSnapshotBeforeUpdate",
      prevProps,
      prevState,
      this.getKey()
    );
  }

  componentDidMount(): void {
    if (!this.hasInternalKey()) decrement();
    const events = this.props.getEvents();
    events.listen("onMount", this.getKey());
  }

  render() {
    return <>{this.props.children}</>;
  }
}
