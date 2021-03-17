/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '../store'
import JSONBig from 'json-bigint' // 处理js中的大数字
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // 处理后端返回的数据格式
  transformResponse: [function(data) {
    // data就是后端返回的原始数据
    try {
      return JSONBig.parse(data)
    } catch (error) {
      // return JSON.parse(data) 后端会默认这样处理
      return data
    }
  }]
})
// 设置请求拦截器，在发出请求前配置一些信息，例如对有权限的接口设置令牌
request.interceptors.request.use(config => {
  const userinfo = store.state.userinfo
  // 如果 userinfo 存在 并且 token 有效期没过 即存在，就添加令牌
  if (userinfo && userinfo.token) {
    config.headers.Authorization = `Bearer ${userinfo.token}`
  }
  return config
})
export default request
