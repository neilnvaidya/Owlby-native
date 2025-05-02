export const createChainableMock = () => {
  const mock = jest.fn();
  mock.mockReturnThis();
  return mock;
}; 