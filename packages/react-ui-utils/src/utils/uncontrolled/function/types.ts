export type FunctionalMethods<IMethods> = {
  [key in keyof IMethods]: (storeMethods: IMethods, ...agrs: any[]) => any;
};
