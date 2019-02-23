export default () => {
  const u = navigator.userAgent

  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    // Android
    sessionStorage.setItem('device', 'Android')
  } else if (u.indexOf('iPhone') > -1) {
    // iPhone
    sessionStorage.setItem('device', 'iPhone')

    // 微信内置浏览器否
    const ua = navigator.userAgent.toLowerCase()
    // eslint-disable-next-line
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      sessionStorage.setItem('browser', 'wx')
    } else {
      sessionStorage.setItem('browser', 'safari')
    }
  } else if (u.indexOf('Windows Phone') > -1) {
    sessionStorage.setItem('device', 'windowsPhone')
  }
}
