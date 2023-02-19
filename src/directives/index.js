// 自定义指令写在该文件中，进行集中管理
// Vue.directive('指令名称', {
//     // 会在当前指令作用的dom元素 插入之后执行
//     // options 里面是指令的表达式 其中有一个属性叫做value
//     inserted: function (dom,options) {

//     }
// })

export const imageError = {
  inserted: function(dom, options) {
    // 当图片有地址，但图片未加载成功时会触发图片的onerror事件 dom此时就可以被认为是图片
    dom.onerror = () => {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value
    }
  }

}
