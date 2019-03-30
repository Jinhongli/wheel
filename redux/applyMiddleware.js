const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const applyMiddleware = (store, middlewares) => {
  let dispatch = () => {
    console.warn('dispatch in you middleware contructor is not allowed.');
  };
  const middlewareAPIs = {
    getState: store.getState,
    dispatch,
  };

  const chain = middlewares.map(middleware => middleware(middlewareAPIs));

  // chain = [ dipatch => warpped dispatch, ... ]
  // next is store.dispatch, then return a warpped dispatch.
  dispatch = compose(...chain)(store.dispatch);

  return {
    ...store,
    dispatch,
  };
};

export default applyMiddleware;
