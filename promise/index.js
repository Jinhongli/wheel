import MyPromise from './promise';
import { delay, throwError } from '../utils/util';
import { log, error } from '../utils/log';

log('Program Start');

Promise.reject('foo')
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
