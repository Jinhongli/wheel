export const identity = val => val;

export const throwError = msg => {
  throw new Error(msg);
};

export const defer = fn => setTimeout(fn, 0);

export const delay = (fn, ms = 1) => setTimeout(fn, ms);
