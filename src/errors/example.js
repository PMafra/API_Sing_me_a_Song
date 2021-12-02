class ExampleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExampleError';
  }
}

export default ExampleError;
