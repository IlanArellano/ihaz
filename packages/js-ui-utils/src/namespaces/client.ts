namespace Client {
  export const isClientSide = () =>
    typeof window !== "undefined" && !!window.document;
}

export default Client;
