import EventHandler from "@jsUtils/classes/EventHandler";
import {
  VIEW_NATIVE_EVENTS,
  type ComponentRegister,
  type EventHandlerRegisterMapping,
  type Status,
} from "@pkg/types";

export class ViewTree {
  private componentMountEvents: Map<
    string,
    EventHandler<EventHandlerRegisterMapping>
  >;
  private components: Map<string, Status>;

  constructor() {
    this.componentMountEvents = new Map();
    this.components = new Map();
  }

  public registerComponent(entry: ComponentRegister) {
    this.addEntry(entry);
  }

  public changeStatus(key: string, status: Status) {
    this.modifyEntry({ key, status });
  }

  private modifyEntry(entry: ComponentRegister) {
    if (!this.components.has(entry.key)) return;
    this.components.set(entry.key, entry.status);
    if (entry.status === "unmounted") {
      const MountRef = this.getComponentHandler(entry.key);
      if (MountRef) {
        MountRef.listen(VIEW_NATIVE_EVENTS.CLOSE);
        MountRef.clearByEvent(VIEW_NATIVE_EVENTS.CLOSE);
      }
    }
  }

  private addEntry(entry: ComponentRegister) {
    this.components.set(entry.key, entry.status);
    if (this.componentMountEvents.has(entry.key)) return;
    this.componentMountEvents.set(
      entry.key,
      new EventHandler<EventHandlerRegisterMapping>()
    );
  }

  public getComponentDetails(key: string) {
    return this.components.get(key);
  }

  public getComponentHandler(key: string) {
    return this.componentMountEvents.get(key);
  }
}
