import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import useValueHandler from "./hook";

describe("execute useValueHandler hook", () => {
  it("should set internal data and return current data syncronously", async () => {
    let iterations = 100;
    const [get, set] = renderHook(() => useValueHandler({ state: false }))
      .result.current;

    for (let index = 0; index < iterations; index++) {
      await waitFor(() => {
        let prevValue = get();
        set((prev) => ({ state: !prev.state }));
        const currValue = get();
        expect(currValue.state).not.toEqual(prevValue.state);
      });
    }
  });
});
