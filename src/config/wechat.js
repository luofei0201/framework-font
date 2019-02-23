import Vue from 'vue'
import { wxConfig } from '../server'

const jsApiList = [
  ''
]

export default (callback) => {
  const url = encodeURIComponent(window.location.href.split('#')[0])
  console.log(Vue.wechat)
  if (window.navigator.userAgent.indexOf('MicroMessenger') > -1) {
    Vue.wechat.error((res) => {
      // document.body.innerHTML = res.errMsg;
      // IOS 报错但任然可以正常使用
      console.info(res)
    })
    wxConfig(url).then((r) => {
      if (callback) {
        callback(r)
      }
      if (r && r.code === 0) {
        Vue.wechat.config({
          ...r.data,
          // debug: false,
          debug: process.env.NODE_ENV === 'development',
          jsApiList
        })
      }
    }).catch((err) => {
      document.body.innerHTML = err.toString()
    })
  } else {
    console.info('not wechat')
  }
}
