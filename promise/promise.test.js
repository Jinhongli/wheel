import MyPromise from './promise';
import { delay } from '../utils/util';

const promiseStatus = ['pending', 'fullfilled', 'rejected'];

describe('Promise status', () => {
  test('default status should be "pending"', () => {
    const p = new MyPromise(() => {});
    expect(p.status).toBe(promiseStatus[0]);
  });

  test('status should be "fullfilled" after call resolve', () => {
    const p = new MyPromise(resolve => {
      resolve();
    });
    expect(p.status).toBe(promiseStatus[1]);
  });

  test('status should be "fullfilled" after async call resolve', done => {
    const p = new MyPromise(resolve => {
      delay(() => {
        resolve();
        expect(p.status).toBe(promiseStatus[1]);
        done();
      }, 1000);
    });
  });

  test('status should be "rejected" after call reject', () => {
    const p = new MyPromise((resolve, reject) => {
      reject();
    });
    expect(p.status).toBe(promiseStatus[2]);
  });

  test('status should be "rejected" after async call reject', done => {
    const p = new MyPromise((resolve, reject) => {
      delay(() => {
        reject();
        expect(p.status).toBe(promiseStatus[2]);
        done();
      }, 1000);
    });
  });
});

describe('Promise.prototype.then', () => {
  test('then should return a new Promise', () => {
    const p = new MyPromise((resolve, reject) => {
      resolve(1);
    }).then();
    expect(p).toBeInstanceOf(MyPromise);
  });

  test('resolve value should transfer to onFullfilled', done => {
    const value = 1;
    new MyPromise(resolve => {
      resolve(value);
    }).then(v => {
      expect(v).toBe(value);
      done();
    });
  });

  test('reject reason should transfer to onRejected', done => {
    const reason = 'err';
    new MyPromise((resolve, reject) => {
      reject(reason);
    }).then(
      () => {},
      e => {
        expect(e).toBe(reason);
        done();
      }
    );
  });

  test('onFullfilled return value should transfer to next onFullfilled', done => {
    const value = 1;
    new MyPromise(resolve => {
      resolve(value);
    })
      .then(v => v + v)
      .then(v => {
        expect(v).toBe(value + value);
        done();
      });
  });

  test('onRejected return reason should transfer to next onFullfilled', done => {
    const value = 'err';
    new MyPromise((resolve, reject) => {
      reject(value);
    })
      .then(null, e => e)
      .then(v => {
        expect(v).toBe(value);
        done();
      });
  });

  test('return new Promise resolve should call next onFullfilled', done => {
    const value = 1;
    new MyPromise((resolve, reject) => {
      resolve(value);
    })
      .then(v => {
        return new MyPromise((resolve, reject) => {
          resolve(v + v);
        });
      })
      .then(v => {
        expect(v).toBe(value + value);
        done();
      });
  });

  test('return new Promise reject should call next onRejected', done => {
    const value = 'err';
    new MyPromise((resolve, reject) => {
      resolve(value);
    })
      .then(v => {
        return new MyPromise((resolve, reject) => {
          reject(v + v);
        });
      })
      .then(null, e => {
        expect(e).toBe(value + value);
        done();
      });
  });
});
