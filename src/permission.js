//  控制页面登录权限的文件
// 对页面跳转行权限控制,需要路由实例
import router from './router'
import store from '@/store'
// 进度条的第三方插件
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const wightList = ['/404', '/login']
// 路由的前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 1.判断当前是否有token
  if (store.getters.token) {
    // 有token，判断是否去往登录页
    if (to.path === '/login') {
      // 如果是去往登录页，直接跳转到主页
      next('/')
    } else {
      // 如果不是去往登录页，则直接放行
      next()
    }
  } else {
    // 没有token，判断去往的页面是否在白名单内
    if (wightList.indexOf(to.path) > -1) {
      // 去往的页面在白名单内 放行
      next()
    } else {
      // 不在白名单内 跳转往登录界面
      next('/login')
    }
  }

  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 路由的后置守卫
router.afterEach((to, from, next) => {
  // 关闭进度条
  NProgress.done()
})
