export type FunctionalMethodResult<IMethods> = (
  storeMethods: IMethods,
  ...agrs: any[]
) => any;

export type FunctionalMethods<IMethods> = {
  [key in keyof IMethods]: FunctionalMethodResult<IMethods>;
};

export interface FunctionalManagerMethods<IMethods> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
}
