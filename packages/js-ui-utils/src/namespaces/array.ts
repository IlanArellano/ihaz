namespace CommonArray {
  export const someCount = <T>(
    arr: T[],
    predicate: (el: T, index: number, array: T[]) => boolean,
    count: number = 1
  ): boolean => {
    if (!Array.isArray(arr))
      throw new Error("someCount method error: Array is required");
    if (count === 1) return arr.some(predicate);
    let foundEls = 0;
    for (let i = 0; i < arr.length; i++) {
      const found = predicate(arr[i], i, arr);
      if (found && foundEls++ >= count) return true;
    }
    return false;
  };
}

export default CommonArray;
