import { FunctionalMethods, RemoteInstance, RemoteInstanceIntrisic } from "@pkg/types";


export function remoteMethods<IMethods extends FunctionalMethods, P>(instance: RemoteInstance<IMethods, P>): IMethods | null {
    return (instance as RemoteInstanceIntrisic<IMethods, P>)?._internal_?._methods ?? null;
}