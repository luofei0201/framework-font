import Vue from 'vue'
import Router from 'vue-router'

/** 老版本webpack不支持动态import()，使用require.ensure替代
  const mainM = require('@/views/mainChat')

  // 主聊天界面
  const main = r => require.ensure([], () => r(mainM), 'main')
*/
const room = () => import('@/views/mainRoom')
const chat = () => import('@/views/mainRoom/chat')
const lineUp = () => import('@/views/mainRoom/line-up')
const serverDetail = () => import('@/views/mainRoom/serverDetail')
const share = () => import('@/views/share')
const leaveMessage = () => import('@/views/mainRoom/leave-message')
const cusServ = () => import('@/views/mainRoom/cusServ')
const csList = () => import('@/views/mainRoom/components/service/cs-list')
const csAdd = () => import('@/views/mainRoom/components/service/cs-add')
const csGiftsList = () => import('@/views/mainRoom/components/service/cs-gifts-list')

const test = () => import('@/views/test')
const testT = () => import('@/views/testT')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/room',
      name: 'room',
      component: room,
      children: [
        {
          path: '/room/chat',
          name: 'chat',
          component: chat
        },
        {
          path: '/room/line-up',
          name: 'line-up',
          component: lineUp
        },
        {
          path: '/room/leaveMessage',
          name: 'leaveMessage',
          component: leaveMessage
        },
        {
          path: '/room/cusServ',
          name: 'cusServ',
          component: cusServ,
          children: [
            {
              path: '/room/cusServ/list',
              name: 'cusServList',
              component: csList
            },
            {
              path: '/room/cusServ/add',
              name: 'cusServAdd',
              component: csAdd
            },
            {
              path: '/room/cusServ/serverDetail',
              name: 'serverDetail',
              component: serverDetail
            },
            {
              path: '/room/csGiftsList',
              name: 'csGiftsList',
              component: csGiftsList
            }
          ]
        }
      ]
    },
    {
      path: '/share',
      name: 'share',
      component: share
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      children: [
        {
          path: '/test/:id',
          name: 'testT',
          component: testT
        }
      ]
    }
    // {
    //   path: '/',
    //   redirect: '/room'
    // }
  ],
  base: '/video/',
  // 路由跳转从顶部开始，个人中心 && 礼物记录页面需要
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
