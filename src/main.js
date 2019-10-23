import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import router from './router'
import store from './store'
import config from './config'
import { request } from './api'
import dayjs from 'dayjs'
import * as filters from '@/libs/filters'
import func from '@/libs/func_prototype'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import './assets/font/iconfont.js'
import './assets/css/index.less'
VXETable.setup({
  // 默认表格参数
  size: 'mini',
  showOverflow: true,
  showHeaderOverflow: true,
  resizable: true,
  fit: true,
  highlightCurrentRow: true,
  highlightHoverRow: true
})

Vue.use(VXETable)

Vue.use(iView)
Vue.use(func)
// 设置全局配置
Vue.use(vuescroll, {
  ops: {
    bar: {
      background: '#cecece'
    }
  }
})

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

/**
 * @description 全局注册请求变量
 */
Vue.prototype.$request = request
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * @description 全局注册dayjs
 */
Vue.prototype.$dayjs = dayjs

Vue.prototype.$Message.config({
  top: 80
})

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
