import applyMiddleware from './applyMiddleware';

const INIT_ACTION = {
  type: '@@INIT_STORE@@',
};

const createStore = (reducer, preloadedState, middlewares) => {
  let state = preloadedState || reducer(undefined, INIT_ACTION);
  let listeners = [];
  const store = {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach(fn => fn());
    },
    subscribe(callback) {
      listeners.push(callback);
      return function unsubscribe() {
        listeners = listeners.filter(fn => fn !== callback);
      };
    },
  };
  if (middlewares && middlewares.length)
    return applyMiddleware(store, middlewares);
  return store;
};

export default createStore;
