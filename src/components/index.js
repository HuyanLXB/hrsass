// 此文件负责对自定义组件进行全局注册
import PageToll from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImgUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'

export default {
  install(Vue) {
    Vue.component('PageToll', PageToll) // 全局注册一个工具栏
    Vue.component('UploadExcel', UploadExcel) // 全局注册一个Excel导入组件
    Vue.component('ImgUpload', ImgUpload) // 全局注册一个图片上传组件
    Vue.component('ScreenFull', ScreenFull) // 全局注册一个图片上传组件
  }
}
