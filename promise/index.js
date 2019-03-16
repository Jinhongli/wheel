import MyPromise from './promise';
import { delay } from '../utils/util';
import { log, error } from '../utils/log';

log('Program Start');

new MyPromise((resolve, reject) => {
  delay(() => {
    log('1s later');
    reject(
      new MyPromise((resolve, reject) => {
        delay(() => {
          log('1s later');
          reject('foo');
        }, 1000);
      })
    );
  }, 1000);
})
  .catch(error)
  .then(() => {
    log('finish');
  });
