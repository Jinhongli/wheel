import MyPromise from './promise';
import { delay, randomInt } from '../utils/util';
import { log, error } from '../utils/log';

const createRandomDelayPromise = () =>
  new MyPromise(resolve => {
    const int = randomInt(1, 5);
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

MyPromise.all([
  createRandomDelayPromise(),
  createRandomDelayPromise(),
  createRandomDelayPromise(),
  createFailPromise(),
])
  .then(log, error)
  .finally(() => {
    log('finally finish');
  });
