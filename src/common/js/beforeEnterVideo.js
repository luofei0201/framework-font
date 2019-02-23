// import wx from 'weixin-jsapi'
// const wx = require('weixin-jsapi').wx;

/**
 *
 * Created by WangXj 。
 */
export function beforeEnterVideo() {
  // 判断手机类型, 系统的版本
  const device = sessionStorage.getItem('device')
  const browser = sessionStorage.getItem('browser')
  const ua = navigator.userAgent.toLowerCase()

  if (device === 'Android') {
    // 若为Android设备
    const reg = /android [\d._]+/gi
    const version = (ua.match(reg) + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
    console.log('该Android的系统版本为：' + version)
    // this.$emit('enterVideoLineUp') // 进入排队页面
    sessionStorage.setItem('enterVideoStatus', 'Android')
  } else if (device === 'iPhone') {
    //  若为ios设备，则需判断iOS的系统版本
    const ver = ua.match(/cpu iphone os (.*?) like mac os/)
    const version = parseFloat(ver[1].replace(/_/g, '.'))

    // 若用户当前设备的版本过低，则提示用户升级系统
    if (version < 11) {
      // this.$emit('low-version', 'true')
      sessionStorage.setItem('enterVideoStatus', 'low-version')
    } else if (device === 'iPhone' && browser === 'wx') {
      // 当前在微信内置浏览器中，弹层提示用户在浏览器中打开,
      // 而且用户此时点击右上角“...”出现的菜单项只有 “在Safari中打开一项”
      sessionStorage.setItem('enterVideoStatus', 'iOS-wx')
    } else if (device === 'iPhone' && browser === 'safari') {
      // 进入排队的页面
      sessionStorage.setItem('enterVideoStatus', 'iOS-Safari')
    }
  }
}
