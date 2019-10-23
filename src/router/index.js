import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import config from '@/config'
import store from '@/store'
import iView from 'iview'
import { session } from '@/libs/location'

const { title } = config

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/admin_web/' : '/'
})

router.beforeEach((to, from, next) => {
  document.title = title
  iView.LoadingBar.start()

  // let json = {
  //   sign: '28A9DB35C627CC87B2A7B82E2B6D2144',
  //   timestamp: '1558950954',
  //   system_code: 'njwd_finance',
  //   root_enterprise_name: 'LV正式1226',
  //   user_name: 'lvjunxi1234',
  //   admin_type: '-1',
  //   email: '',
  //   account: 'lvjunxi1234',
  //   user_id: '15284',
  //   root_enterprise_id: '2334',
  //   mobile: '12302111123'
  // }
  // 首次进入
  if (to.query.json) {
    // 从url获取json数据
    session.setItem('json', to.query.json)
  }

  if (store.state.user.hasGetInfo) {
    // 如果已经获取用户信息
    // 判断正在打开的tag是否已经存在
    // 判断tags页签打开的有没有达到上限
    if (store.state.user.tagNavList.findIndex(n => n.name === to.name) > -1 || store.state.user.tagNavList.length < 30) {
      next()
    } else {
      iView.Notice.warning({
        title: '警告',
        desc: '当前页签打开数量已达上限30个，不可再打开'
      })
      next({ name: from.name })
    }
  } else {
    let json = JSON.parse(session.getItem('json'))
    axios.defaults.baseURL = json.interface_url
    // 没有获取用户信息
    store.dispatch('getUserInfo', json).then(routes => {
      router.addRoutes(routes)
      // 首次进入Welcome
      if (session.getItem('welcome')) {
        // 判断如果是刷新动作则跳转首页，解决刷新时还是调用之前页面的接口
        if (session.getItem('onload')) {
          next({ name: 'home' })
        } else {
          next({ ...to,
            replace: true
          })
        }
      } else {
        next({ name: 'welcome' })
      }
    })
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
