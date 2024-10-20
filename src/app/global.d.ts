declare global {
  interface Request {
    user?: Payload,
    file?: any,
  };
}

export { };