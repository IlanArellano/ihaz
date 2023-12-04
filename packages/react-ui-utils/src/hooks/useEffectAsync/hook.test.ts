import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import useEffectAsync from "./hook";

global.fetch = jest.fn();

describe("execute useEffectAsync hook", () => {
  beforeEach(() => {
    /* @ts-ignore */
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });
  });

  it("should fetch ui data", async () => {
    let result: any;
    renderHook(() =>
      useEffectAsync(async () => {
        result = await (
          await fetch("https://jsonplaceholder.typicode.com/todos/1")
        ).json();
      }, [])
    );

    await waitFor(() => expect(result).not.toEqual(undefined));
  });
});
