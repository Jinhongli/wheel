import combineReducer from '../combineReducer';
import createStore from '../store';
import { default as todos } from './todos';
import { default as visibilityFilter } from './visibilityFilter';
import {
  addTodo,
  setVisibilityFilter,
  VISIBILITY_FILTER,
  toggleTodo,
} from './actions';

const logger = ({ getState }) => next => action => {
  const { type, ...payload } = action;
  const prevState = getState();
  const wrapped = next(action);
  const nextState = getState();
  console.log(`
======================================
ACTION: ${type}
@ ${new Date().toLocaleTimeString()}
-- PREV STATE ------------------------
  ${JSON.stringify(prevState)}
-- PAYLOAD ---------------------------
  ${JSON.stringify(payload)}
-- NEXT STATE ------------------------
  ${JSON.stringify(nextState)}
======================================
  `);
  return wrapped;
};

const timer = () => next => action => {
  console.time('reducerTimeCost');
  const wrapped = next(action);
  console.timeEnd('reducerTimeCost');
  return wrapped;
};

test('applyMiddleware should enhance store correctly', () => {
  const reducer = combineReducer({
    todos,
    visibilityFilter,
  });
  const store = createStore(reducer, undefined, [logger, timer]);
  store.dispatch(addTodo('foo'));
  store.dispatch(toggleTodo(0));
  store.dispatch(setVisibilityFilter(VISIBILITY_FILTER.COMPLETED));
});

test('middlewares should call in sequence', () => {
  let seqs = [];
  const reducer = combineReducer({
    todos,
    visibilityFilter,
  });
  const middleware1 = () => next => action => {
    seqs.push('start1');
    const wrapped = next(action);
    seqs.push('end1');
    return wrapped;
  };
  const middleware2 = () => next => action => {
    seqs.push('start2');
    const wrapped = next(action);
    seqs.push('end2');
    return wrapped;
  };
  const store = createStore(reducer, undefined, [middleware1, middleware2]);
  store.dispatch(addTodo('foo'));
  expect(seqs).toEqual(['start1', 'start2', 'end2', 'end1']);
});
