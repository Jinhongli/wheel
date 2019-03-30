import createStore from '../store';
import { ADD_TODO, TOGGLE_TODO, addTodo, toggleTodo } from './actions';
import { default as todos, initialState as todoInitialState } from './todos';

test('Store should have correct initial state', () => {
  const store = createStore(todos);
  const defaultState = store.getState();
  expect(defaultState).toEqual(todoInitialState);
});

test('Store dispatch work correctly', () => {
  const store = createStore(todos);
  store.dispatch(addTodo('foo'));
  store.dispatch(addTodo('bar'));
  const state = store.getState();
  expect(state).toHaveLength(2);
  expect(state[0]).toEqual({
    text: 'foo',
    complete: false,
  });
  expect(state[1]).toEqual({
    text: 'bar',
    complete: false,
  });
  store.dispatch(toggleTodo(1));
  expect(store.getState()[1].complete).toBe(true);
});

test('Store subscribe/unsubscribe work correctly', () => {
  const store = createStore(todos);
  const mockFn = jest.fn();
  const unsub = store.subscribe(mockFn);
  store.dispatch(addTodo('foo'));
  store.dispatch(toggleTodo(0));
  expect(mockFn.mock.calls).toHaveLength(2);
  unsub();
  store.dispatch(toggleTodo(0));
  expect(mockFn.mock.calls).toHaveLength(2);
});
