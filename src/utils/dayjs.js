import Vue from 'vue'
import dayjs from 'dayjs'
// 导入语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 全局使用
// 注册全局过滤器
Vue.filter('relativeTime', value => {
  // 获得 value 时间 到 目前的相对时间
  return dayjs().to(dayjs(value))
})
