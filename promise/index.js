import MyPromise from './promise';
import { delay } from '../utils/util';

const p = new MyPromise((resolve, reject) => {
  // delay(resolve.bind(null, 'foo'), 1000);
  // delay(reject.bind(null, 'bar'), 1000);
  reject(1);
});

p.then(
  value => {
    console.log(value)
    return value;
  },
  err => {
    console.log('reason: ' + err);
    return 'hahaha'
  }
)
  .then(
    val => {
      console.log(val);
    },
    err => {
      console.log('error');
    }
  )
  .then(() => {
    console.log('finish');
  });
