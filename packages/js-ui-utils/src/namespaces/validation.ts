export namespace Validation {
  export function isPromiseLike(x: any): x is PromiseLike<any> {
    return x && typeof (x as PromiseLike<any>).then === "function";
  }
}
