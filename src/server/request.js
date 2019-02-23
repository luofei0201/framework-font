import Vue from 'vue'
import { AjaxPlugin, ToastPlugin } from 'vux'
import conf from '../config/index'
// import { debug } from 'util'

Vue.use(AjaxPlugin)
Vue.use(ToastPlugin)
// Vue.use('/api', function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
// })

// Vue.http.defaults.withCredentials = true

const hostFilter = hostType => {
  switch (hostType) {
    case 'video':
      return conf.videoPath
    case 'RTCRoom':
      return conf.webRTCRoomPath
    case 'TM':
      return conf.TMPath
    case 'user':
      return conf.userPath
    case 'chat':
      return conf.chatPath
    case 'onLine':
      return conf.onlinePath
  }
}

// Vue.http.interceptors.response.use(data => data, (error) => {
//   if (error.response.status === 401) {
//     const paramsString = encodeURI(window.location.href)
//     if (paramsString.indexOf('ticketActivity') > -1) {
//       // const href='http://'+window.location.host;
//       // console.log(this)
//       Vue.$vux.toast.text(error.response.data.msg, 'top')
//       setTimeout(() => {
//         window.location.href = `${error.response.data.loginUrl}?service=${paramsString}`
//       }, 500)
//     }
//   } else {
//     Vue.$vux.toast.text(error.response.data.msg, 'top')
//   }
//   return Promise.reject(error)
// })

export default {
  post: (hostType, url, data, error, option) => Vue.http.post(hostFilter(hostType) + url, data, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.error(err)
      }
    }),
  get: (hostType, url, error, option) => Vue.http.get(hostFilter(hostType) + url, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  getExternal: (hostType, url, error, option) => Vue.http.get(hostFilter(hostType) + url, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  put: (hostType, url, data, error, option) => Vue.http.put(hostFilter(hostType) + url, data, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  // eslint-disable-next-line
  delete: (hostType, url, error, option) => Vue.http.delete(hostFilter(hostType) + url, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  handleLessPost: (hostType, url, data, error, option) => Vue.http.post(hostFilter(hostType) + url, data, option)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.error(err)
      }
    }),
  url(hostType, path) { return hostFilter(hostType) + path }
}
