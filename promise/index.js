import MyPromise from './promise';
import { delay, throwError } from '../utils/util';
import { log, error } from '../utils/log';

log('Program Start');

new MyPromise((resolve, reject) => {
  delay(() => {
    resolve('foo');
  }, 1000);
})
  .then(v => {
    log('1s later', v);
    return new MyPromise((resolve, reject) => {
      reject('bar');
    });
  })
  .finally(() => {
    log('finish');
  })
  .then(log, error);
