# zxm-node-cache

利用node操作文件, 实现一个简单的缓存方法

## 安装

``` bash
npm install -S zxm-node-cache
```

## 使用

``` js
const cache = require('zxm-node-cache');

// 缓存数据 , 第三个参数可以设置储存时效，默认单位是秒。不传的话默认存储三十天
let data = cache.save('app_user_info', {
    name: '张三',
    age: 18
})

// 缓存数据十秒钟
let data1 = cache.save('app_user_info', {
    name: '张三',
    age: 18
}, 10)

// 获取缓存 , 如果缓存过期就返回一个空字符串
let app_user_info = cache.get('app_user_info');

// 删除单个缓存数据
cache.clear('app_user_info')

// 删除全部缓存数据
cache.clearAll();
```
