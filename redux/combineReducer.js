const combineReducer = reducers => (state = {}, action) => {
  let nextState = {};
  for (const key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      const reducer = reducers[key];
      if (typeof reducer !== 'function') {
        throw new Error(`Reducer ${key} is not a function`);
      }
      const subState = state[key];
      const nextSubState = reducer(subState, action);
      if (typeof nextSubState === 'undefined') {
        console.warn(`Reducer ${key} returned undefined, it may cause error`);
      }
      nextState[key] = nextSubState;
    }
  }
  return nextState;
};

export default combineReducer;
