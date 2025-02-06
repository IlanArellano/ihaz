class EventEmitter<T extends Record<string, any[]>> {
  private events: Map<keyof T, Array<(...args: T[keyof T]) => void>>;

  constructor() {
    this.events = new Map();
  }

  // Suscribirse a un evento
  on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
  }

  // Suscribirse solo una vez
  once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void {
    const wrapper = (...args: T[K]) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  // Emitir un evento
  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    this.events.get(event)?.forEach((listener) => listener(...args));
  }

  // Eliminar un listener específico
  off<K extends keyof T>(
    event: K,
    listenerToRemove: (...args: T[K]) => void
  ): void {
    if (this.events.has(event)) {
      this.events.set(
        event,
        this.events
          .get(event)!
          .filter((listener) => listener !== listenerToRemove)
      );
    }
  }

  hasListeners<K extends keyof T>(event: K): boolean {
    return !!this.events.get(event)?.length;
  }

  // Eliminar todos los listeners de un evento
  removeAllListeners<K extends keyof T>(event: K): void {
    if (this.events.has(event)) {
      this.events.delete(event);
    }
  }
}

export default EventEmitter;
