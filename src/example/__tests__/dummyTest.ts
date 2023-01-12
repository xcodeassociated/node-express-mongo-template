import { sillyFunction } from '../dummyFunctions';
import { DummyClass } from '../dummyClass';

// mock
import { DummyClassToMock } from '../dummyClassToMock';
jest.mock('../DummyClassToMock');

describe('silly function', () => {
  test('test class', () => {
    const some = new DummyClass();
    const result = some.method(1);

    expect(result).toBe(1);
  });
  test('test function', () => {
    const result = sillyFunction();

    expect(result).toBe(4);
  });
  test('mock class', () => {
    (DummyClassToMock.prototype.method as jest.Mock).mockReturnValue(6);

    const some = new DummyClassToMock();
    const result = some.method(1, 2);

    expect(result).toBe(6);
    expect(some.method).toBeCalledTimes(1);
  });
});

export {};
