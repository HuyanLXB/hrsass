// 导出一个axios实例 并且这个实例要有 响应拦截器 请求拦截器
import Axios from 'axios'
import { Promise } from 'core-js'
import { Message } from 'element-ui'
import store from '@/store'

// 创建一个axios实例
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置数据请求的基地址
  timeout: 5000
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 客户端请求成功服务器端有响应数据会执行这个函数
  const { success, message, data } = response.data
  if (success) {
    // 业务执行正确 返回获取的数据
    return data
  } else {
    // 业务执行错误进行错误提示
    Message.error(message)
    // 调用promise的reject方法使得该错误被cath捕获
    return Promise.reject(new Error(message))
  }
}, error => {
  // 客户端请求失败会执行这个函数
  // 提示错误信息
  Message.error(error.message)
  // 返回错误
  return Promise.reject(error)
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 在这里需要统一注入token
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }

  // 必须返回配置
  return config
}, error => {
  return Promise.reject(error)
})

// 导出service实例
export default service
