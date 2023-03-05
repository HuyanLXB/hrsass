import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 每个人都会拥有静态路由
  rutes: constantRoutes // 用来存放用户能够访问的路由
}
const mutations = {
  setRutes(state, newRoute) {
    // 每次更新路由都应该在静态路由的基础上进行改变
    state.rutes = [...constantRoutes, ...newRoute]
  }
}
const actions = {
  // menus: ["settings","permissions"]
  // 筛选出动态路由中能够和menus中对得上的路由
  filterRoute(comtext, menus) {
    const routes = []
    menus.forEach(key => {
      console.log('key', key)
      asyncRoutes.forEach(item => {
        item.name === key ? routes.push(item) : ''
      })
    })
    // console.log('动态路由', menus)
    // console.log('动态路由', routes)
    comtext.commit('setRutes', routes)
    // 这里为什么还要return  state里的数据是用来显示左侧菜单用的
    //  return 的数据 是给路由addRoutes用的
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
