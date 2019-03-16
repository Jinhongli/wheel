import MyPromise from './promise';
import { delay, throwError } from '../utils/util';
import { log, error } from '../utils/log';

log('Program Start');

new MyPromise((resolve, reject) => {
  delay(() => {
    log('1s later');
    resolve('foo');
  }, 1000);
})
  .then(
    v => {
      log(v);
      return v;
    },
    e => {
      error(e);
      throwError(e);
    }
  )
  .finally(() => {
    log('finish');
  })
  .then(log, error);
