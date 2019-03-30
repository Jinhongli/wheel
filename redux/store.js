const INIT_ACTION = {
  type: '@@INIT_STORE@@',
};

const createStore = (reducer, initialState) => {
  let state = initialState || reducer(undefined, INIT_ACTION);
  let listeners = [];
  return {
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
};

export default createStore;
