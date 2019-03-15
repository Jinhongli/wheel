export const getTypeof = obj =>
  Object.prototype.toString
    .call(obj)
    .toLowerCase()
    .slice(8, -1);

export const isTypeOf = (obj, type) => getTypeof(obj) === type;

export const isFn = fn => isTypeOf(fn, 'function');
