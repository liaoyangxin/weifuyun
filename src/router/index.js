import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import VueRouter from 'vue-router'


// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve),
      },
    ],
  },
  {
    path: '',
    redirect: '/index',
    hidden: true,
  },
  {
    path: '/index',
    component: Layout,
    redirect: '/',
    name: '首页',
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: '/index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        hidden: true,
        meta: {
          title: '首页',
          icon: 'dashboard',
          breadcrumb: false,
          noCache: true,
          affix: true,
        },
      },
    ],
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true,
  },
  {
    path: '/login2',
    component: (resolve) => require(['@/views/login2'], resolve),
    hidden: true,
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true,
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true,
  },
]

const router = new VueRouter({
  base: '/web/',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,

}); 

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


export default router;
