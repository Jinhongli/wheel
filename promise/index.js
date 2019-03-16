import MyPromise from './promise';
import { delay, randomInt } from '../utils/util';
import { log, error } from '../utils/log';

const createRandomDelayPromise = () =>
  new MyPromise(resolve => {
    const int = randomInt(1, 5);
    log(`create a ${int * 1000}ms Promise`);
    delay(() => {
      resolve(int);
    }, int * 1000);
  });

const createFailPromise = () =>
  new MyPromise((resolve, reject) => {
    delay(() => {
      reject('fail');
    }, 500);
  });

log('Program Start');

MyPromise.race([
  createRandomDelayPromise(),
  createRandomDelayPromise(),
  createRandomDelayPromise(),
])
  .then(log, error)
  .finally(() => {
    log('finally finish');
  });
