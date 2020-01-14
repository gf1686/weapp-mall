####自定义日志埋点上报

思路：
1. 拦截小程序App和Page的生命周期函数
2. 自定义日志上报 app.$report(event, options)
3. 数据模型
```javascript
const mongoose = require('mongoose');
const {Schema} = mongoose;

// 系统信息
let systemInfoSchema = new Schema({
    'model': String,
    'pixelRatio': Number,
    'system': String,
    'language': String,
    'version': String,
    'SDKVersion': String,
    'brand': String,
    'platform': String
}, {_id: false});

// 行为轨迹
let logSchema = new Schema({
    'event': String, // 事件名
    'options': Object, // 内容
    'timestamp': String // 触发时间戳
}, {_id: false});

// 整体结构
let trackSchema = new Schema({
    'ip': String, // 用户ip
    'openid': {type: String, index: true}, // 用户openid
    'path': {type: String, index: true}, // 小程序路径
    'id': {type: String, index: true}, // 页面参数: ID
    'scene': Number, // 场景值
    'project': String, // 小程序项目名,
    'networkType': String, // 网络类型
    'systemInfo': systemInfoSchema, // 系统信息
    'logs': [logSchema] // 埋点信息
}, {timestamps: true});

module.exports = mongoose.model('track', trackSchema);
```
>> ps: 关于用户ip的获取，可由服务端获取。
如果我们使用了Nginx做了反向代理，曾需要在nginx配置文件中加上真实请求的来源；
```
location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Real-Port $remote_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
如果后台服务使用了nodejs的KOA框架，则只需设置`app.proxy = true;`,
然后通过`ctx.request.id`即可获取到真实ip;

3. 前端上报日志接口数据格式
```json
{
    "project": "weapp-mall",
    "logs": [
        {
            "event": "onLaunch",
            "options": {
                "path": "pages/index/index",
                "query": {},
                "scene": 1001,
                "referrerInfo": {}
            },
            "timestamp": 1579015065957
        },
        {
            "event": "onLoad",
            "options": {},
            "timestamp": 1579015068990
        },
        {
            "event": "onShow",
            "options": {},
            "timestamp": 1579015068991
        },
        {
            "event": "onHide",
            "options": {},
            "timestamp": 1579015071535
        }
    ],
    "path": "subPages/goods/detail/index",
    "openid": "12344455",
    "scene": 1001,
    "networkType": "wifi",
    "systemInfo": {
        "model": "iPhone 6/7/8",
        "pixelRatio": 2,
        "system": "iOS 10.0.1",
        "language": "zh",
        "version": "7.0.4",
        "SDKVersion": "2.10.0",
        "brand": "devtools",
        "platform": "devtools"
    }
}
```

使用方式：
1. 入口文件注入拦截器
```javascript
import interceptor from './report/interceptor';
interceptor.init();
```

2. 设置全局日志存储对象
```javascript
/**
 * 需要用到 async/await 的页面引出以下内容即可
 * const { regeneratorRuntime } = global
 * */
Object.assign(global, {
    regeneratorRuntime,
    _track: null
});

```

3. 注入全局方法$report到App上
```javascript
import { $report } from './report/index'; // 日志上报
App({
    $report,
    onLaunch () {}
});
```