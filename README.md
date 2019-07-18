# nConsole
Shared console
> nConsole v1.0.0 使用

```js
// 打开其他此页面窗口或其他设备时，数据共享打印
// 共享代码的 error ,监听了全局的错误事件 onerror
console.log(1)
console.info(1)
//...

// 让其他正在开启的浏览器执行表达式
console.compiler('window.navigator.userAgent')

// 打印其他窗口请求过的资源 与 performance.getEntriesByType('resource') 相同
console.performance()
console.performance('resource')

// 打印其他窗口加载页面的时间 与 performance.timing 相同
console.performance('timing')

// 打印其他窗口的 fetch 请求
// 开启
console.fetch.open()
// 关闭
console.fetch.close()
```