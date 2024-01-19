export type FunctionalMethods<IMethods> = {
  [key in keyof IMethods]: (storeMethods: IMethods, ...agrs: any[]) => any;
};

export interface FunctionalManagerMethods<IMethods> {
  set: <IKey extends keyof IMethods>(key: IKey, value: IMethods[IKey]) => void;
}
