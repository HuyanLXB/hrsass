import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from '@/lang/index'
import * as directives from '@/directives'
import * as filters from '@/filters'

import '@/icons' // icon
import '@/permission' // permission control
import Components from '@/components'
Vue.use(Components) // 对自己的插件进行全局注册
// 注册打印插件
import Print from 'vue-print-nb'
Vue.use(Print)
// 引入混入函数
import checkPermission from '@/mixin/checkPermission'
// 全局混入
Vue.mixin(checkPermission)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// i18n 的t方法会根据key去找对应的语言包
// key 就是i18n实例对象里面的locale属性的值
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
// 给所有导出的自定义指令进行全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives.imageError)
})

// 给所有的过滤器进行全局注册
Object.keys(filters).forEach(key => {
  // 注册自定义指令
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
