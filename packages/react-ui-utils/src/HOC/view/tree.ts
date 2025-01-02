import EventHandler from "@jsUtils/classes/EventHandler";
import type {
  ComponentRegister,
  EventHandlerRegisterMapping,
  Status,
} from "@utils/types";

export const VIEW_TREE_EVENT = "close";

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
        MountRef.listen(VIEW_TREE_EVENT);
        MountRef.clearByEvent(VIEW_TREE_EVENT);
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
