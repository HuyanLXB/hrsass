// 导入进行本地缓存的工具
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入登录接口
import { login, getUserInfo, getUserInfoById } from '@/api/user'

// 状态
const state = {
  // 定义用户的token
  token: getToken(), // 从本地缓存中获取token
  // 定义存储用户的数据
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
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
  },
  // 设置用户信息
  setUserInfo(state, baseUserInfo) {
    // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    state.userInfo = { ...baseUserInfo }
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
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
  },
  // 调用获取用户信息的接口 在进行页面跳转的时候进行访问
  async getUserInfo(context) {
    // 获取用户信息
    const res = await getUserInfo()
    // 获取用户的头像
    const res2 = await getUserInfoById(res.userId)

    // 将两次数据进行合并
    const baseUserInfo = { ...res, ...res2 }
    console.log(baseUserInfo)
    // 将获取到的数据更新到state中
    context.commit('setUserInfo', baseUserInfo)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

