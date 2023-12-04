export interface IntervalEffectMethods {
  /**Executes the interval if it has been stopped before */
  start: () => void;
  /**Stop the interval effect execution. When the method is called
   * the current effect´s cleanup could be execute before the effect`s cleanup
   */
  stop: (executeCallbackCleanup?: boolean) => void;
}
