# Redux

Redux 一共有 3 个角色：

- Store：全局唯一的状态管理机；
- Reducer: 用来帮助 Store 计算下一时刻的状态的纯函数；
- Action：描述状态如何更新的载荷；

## Action

Action 就是一个普通的对象，除了约定俗成的 `type` 字段外，并不会严格规定其到底长什么样子。

常见的 Action 轮廓为：

```js
{
  type: 'ADD_TODO',
  text: 'redux'
}

{
  type: 'ADD_TODO',
  payload: {
    text: 'redux'
  }
}
```

## Reducer

Reducer 的函数签名为 `(state, action) -> state`，其中的 `state` 是自定义的状态（通常是对象）。

通常内部由 `switch` 分支根据 `action.type` 计算出下一时刻的 `state`，默认返回当前的 `state` 用于设置初始化状态 `initialState`（具体是在创建 Store 时，根据传入的 `reducer` 然后发送一个奇怪类型的 Action，让 Reducer 返回传入的默认值）。

另外，如果应用逻辑比较复杂，我们通常会将其分割为更小的处理单元（reducer），然后使用 `combineReducer` 通过传入包含所有 reducer 的对象（键为 reducer 的 name，值为 reducer 函数）来合并成一个总得 reducer 用来状态 Store。

合并的 reducer 内部通过遍历所有的子 reducer 分别计算各个单元的状态，再修改 State 中对应的字段，所以 reducers 的 key 跟 State 中的 key 是一一对应的。

## Store

对 Store 来说，由 `createStore()` 并传入对应的 Reducer 以及默认状态来创建，其共有 3 个方法：

- state: 当前的状态；
- dispatch: 通过接收的 Action 使用 Reducer 计算下一时刻状态；
- subscribe: 用于挂载状态改变（dispatch）时的回调函数；

以上的功能实现起来都非常简单，利用闭包可以轻松实现。

但 `createStore()` 接受第三个可选的 `enhancer` 函数，用来增强 Store。官方实现了 `applyMiddleware` 的增强器，用来包装 Store 的 `dispatch` 函数。

然后通过传入 `middlewares` 的方式，将 `dispatch` 变为一个洋葱模型，方便使用者自由加入更多的功能。这里也是 Redux 最难理解的地方，我们来单独讲解一下。

## applyMiddleware

#### TL;DR

中间件创建函数: `(partialStoreAPIS) -> next -> action -> next(action)`;
中间件函数: `dispatch -> action -> dispatch(action)`;
中间件返回的、包装过的 dispatch 函数：`action -> dispatch(action)`
中间件管道函数：`dispatch -> warppedDispatch`

---

一个 `middleware` 的创建函数签名为 `(partialStoreAPIS) -> next -> action -> next(action)`，看起来非常怪异，我们一步一步的拆开分析：

1. 首先，通过 `map()` 执行所有的中间件创建函数，得到中间件列表（`next -> action -> next(action)`）。这其中会通过闭包将 Store 的 api（其实就只有 `getState` 获取当前状态一个方法）传入给中间件使用。
2. 然后通过 `compose` 函数将所有的中间件函数串联起来申城，即上一个中间件的返回值会作为下一个中间件的输入；
3. 然后将原 `store.dispatch` 作为中间件管道函数的输入调用。所以最初的 `next` 就是 `dispatch` 函数，而中间件的返回值会作为下一个中间件的输入（`next`）传递下去（这里取名为 `next` 不太合适，因为形参的作用针对的是当前函数，即当前中间件的输入，因此应该是 `prev` 才对，但个人觉得 `dispatch` 或者 `prevDispatch` 最为直观）
4. 最后到最后一个中间件执行完毕之后，得到一个将包裹了所有中间件函数的 `dispatch` 函数，重新赋值给 Store

那么洋葱模型呢？即 `middleware1 -> middleware2 -> dispatch -> middleware2 -> middleware1` 的流程是如何实现的呢？

先看一个最简单的 logger 中间件，实现如下：

```js
const logger = ({getState}) => next => action => {
  // 洋葱芯左侧 start
  console.log('prev state:', getState());
  console.log('action:', action);
  // 洋葱芯左侧 end

  const result = next(action);

  // 洋葱芯右侧 start
  console.log('next state:', getState());
  // 洋葱芯右侧 end

  return result;
}
```

其中的“洋葱芯”就是 `next(action)` 函数，即原始的 `dispatch` 函数的执行（调用 Reducer 计算下一状态），而这里的返回值并不重要。

因为 `next(action)` 语句的执行位置是任意且同步的（Reducer 是同步执行的纯函数），所以 `next(action)` 之前的语句可以理解为洋葱芯的左侧，而之后的语句就是洋葱芯的右侧。而在洋葱芯右侧，使用 `getState()` 得到的就是最新的状态了。