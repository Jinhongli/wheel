# Promise 的工作原理

1. `then()` 返回的是一个新的 Promise 实例；
2. `catch(onRejected)` 相当于 `then(null, onRejected)`；
3. `finally(onFinally)` 不论上一级 promise 状态都会执行，但其不接受值也不传递值，只是将上一级的值透传给下一级

![Promise 流程图](../assets/Promise.png)
