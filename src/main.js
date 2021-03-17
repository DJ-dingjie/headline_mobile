import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入格式化时间的工具
import './utils/dayjs'
// 导入全局样式表
import './styles/index.less'
// 导入动态设置 REM基准值
import 'amfe-flexible'
// 导入 vant 组件库
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
