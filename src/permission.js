//  控制页面登录权限的文件
// 对页面跳转行权限控制,需要路由实例
import router from './router'
import store from '@/store'
// 进度条的第三方插件
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const wightList = ['/404', '/login']
// 路由的前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 1.判断当前是否有token
  if (store.getters.token) {
    // 当有token之后调用用户接口获取用户信息
    if (!store.getters.userId) {
      // 为了防止频繁进行数据请求只有在用户信息不存在的时候才进行用户信息获取
      const { roles } = await store.dispatch('user/getUserInfo')
      // 写await的目的是保证用户信息获取成功之后再进行跳转，保证后续的页面能使用用户信息
      // 筛选用户可访问的路由
      const routes = await store.dispatch('permission/filterRoute', roles.menus)
      // 新增动态路由
      router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
      // 新增完动态路由之后必须要有下面这段代码
      next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
      // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
    }
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
