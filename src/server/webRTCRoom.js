// /* eslint-disable */
const WebRTCRoom = (() => {
  const serverDomain = '//xzb.qcloud.com/webrtc/weapp/webrtc_room'
  const serverDomainPrivate = 'https://vnap-webrtctest.ihxlife.com/room'
  // eslint-disable-next-line
  let requestNum = 0
  let heart = '' // 判断心跳变量
  let heartBeatReq = null
  // eslint-disable-next-line
  let requestSeq = 0 // 请求id
  // eslint-disable-next-line
  let requestTask = [] // 请求task

  let heartBeatFailCount = 0 // 心跳包超时失败次数

  /***********************************************************************************
   * http请求
   *
   * [request 封装request请求]
   * @param {object}
   *   url: 请求接口url
   *   data: 请求参数
   *   success: 成功回调
   *   fail: 失败回调
   *   complete: 完成回调
   *
   ************************************************************************************/
  function request(object) {
    if (!serverDomain) {
      console.error('请设置serverDomain')
      object.fail && object.fail({
        errCode: -1,
        errMsg: 'serverDomain为空, 请调用init接口进行设置'
      })
      return
    }
    httpRequest({
      url: serverDomain + object.url,
      data: object.data || {},
      method: 'POST',
      success: function(res) {
        if (res.data.code) {
          console.error(`请求失败, req=${JSON.stringify(object)}, resp=${JSON.stringify(res.data)}`)
          object.fail && object.fail({
            errCode: res.data.code,
            errMsg: res.data.message
          })
          return
        }
        object.success && object.success(res)
      },
      fail: object.fail || function() {},
      complete: object.complete || function() {}
    })
  }

  function requestPrivate(object) {
    if (!serverDomainPrivate) {
      console.error('serverDomainPrivate')
      object.fail && object.fail({
        errCode: -1,
        errMsg: 'serverDomainPrivate为空, 请调用init接口进行设置'
      })
      return
    }
    httpRequest({
      url: serverDomainPrivate + object.url,
      data: object.data || {},
      method: 'POST',
      success: function(res) {
        if (res.code) {
          console.error(`请求失败, req=${JSON.stringify(object)}, resp=${JSON.stringify(res)}`)
          object.fail && object.fail({
            errCode: res.code,
            errMsg: res.message
          })
          return
        }
        object.success && object.success(res)
      },
      fail: object.fail || function() {},
      complete: object.complete || function() {}
    })
  }

  function httpRequest(object) {
    object = object || {}
    object.method = (object.method || 'GET').toUpperCase()
    object.dataType = 'json'
    var params = formatParams(object.data)

    // 创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest()
    } else { // IE6及其以下版本浏览器
      // eslint-disable-next-line
      var xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    var timeoutTime = typeof (object.timeout) === 'undefined' ? 10000 : object.timeout
    var timeout = false
    const timer = setTimeout(function() {
      timeout = true
      xhr.abort()
    }, timeoutTime)
    // 接收 - 第三步
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (timeout) {
          object.fail && object.fail({
            code: -1,
            msg: '请求超时'
          })
        }
        var status = xhr.status
        clearTimeout(timer)
        if (status >= 200 && status < 300) {
          var jsonObj = JSON.parse(xhr.responseText)
          object.success && object.success({
            status: status,
            data: jsonObj
          })
        } else {
          object.fail && object.fail({
            code: status,
            msg: xhr.message
          })
        }

        object.complete && object.complete()
      }
    }

    // 连接 和 发送 - 第二步
    if (object.method === 'GET') {
      xhr.open('GET', `${object.url}?${params}`, true)
      xhr.send(null)
    } else if (object.method === 'POST') {
      xhr.open('POST', object.url, true)
      // 设置表单提交时的内容类型
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(params)
    }
  }

  // 格式化参数
  function formatParams(data) {
    var jsonStr = JSON.stringify(data)
    return jsonStr
    // var arr = [];
    // for (var name in data) {
    //     arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    // }
    // arr.push(("v=" + Math.random()).replace(".",""));
    // return arr.join("&");
  }

  return {
    request,
    requestPrivate,
    heart,
    heartBeatReq,
    heartBeatFailCount
  }
})()

