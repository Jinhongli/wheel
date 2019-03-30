import combineReducer from '../combineReducer';
import createStore from '../store';
import { default as todos, initialState as todoInitialState } from './todos';
import {
  default as visibilityFilter,
  initialState as visibilityFilterInitialState,
} from './visibilityFilter';
import { addTodo, setVisibilityFilter, VISIBILITY_FILTER } from './actions';

test('Combine reducer should get correct default state', () => {
  const reducer = combineReducer({
    todos,
    visibilityFilter,
  });
  const store = createStore(reducer);
  const defaultState = store.getState();
  expect(defaultState).toEqual({
    todos: todoInitialState,
    visibilityFilter: visibilityFilterInitialState,
  });
});

test('Combine reducer should work correctly', () => {
  const reducer = combineReducer({
    todos,
    visibilityFilter,
  });
  const store = createStore(reducer);
  store.dispatch(addTodo('foo'));
  store.dispatch(addTodo('bar'));
  store.dispatch(setVisibilityFilter(VISIBILITY_FILTER.COMPLETED));
  const state = store.getState();
  expect(state.todos).toHaveLength(2);
  expect(state.visibilityFilter).toBe(VISIBILITY_FILTER.COMPLETED);
  expect(state.todos[0]).toEqual({
    text: 'foo',
    complete: false,
  });
});
