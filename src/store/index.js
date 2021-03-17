import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '../utils/localStorage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来存储用户登录成功后的权限信息
    userinfo: getItem('HEADLINE_USER'),
    activeChannel: 0,
    userId: getItem('USER_ID')
  },
  mutations: {
    // 保存用户登录成功后的权限信息  到 userinfo 里面
    setUserinfo(state, data) {
      state.userinfo = data
      // 将用户登录成功后的权限信息 保存到 session 中 为了防止页面刷新后数据为空
      setItem('HEADLINE_USER', data)
    },
    showActiveChannel(state, active) {
      state.activeChannel = active
    },
    setUserId(state, id) {
      state.userId = id
      setItem('USER_ID', id)
    }
  },
  actions: {},
  modules: {},
  getters: {}
})
