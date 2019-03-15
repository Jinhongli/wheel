import MyPromise from './promise';
import { delay } from '../utils/util';

describe('Promise status should change correctly', () => {
  const promiseStatus = ['pending', 'resolved', 'rejected'];

  test('default status should be "pending"', () => {
    const p = new MyPromise(() => {});
    expect(p.status).toBe(promiseStatus[0]);
  });

  test('status should be "resolved" after call resolve', () => {
    const p = new MyPromise(resolve => {
      resolve();
    });
    expect(p.status).toBe(promiseStatus[1]);
  });

  test('status should be "resolved" after async call resolve', () => {
    const p = new MyPromise(resolve => {
      delay(() => {
        resolve();
        expect(p.status).toBe(promiseStatus[1]);
      }, 1000);
    });
  });

  test('status should be "rejected" after call reject', () => {
    const p = new MyPromise((resolve, reject) => {
      reject();
    });
    expect(p.status).toBe(promiseStatus[2]);
  });
});
