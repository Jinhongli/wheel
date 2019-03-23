import SyncHook from '../SyncHook';

describe('SyncHook.prototype.tap()', () => {
  let hook;
  beforeEach(() => {
    hook = new SyncHook();
  });
  afterEach(() => {
    hook = null;
  });
  test('with default plugin options', () => {
    const mockFn = jest.fn();
    hook.tap('foo', mockFn);
    hook.tap('bar', mockFn);
    expect(hook.plugins).toHaveLength(2);
    expect(hook.plugins[0].name).toBe('foo');
    expect(hook.plugins[1].name).toBe('bar');
  });

  test('with stage', () => {
    const mockFn = jest.fn();
    hook.tap('foo', mockFn);
    hook.tap(
      {
        name: 'bar',
        stage: 1,
      },
      mockFn
    );
    expect(hook.plugins).toHaveLength(2);
    expect(hook.plugins[0].name).toBe('bar');
    expect(hook.plugins[1].name).toBe('foo');
  });
});

describe('SyncHook.prototype.call()', () => {
  let hook;
  beforeEach(() => {
    hook = new SyncHook();
  });
  afterEach(() => {
    hook = null;
  });
  test('without parameter', () => {
    const mockFn = jest.fn();
    hook.tap('foo', mockFn);
    hook.tap('bar', mockFn);
    hook.call();
    expect(mockFn.mock.calls.length).toBe(2);
  });

  test('with parameter', () => {
    const mockFn = jest.fn();
    hook.tap('foo', mockFn);
    hook.tap('bar', mockFn);
    hook.call('baz');
    expect(mockFn.mock.calls.length).toBe(2);
    expect(mockFn.mock.calls[0][0]).toBe('baz');
    expect(mockFn.mock.calls[1][0]).toBe('baz');
  });

  test('with context', () => {
    const mockFn = jest.fn((baz, context) => {
      context.value = 'context value';
    });
    hook.tap('foo', mockFn);
    hook.tap('bar', mockFn);
    hook.call('baz');
    expect(mockFn.mock.calls.length).toBe(2);
    expect(mockFn.mock.calls[1][0]).toBe('baz');
    expect(mockFn.mock.calls[1][1].value).toBe('context value');
  });
});
