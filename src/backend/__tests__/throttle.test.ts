import throttle from '../controllers/throttle';

describe('throttle unit tests', () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockCallback.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return a function', () => {
    const result = throttle(() => {}, 1000);
    expect(typeof result).toBe('function');
  });

  test('throttled function should be called with the correct arguments', () => {
    const throttledFunc = throttle(mockCallback, 1000);

    throttledFunc(1, 2, 3);

    expect(mockCallback).toHaveBeenCalledWith(1, 2, 3);
  });

  it('should invoke the callback immediately on the first call', () => {
    const throttledFunc = throttle(mockCallback, 1000);

    throttledFunc();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should invoke the callback only once if called multiple times within the throttling interval', () => {
    const throttledFunc = throttle(mockCallback, 1000);

    throttledFunc();
    throttledFunc();
    throttledFunc();
    jest.advanceTimersByTime(500);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should invoke the callback multiple times if called outside of the throttling interval', () => {
    const throttledFunc = throttle(mockCallback, 1000);

    throttledFunc();
    jest.advanceTimersByTime(500);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    throttledFunc();
    jest.advanceTimersByTime(500);
    expect(mockCallback).toHaveBeenCalledTimes(2);

    throttledFunc();
    jest.advanceTimersByTime(1500);
    expect(mockCallback).toHaveBeenCalledTimes(3);
  });
});
