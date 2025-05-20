/**
 * Mock HTTP request and response objects for controller testing
 */

export const mockRequest = () => {
  const req: any = {};
  req.body = {};
  req.params = {};
  req.query = {};
  req.user = { id: 'test-user-id', email: 'test@example.com', role: 'admin' };
  return req;
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
