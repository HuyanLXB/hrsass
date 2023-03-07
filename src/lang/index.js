import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
Vue.use(Vuei18n) // 全局注册 Vuei18n

// 1. 实例化一个i18n对象 并做好配置项并导出
// 2. 在项目的main.js中引入该对象 并注入到vue实例中
// 3. main.js 中调用i18n的t方法使得ElementUI的语言使用 i18n配置项中的语言
// Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
// 4.在侧边栏组件 SidebarItem 里面使用$t(key) 使得侧边栏文字也使用 i18n配置项中的语言
// 5.封装一个语言切换组件 用this.$i18n.locale = lang 来直接修改i18n实例的locale属性值 从而实现语言切换
// Vuei18n 会根据locale里的值去寻找messages里面对应的语言包
// 如 locale:'zh' 就会去找elementZH和customZH这个语言包
export default new Vuei18n({
  locale: Cookies.get('language') || 'zh', // 首先从本地获取语言包 如果没有就是zh
  messages: {
    en: {
      ...elementEN, // element的语言包 + 自定义的语言包
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})
