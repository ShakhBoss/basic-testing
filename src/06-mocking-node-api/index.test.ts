import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);
    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(2000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);
    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const fakePath = 'myfile.txt';
    const fakeFullPath = '/fake/path/myfile.txt';

    (path.join as jest.Mock).mockReturnValue(fakeFullPath);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(fakePath);

    expect(path.join).toHaveBeenCalledWith(__dirname, fakePath);
  });

  test('should return null if file does not exist', async () => {
    (path.join as jest.Mock).mockReturnValue('/fake/path.txt');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously('nofile.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockContent = Buffer.from('Hello World');

    (path.join as jest.Mock).mockReturnValue('/fake/path.txt');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(mockContent);

    const result = await readFileAsynchronously('somefile.txt');
    expect(result).toBe('Hello World');
  });
});
