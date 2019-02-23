// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import { WechatPlugin, AlertPlugin, ToastPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'
import router from './router'
import store from './store'

// 移动端调试 vConsole
let VConsole = require('../node_modules/vconsole/dist/vconsole.min')
// eslint-disable-next-line
let vConsole = new VConsole()

Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)

Vue.use(VueLazyload, {
  error: require('@/common/img/default_img.png'),
  loading: require('@/common/img/default_img.png')
})

Vue.prototype.$setgoindex = () => {
  if (window.history.length <= 1) {
    if (location.href.indexOf('?') === -1) {
      window.location.href = location.href + '?goindex=true'
    } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
      window.location.href = location.href + '&goindex=true'
    }
  }
}

Vue.prototype.targetLink = (src) => {
  // alert(`打开${src}`)
}

FastClick.prototype.onTouchEnd = function(event) {
  if (event.target.hasAttribute('type') && event.target.getAttribute('type') === 'file') {
    return false
  }
}
FastClick.attach(document.body) // 移动端消除300ms

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