export default {
  getLoginInfo: function(userID, success, fail) {
    var data = {}
    if (userID) {
      data.userID = userID
    }
    WebRTCRoom.requestPrivate({
      url: '/getLoginInfo',
      data: data,
      success: success,
      fail: fail
    })
  },
  // getLoginInfo: function(userID, success, fail) {
  //   var data = {}
  //   if (userID) {
  //     data.userID = userID
  //   }
  //   WebRTCRoom.request({
  //     url: '/get_login_info',
  //     data: data,
  //     success: success,
  //     fail: fail
  //   })
  // },

  /**
   *
   * 向用户推送一条消息
   * msgBody:{
   "userID":"cs-test",   --用户ID
   "msgBody":
   {
   	"data":"0",           --推送的数据
   	"desc":"提示信息",    --描述信息
   	"ext":"扩展信息"      --扩展信息
    }
   }
   * @param msgBody
   * @param success
   * @param fail
   */

  pushUserMsg: function(msgBody, success, fail) {
    WebRTCRoom.requestPrivate({
      url: '/pushMsg',
      data: msgBody,
      success: success,
      fail: fail
    })
  },

  /**
   * 拉取群漫游消息
   * @param groupId
   * @param msgNumber
   * @param success
   * @param fail
   */
  syncGroupC2CMsg: function(groupID, msgNum, success, fail) {
    var data = {}
    if (groupID) {
      data.groupID = groupID
    }
    if (msgNum) {
      data.msgNum = msgNum
    }
    WebRTCRoom.requestPrivate({
      url: '/syncGroupC2CMsg',
      data,
      success: success,
      fail: fail
    })
  },

  getRoomList: function(index, count, success, fail) {
    WebRTCRoom.request({
      url: '/get_room_list',
      data: {
        index: index,
        count: count
      },
      success: success,
      fail: fail
    })
  },

  createRoom: function(userID, nickName, roomInfo, success, fail) {
    console.warn(`创建房间:${userID},${roomInfo}`)
    WebRTCRoom.request({
      url: '/create_room',
      data: {
        userID: userID,
        nickName: nickName,
        roomInfo: roomInfo
      },
      success: (res) => {
        console.warn('创建房间成功:', res)
        success && success(res)
      },
      fail: fail
    })
  },

  enterRoom: function(userID, nickName, roomID, success, fail) {
    WebRTCRoom.request({
      url: '/enter_room',
      data: {
        userID: userID,
        roomID: roomID,
        nickName: nickName
      },
      success: (res) => {
        success && success(res)
      },
      fail: fail
    })
  },

  quitRoom: function(userID, roomID, success, fail) {
    WebRTCRoom.request({
      url: '/quit_room',
      data: {
        userID: userID,
        roomID: roomID
      },
      success: success,
      fail: fail
    })
    this.stopHeartBeat()
  },

  get_room_members: function(roomID, success, fail) {
    WebRTCRoom.request({
      url: '/get_room_members',
      data: {
        roomID: roomID
      },
      success: success,
      fail: fail
    })
  },

  startHeartBeat: function(userID, roomID, succ, fail) {
    WebRTCRoom.heart = '1'
    return setInterval(() => {
      this.heartBeat(userID, roomID, succ, fail)
    }, 7000)
  },

  stopHeartBeat: function() {
    WebRTCRoom.heart = ''
    if (WebRTCRoom.heartBeatReq) {
      WebRTCRoom.heartBeatReq.abort()
      WebRTCRoom.heartBeatReq = null
    }
  },

  heartBeat: function(userID, roomID, succ, fail) {
    if (!WebRTCRoom.heart) {
      return
    }
    WebRTCRoom.heartBeatReq = WebRTCRoom.request({
      url: '/heartbeat',
      data: {
        userID: userID,
        roomID: roomID
      },
      success: (res) => {
        WebRTCRoom.heartBeatFailCount = 0
        console.log('心跳成功', {
          userID: userID,
          roomID: roomID
        })
        succ && succ(userID, roomID)
      },
      fail: (res) => {
        WebRTCRoom.heartBeatFailCount++
        if (WebRTCRoom.heartBeatFailCount > 2) {
          fail && fail(userID, roomID)
        }
      }
    })
  }
}
