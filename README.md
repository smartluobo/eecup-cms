# frontend-framework

## 项目初始化
```
npm install
```

### 打开开发服务器
```
npm run serve
```

### 编译
```
npm run build
```

### 测试
```
npm run test
```

### 代码规范化检查
```
npm run lint
```

### vue项目配置项
[项目配置项](https://cli.vuejs.org/config/).

## 模板包含

### 文件结构

\| - public  
\| - \| - images  
\| - \| - static   
\| - \| - \| - mock   
\| - \| - \| - \| - 404.json  
\| - \| - \| - i18n  
\| - \| - \| - \| - en-us.json  
\| - \| - \| - \| - zh-cn.json  
\| - src  
\| - \| - components  
\| - \| - env   
\| - \| - \| - apis.js   
\| - \| - \| - axios.js   
\| - \| - \| - coms.js   
\| - \| - \| - i18n.js   
\| - \| - \| - config.js   
\| - \| - \| - router.js   
\| - \| - \| - vuex.js   
\| - \| - pages  
\| - \| - \| - mixins  
\| - \| - \| - \| - comSwitch.js  
\| - \| - \| - \| - pageView.js  
\| - \| - \| - login.vue  
\| - \| - \| - index.vue   
\| - \| - App.vue  
\| - \| - main.js  
\| - vue.config.js  
\| - babel.config.js

### Mock
mock文件映射规则为：  
``/api/region?foo=1&bar=2``  
映射到  
``/public/static/mock/region+foo=1&bar=2.json``  
  
#### 注意事项
1. 当全局配置DATA_INTERFACE_LOCAL为true时所有接口转用本地Mock
2. 云梯系统的接口后缀会由运行时框架和测试服务器框架统一增加或去除，前端开发人员不必理会。
3. 每一个接口都必须在本地包含至少一个mock文件，用以保证在后端所有接口都无法正常运行的情况下能够在本地进行大部分功能的测试。

### 图片文件夹
图片文件夹为/public/images/  
可在代码中使用``${PUBLIC_IMAGES}/test.png`` 动态引入图片

### 组件的包含

组件自动包含以下对象或变量：
* axios axios实例，发起ajax
* apis apis实例，保存所有apis名
* DEBUG 全局DEBUG变量
* DATA_INTERFACE_LOCAL 数据接口是否使用本地mock
* BASEURL 发布的目录
* APIS 接口地址
* IS_YUNTI 是否使用云梯后台
* PUBKEY 加密用公钥
* PUBLIC_IMAGES 图片文件夹路径

若项目负责人认为有必要添加新的全局变量可在/public/env/config中添加

#### 使用方式
```js
this.axios.get( '/api/region?foo=1&bar=2' ).then...
```
```js
if ( this.DEBUG ) {
    console.log( foo );
}
```
```html
<img :src="`${PUBLIC_IMAGES}/test.png`">
```

### vuex的组件内声明
无需再vuex实例化的地方添加state和mutation，只需要在自己的组件里声明所有需要使用到的状态，vuex-declaration组件会自动将组件内声明的状态动态注册入state
#### 使用方式
```js
export default {
    data () { ... },
    created () { ... },
    beforeCreate () { ... },

    // 在组件里声明将要使用的所有状态
    state : [ 'area', 'indicator' ],
    
    // 或

    // 声明状态时同时声明他所在的模块
    state : {
        area : {
            module : 'base',
        },
        com_indicator_pane : {
            module : 'components',
        }
    },

    methods : {
        init () {
            // 声明的状态会注册入vuex的base模块
            var area = this.$store.state.base.area;
            // 提交状态不变
            this.$store.commit( 'area', '...' );
        }
    },

    computed : {
        // 使用mapState展开状态
        ...mapState( {
            area : s => s.base.area,
            indicator : s => s.base.indicator,
        } ),
    },

    // 监听状态
    watch : {
        '$store.state.base.indicator' () {
            // todo
        }
    }
}
```

#### 注意事项
1. 状态的mutation中仅包含赋值，不包含其他处理
2. 默认情况下会将状态注册入base模块，带模块的状态使用方式请参考vuex官网
3. 项目负责人需要定义多个模块并对协作者声明模块的功能，比如：基本状态模块、组件开关模块、筛选条件模块等，协作者遵守模块定义并谨慎添加新的状态变量

### 视图

#### 视图的声明与组织

基本视图使用vue-router进行管理，每一个路由项（链接）都视作为一个基本视图，通过在/env/router.js里添加路由项，修改路由项里的meta属性定义一个基本视图
```js
{
    name : '',
    path : '',
    /**
     * 定义视图所使用的组件包
     */
    meta : [ 'com_foo', 'com_bar' ],
    /**
     * 所有视图均使用同一个component作展示，即不通过物理分割的方式组织视图
     */
    component : index,
}
```

#### 视图的保存与重置

视图的保存与重置方法保存在/pages/mixins/pageView.js里，页面按需引用，首页默认会引用。

```js
import pageView from './mixins/pageView';
export default {
    mixins : [pageView],

    methods : {
        saveView () {
            // 获取视图
            const view = this.getSysView();
        },

        setView( view ) {
            // 重置视图
            this.setSysView( view );
        }
    }
}
```

保存时调用``getSysView``，会保存$store所有状态与当前所在路由视图，重置调用``setSysView``，会跳转到传入的视图并重置保存的$store


### 本地化

```html
<template>
    <div>{{$e( '测试文本' )}}</div>
</template>
```

```js
export default {
    data () {
        return {
            textTitle : $e( '文本标题' ),
            textFormat : $e( '带参数的格式化（%s）', 6 ),
        }
    }
}
```

#### 本地化设置

1 添加需要支持的本地化列表，可以在/vue.config.js中添加

```js
    configureWebpack: {
        plugins: [
            // 需要生成本地化语言文件的语言列表
            new outputI18nFilePlugin( [
                "en-us",
                "zh-cn",
            ] )
        ]
    },
```

2 设置编译时需要嵌入的本地化文件，在/src/env/i18n.js中修改

```js
import texts from '../../public/static/i18n/zh-cn.json'
```

3 运行``npm run build``后，会在/public/static/i18n/目录下生成对应的多个文件，将文件交给翻译人员，由翻译人员将文本翻译后嵌入其中覆盖原文件即可
```js
{
    "原始文本": {
        "text": "Text for translation"
    },
    "带数据文本：（ %s）": {
        "text": "Text with data：（%s）"
    }
}
```

#### 用户行为日志（基本）

框架添加了用户点击行为的日志记录，主要记录内容为{时间戳, 自定义字符串}，方式如下  

在.vue的html中添加行为日志
```html
<div v-va="`父类.子类.${数据}`"></div>
```

在.vue的js代码中添加行为日志
```js
foo ( data ) {
    // 生成`父类.子类.数据`字符串，分隔符可自定义
    this.$va( '父类', '子类', data );
}
```

在其他代码中添加行为日志
```js
import va from '@/env/va.js'

va( '父类', '子类', data );
```

> 当遇到网络状况时，日志会被积累，直到网络通畅后统一上报
> 目前只有点击事件可以被vue-dom响应并上报，其他时间需要自行添加事件响应方法并手动调用$va方法，后续可能会添加更多的事件并区分上报


## 更新

#### v0.1.0
- 添加框架基础功能

#### v0.1.1
- 修复应用本地mock时axios未在request时增加``/api``前缀的错误
- 修复全局配置变量无法应用的错误

#### v0.2.0
- 添加视图保存与重置
- 添加本地化文本生成（部分功能）

#### v0.2.1
- 完成本地化文本生成，修复本地化方法嵌入template标签后无法获取的问题

#### v0.3.0
- 添加行为日志记录，允许即时或延迟上报用户行为日志组


## 未来版本（未实现）

* 单元测试框架
