import HttpStatusCodes from 'http-status-codes';
import {
  describe,
  expect,
  afterEach, it, jest,
} from '@jest/globals';
import applyFiltersHandler from '../handlers/filters/applyFiltersHandler.mjs';

describe('applyFiltersHandler', () => {
  const mockReq = {
    body: { /* mock request body */ },
    files: { /* mock uploaded files */ },
    container: {
      processService: {
        applyFilters: jest.fn().mockResolvedValue({ /* mock response */ }),
      },
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call processService.applyFilters with the correct arguments', async () => {
    await applyFiltersHandler(mockReq, mockRes, mockNext);
    expect(mockReq.container.processService.applyFilters).toHaveBeenCalledWith({
      ...mockReq.body,
      files: mockReq.files,
    });
  });

  it('should return a JSON response with status code 200', async () => {
    await applyFiltersHandler(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(mockRes.json).toHaveBeenCalledWith({ /* mock response */ });
  });

  it('should call next with an error if processService.applyFilters throws an error', async () => {
    const mockError = new Error('mock error');
    mockReq.container.processService.applyFilters.mockRejectedValueOnce(mockError);
    await applyFiltersHandler(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
