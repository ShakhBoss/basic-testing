import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

// Mock axios and lodash.throttle
jest.mock('axios');
jest.mock('lodash', () => {
  const actual = jest.requireActual('lodash');
  return {
    ...actual,
    throttle: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const createSpy = jest.spyOn(axios, 'create');

    const mockInstance = {
      get: jest.fn().mockResolvedValue({ data: 'mocked data' }),
    } as unknown as AxiosInstance;

    mockedAxios.create.mockReturnValue(mockInstance);

    await throttledGetDataFromApi('/posts');

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: 'response' });

    const mockInstance = {
      get: getMock,
    } as unknown as AxiosInstance;

    mockedAxios.create.mockReturnValue(mockInstance);

    await throttledGetDataFromApi('/todos/1');

    expect(getMock).toHaveBeenCalledWith('/todos/1');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test title' };

    const getMock = jest.fn().mockResolvedValue({ data: mockData });

    const mockInstance = {
      get: getMock,
    } as unknown as AxiosInstance;

    mockedAxios.create.mockReturnValue(mockInstance);

    const result = await throttledGetDataFromApi('/users/1');

    expect(result).toEqual(mockData);
  });
});
