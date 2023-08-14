export namespace Execute {
  export const executeReturnedValue = <T>(
    value: T | ((...args: any[]) => T),
    ...args: any[]
  ): T => (value instanceof Function ? value(...args) : value);
}
