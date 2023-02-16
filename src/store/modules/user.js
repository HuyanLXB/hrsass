// 导入进行本地缓存的工具
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入登录接口
import { login } from '@/api/user'

// 状态
const state = {
  // 定义用户的token
  token: getToken() // 从本地缓存中获取token
}

// 同步修改状态的方法
const mutations = {
  // 设置token
  setToken(state, token) {
    // 参数中的token是外部传入来的载荷
    state.token = token
    // 同步到缓存
    setToken(state.token)
  },
  // 删除token
  removeToken(state) {
    // 清除vuex中的数据
    state.token = null
    // 同步到缓存
    removeToken()
  }
}

// 异步修改状态的方法
const actions = {
  // 调用后端接口发起登录请求
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的res就是token
    // 能执行到这里说明业务肯定是正确的
    const res = await login(data)
    console.log(res)
    // 数据请求成功 更新vuex中的token
    context.commit('setToken', res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

