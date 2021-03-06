import { identity, throwError, defer, compose } from '../utils/util';
import { isFn } from '../utils/type';

const STATUS = {
  PENDING: 'pending',
  RESOLVED: 'fullfilled',
  REJECTED: 'rejected',
};

const handleCallback = Symbol['handleCallback'];

class MyPromise {
  static resolve = value => {
    return new MyPromise(resolve => {
      resolve(value);
    });
  };

  static reject = reason => {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  };

  static all = promises => {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      let values = [];
      const setValues = (index, value) => {
        values[index] = value;
        count++;
        if (count >= promises.length) {
          resolve(values);
        }
      };
      promises.forEach((p, i) => {
        p.then(val => {
          setValues(i, val);
        }, reject);
      });
    });
  };

  static race = promises => {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => {
        p.then(resolve, reject);
      });
    });
  };

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
        if (val && val.then) {
          val.then(
            v => {
              if (this.onFulfilled) this.onFulfilled(v);
            },
            e => {
              if (this.onRejected) this.onRejected(e);
            }
          );
        } else {
          if (this.onFulfilled) this.onFulfilled(val);
        }
      }
    };
    const reject = reason => {
      if (!this.handled) {
        this.handled = true;
        this.status = STATUS.REJECTED;
        this.reason = reason;
        if (reason && reason.then) {
          reason.then(
            v => {
              if (this.onFulfilled) this.onFulfilled(v);
            },
            e => {
              if (this.onRejected) this.onRejected(e);
            }
          );
        } else {
          if (this.onRejected) this.onRejected(reason);
        }
      }
    };
    try {
      resolver(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  [handleCallback](resolve, reject, handler, value) {
    defer(() => {
      try {
        const x = handler(value);
        resolve(x);
      } catch (err) {
        reject(err);
      }
    });
  }

  then(onFulfilled = identity, onRejected = throwError) {
    return new MyPromise((resolve, reject) => {
      switch (this.status) {
        case STATUS.RESOLVED:
          this[handleCallback](resolve, reject, onFulfilled, this.value);
          break;
        case STATUS.REJECTED:
          this[handleCallback](resolve, reject, onRejected, this.reason);
        default:
          // Async
          this.onFulfilled = this[handleCallback].bind(
            this,
            resolve,
            reject,
            onFulfilled
          );
          this.onRejected = this[handleCallback].bind(
            this,
            resolve,
            reject,
            onRejected
          );
          break;
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      val => {
        try {
          onFinally();
        } catch (error) {
          throwError(error);
        }
        return val;
      },
      err => {
        let onFinallyHasErr = false;
        try {
          onFinally();
        } catch (error) {
          onFinallyHasErr = true;
          throwError(error);
        }
        if (!onFinallyHasErr) throwError(err);
      }
    );
  }
}

export default MyPromise;
