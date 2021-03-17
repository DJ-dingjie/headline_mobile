import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    // 加载 login 组件
    component: () => import('@/views/login')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search')
  },
  {
    path: '/article/:id',
    name: 'articleDetail',
    props: true,
    component: () => import('../components/article-detail')
  },
  {
    path: '/user-edit',
    name: 'userEdit',
    component: () => import('../views/user/user-edit')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/tab'),
    redirect: '/my',
    children: [
      { path: '/home', component: () => import('../views/tab/children/home.vue') },
      { path: '/qa', component: () => import('../views/tab/children/qa.vue') },
      { path: '/vedio', component: () => import('../views/tab/children/vedio.vue') },
      { path: '/my', component: () => import('../views/tab/children/my.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
