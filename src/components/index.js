// 此文件负责对自定义组件进行全局注册
import PageToll from '@/components/PageTools'
export default {
  install(Vue) {
    Vue.component('PageToll', PageToll)
  }
}
