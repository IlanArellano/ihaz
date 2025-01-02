namespace Stack {
  export const Sleep = (ms?: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
}

export default Stack;
