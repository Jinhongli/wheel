import { identity, throwError, defer, compose } from '../utils/util';
import { isFn } from '../utils/type';

const STATUS = {
  PENDING: 'pending',
  RESOLVED: 'fullfilled',
  REJECTED: 'rejected',
};

const handlePromise = Symbol['handlePromise'];

class MyPromise {
  status = STATUS.PENDING;

  handled = false;

  value = undefined;

  reason = undefined;

  onFulfilled = null;

  onRejected = null;

  constructor(resolver) {
    if (!isFn(resolver)) throwError('resolver is not a function');
    const resolve = val => {
      if (!this.handled) {
        this.handled = true;
        this.status = STATUS.RESOLVED;
        this.value = val;
        if (this.onFulfilled) this.onFulfilled(val);
      }
    };
    const reject = reason => {
      if (!this.handled) {
        this.handled = true;
        this.status = STATUS.REJECTED;
        this.reason = reason;
        if (this.onRejected) this.onRejected(reason);
      }
    };
    try {
      resolver(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  [handlePromise](resolve, reject, handler, value) {
    defer(() => {
      if (value && value.then) {
        // 值是一个 Promise 对象
        value.then(
          compose(
            resolve,
            this.onFulfilled
          ),
          compose(
            resolve,
            this.onRejected
          )
        );
      } else {
        try {
          resolve(handler(value));
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  then(onFulfilled = identity, onRejected = throwError) {
    return new MyPromise((resolve, reject) => {
      switch (this.status) {
        case STATUS.RESOLVED:
          this[handlePromise](resolve, reject, onFulfilled, this.value);
          break;
        case STATUS.REJECTED:
          this[handlePromise](resolve, reject, onRejected, this.reason);
        default:
          // Async
          this.onFulfilled = this[handlePromise].bind(
            this,
            resolve,
            reject,
            onFulfilled
          );
          this.onRejected = this[handlePromise].bind(
            this,
            resolve,
            reject,
            onRejected
          );
          break;
      }
    });
  }
}

export default MyPromise;
