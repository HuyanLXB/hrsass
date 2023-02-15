// 导出一个axios实例 并且这个实例要有 响应拦截器 请求拦截器
import Axios from 'axios'

// 创建一个axios实例
const service = Axios.create({})
// 响应拦截器
service.interceptors.response.use()
// 请求拦截器
service.interceptors.request.use()

// 导出service实例
export default service
