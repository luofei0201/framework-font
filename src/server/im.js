// import webim from 'webim'
/* eslint-disable */
import webim from '@/server/webim'
import { ERR_OK, pushSystemMsg } from '@/server/index.js'
const IM = (() => {
  function login(loginInfo, listeners, succ, fail) {
    webim.login(
      loginInfo,
      listeners,
      {
        isLogOn: false
      },
      function() {
        // 设置昵称
        webim.setProfilePortrait({
            'ProfileItem': [{
              'Tag': 'Tag_Profile_IM_Nick',
              'Value': loginInfo.identifierNick
            }]
          },
          function(resp) {
            succ()
          },
          function(err) {
            alert(err.ErrorInfo)
          }
        )
      },
      fail
    )
  }

  function logout() {
    webim.logout()
  }

  function createGroup(groupId, userID, succ, fail) {
    var options = {
      'GroupId': String(groupId),
      'Owner_Account': String(userID),
      'Type': 'AVChatRoom', // Private/Public/ChatRoom/AVChatRoom
      'ApplyJoinOption': 'FreeAccess',
      'Name': String(groupId),
      'Notification': '',
      'Introduction': '',
      'MemberList': []
    }
    webim.createGroup(
      options,
      function(resp) {
        if (succ) succ()
      },
      function(err) {
        if (err.ErrorCode === 10025 || err.ErrorCode === 10021) {
          if (succ) succ()
        } else {
          // eslint-disable-next-line
          sdkLog.error(err.ErrorInfo)
          if (fail) fail(err.ErrorCode)
        }
      }
    )
  }

  function joinGroup(groupId, identifier) {
    createGroup(groupId, identifier, function() {
      var options = {
        'GroupId': groupId // 群id
      }
      webim.applyJoinBigGroup(
        options,
        function(resp) {
          // JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
          if (resp.JoinedStatus && resp.JoinedStatus === 'JoinedSuccess') {
            console.log('进群成功')
            webim.Log.info('进群成功')
          } else {
            alert('进群失败')
          }
        },
        function(err) {
          if (err.ErrorCode === 10013) {
            console.warn('applyJoinGroupSucc', groupId)
            return
          }
          alert(err.ErrorInfo)
        }
      )
    }, function() {
      alert('进群失败')
    })
  }

  function quitGroup(group_id) {
    var options = null
    if (group_id) {
      options = {
        'GroupId': group_id
      }
    }
    if (options == null) {
      alert('退群时，群组ID非法')
      return
    }
    webim.quitGroup(
      options,
      (resp) => {
        // 退群成功
        console.log('退群成功')
      },
      (err) => {
        alert(err.ErrorInfo)
      }
    )
  }

  function parseMsgs(newMsgList) {
    var textMsgs = []
    newMsgList.filter((item) => {
      if (item.fromAccount === 'administrator') {
        // 系统消息
        textMsgs.push(parseMsgInSystem(item))
      } else {
        // 自定义消息
        textMsgs.push(parseMsg(item))
      }
    })
    // var whiteBoardMsgs = []
    // for (var i in newMsgList) { // 遍历新消息
      // var msg = {}
      // parseMsg(newMsgList[i])
      // if (msg && msg.type === 'TXWhiteBoardExt') {
      //   whiteBoardMsgs.push(msg.data)
      // } else {
      //   textMsgs.push(msg)
      // }
    // }
    return {
      textMsgs: textMsgs
      // whiteBoardMsgs: whiteBoardMsgs
    }
  }

  function parseMsg(newMsg) {
    var msgItem = newMsg.getElems()[0]
    var type = msgItem.getType()
    if (type === 'TIMCustomElem') {
      var content = msgItem.getContent() // 获取元素对象
      var desc = JSON.parse(content.getDesc())
      var msgType = desc.msgType
      var msgStatus = desc.msgStatus
      var time = desc.time
      var nickName = desc.nickName
      var avatar = desc.avatar
      var chatType = desc.chatType
      var ext = JSON.parse(content.getExt())
      if (ext.imgData) {
        var imgData = ext.imgData
      }
      if (ext.proxyInfo) {
        var proxyInfo = ext.proxyInfo
      }
      if (ext.giftInfo) {
        var giftInfo = ext.giftInfo
      }
    }
    return {
      nickName,
      avatar,
      imgData,
      proxyInfo,
      giftInfo,
      content: newMsg.toHtml(),
      isSelfSend: newMsg.getIsSend(),
      isSystem: false,
      msgType,
      msgStatus,
      chatType,
      time
    }
  }

  function parseMsgInSystem(newMsg) {
    var msgItem = newMsg.getElems()[0]
    var type = msgItem.getType()
    var nickName = newMsg.getFromAccountNick()
    var msgStatus = ''
    var msgType = ''
    var time = ''
    if (type === 'TIMCustomElem') {
      var content = msgItem.getContent() // 获取元素对象
      var data = JSON.parse(content.getData())
      var desc = content.getDesc()
    }
    return {
      code: data.code,
      csId: data.csId,
      csAvatar: data.csAvatar,
      csName: data.csName,
      csNick: data.csNick,
      likesCount: data.likesCount,
      csCode: data.csCode,
      chatGuid: data.chatGuid,
      userId: data.userId,
      userAvatar: data.userAvatar,
      userName: data.userName,
      nickName: data.nickName,
      userPhone: data.userPhone,
      openId: data.userId,
      origin: data.origin,
      robotSessionId: data.robotSessionId,
      sessionId: data.sessionId,
      accessId: data.accessId,
      queueStartTime: data.queueStartTime || data.startTime,
      queueEndTime: data.queueEndTime || data.endTime,
      isSystem: true,
      desc
    }
  }

  function sendC2CCustomMsg(from_id, to_id, msgInfo, succ_cb, fail_cb) {
    if (!from_id) {
      console.error("您还没有登录，暂不能聊天")
      return
    } else if (!to_id) {
      console.error("您还没有选择聊天对象，暂不能聊天")
      return
    }
    var data = msgInfo.data || ''
    var desc = msgInfo.desc || ''
    var ext = msgInfo.ext || ''
    // 是否保存进漫游消息（默认为1：同步到 From_Account 在线终端和漫游上）
    var isMsgSync = msgInfo.isMsgSync

    var msgLen = webim.Tool.getStrBytes(data)
    if (data.length < 1) {
      alert("发送的消息不能为空!")
      return
    }

    var selType = webim.SESSION_TYPE.C2C // 当前聊天类型
    var selToID = to_id // 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）

    var selSess = new webim.Session(selType, selToID, selToID, null, Math.round(new Date().getTime() / 1000))
    var isSend = true //是否为自己发送
    var seq = -1 //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296) //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000) //消息时间戳
    var subType = webim.GROUP_MSG_SUB_TYPE.COMMON
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, from_id, subType, msgInfo.nickName)
    var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext)
    msg.addCustom(custom_obj)

    webim.sendMsg(msg, (resp) => {
      console.log('发C2C自定义消息成功');
      succ_cb && succ_cb();
    }, function (err) {
      console.log('发C2C自定义消息失败:', err);
      fail_cb && fail_cb();
    });
  }

  // 发送自定义消息
  function sendGroupCustomMsg(msgInfo, callback) {
    if (!msgInfo.groupId) {
      console.error('您还没有进入房间，暂不能聊天')
      return
    }
    // custom消息
    var data = msgInfo.data || ''
    var desc = msgInfo.desc || ''
    var ext = msgInfo.ext || ''
    // 是否保存进漫游消息（默认为1：同步到 From_Account 在线终端和漫游上）
    var isMsgSync = msgInfo.isMsgSync

    var msgLen = webim.Tool.getStrBytes(data)
    if (data.length < 1) {
      alert('发送的消息不能为空!')
      return
    }
    var maxLen = webim.MSG_MAX_LENGTH.GROUP
    var errInfo = `消息长度超出限制(最多${Math.round(maxLen / 3)}汉字)`

    if (msgLen > maxLen) {
      alert(errInfo)
      return
    }

    var selSess = new webim.Session(webim.SESSION_TYPE.GROUP, msgInfo.groupId, msgInfo.groupId, null, Math.round(new Date().getTime() / 1000))
    var isSend = true // 是否为自己发送
    var seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
    var subType = webim.GROUP_MSG_SUB_TYPE.COMMON

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, msgInfo.identifier, subType, msgInfo.nickName)
    var customObj = new webim.Msg.Elem.Custom(data, desc, ext)
    msg.addCustom(customObj)

    // 调用发送消息接口
    webim.sendMsg(msg, (resp) => {
      console.log('发群组自定义消息成功')
      callback && callback()
    }, function(err) {
      webim.Log.info(err.ErrorInfo)
      console.log('发群组自定义消息失败:', err)
    })
  }

  // 发送提示消息（点赞、礼物，不保存进历史消息）
  function sendNoticeMsg(options, success, fail) {
    if (!options || !options.msg || !options.msg.trim()) {
      console.log('sendNoticeMsg参数错误', options)
      fail && fail({
        errCode: -9,
        errMsg: 'sendNoticeMsg参数错误'
      })
      return
    }
    let giftInfo = `{}`
    if (options.giftInfo) {
      giftInfo = JSON.stringify(options.giftInfo)
    }
    sendGroupCustomMsg({
      groupId: options.groupId,
      data: options.msg,
      desc: `{
        "nickName":"${options.nickName}",
        "avatar":"${options.avatar}",
        "msgType":"${options.msgType}",
        "time":"${options.time}",
        "msgStatus":"${options.msgStatus}",
        "chatType":"${options.chatType}"
      }`,
      ext: `{
        "giftInfo":${giftInfo}
      }`,
      identifier: options.identifier,
      nickName: options.nickName
    }, function() {
      success && success()
    })
  }

// 发送文本消息（保存进历史消息）
  function sendNormalMsg(from_id, to_id, options, success, fail) {
    if (!options || !options.msg || !options.msg.trim()) {
      console.log('sendNormalMsg参数错误', options)
      fail && fail({
        errCode: -9,
        errMsg: 'sendNormalMsg参数错误'
      })
      return
    }
    let imgDataStr = `{}`
    let proxyInfoStr = `{}`
    let giftInfoStr = `{}`
    let assessInfoStr = `{}`
    if (options.imgData) {
      imgDataStr = JSON.stringify(options.imgData)
    }
    if (options.proxyInfo) {
      proxyInfoStr = JSON.stringify(options.proxyInfo)
    }
    if (options.giftInfo) {
      giftInfoStr = JSON.stringify(options.giftInfo)
    }
    if (options.assessInfo) {
      assessInfoStr = JSON.stringify(options.assessInfo)
    }
    sendC2CCustomMsg(from_id, to_id, {
      data: options.msg,
      desc: `{
        "sessionId":"${options.sessionId}",
        "chatGuid":"${options.chatGuid}",
        "sendUserId":"${from_id}",
        "sendUserType":"1",
        "toUserId":"${to_id}",
        "toUserName":"${options.toUserName}",
        "toUserType":"2",
        "nickName":"${options.nickName}",
        "avatar":"${options.avatar}",
        "msgType":"${options.msgType}",
        "time":"${options.time}",
        "msgStatus":"${options.msgStatus}",
        "chatType":"${options.chatType}",
        "MsgLifeTime":"${options.MsgLifeTime}"
      }`,
      ext: `{
        "imgData":${imgDataStr},
        "proxyInfo":${proxyInfoStr},
        "giftInfo":${giftInfoStr},
        "assessInfo":${assessInfoStr}
      }`,
      isMsgSync: options.isMsgSync,
      identifier: options.identifier,
      nickName: options.nickName
    }, function() {
      success && success()
    }, function() {
      fail && fail()
    })
  }

  function formatImgMsgOption(images, options) {
    const imgMap = images.URL_INFO
    const imgData = imgMap.reduce((option, next) => {
      if (next.PIC_TYPE === 1) {
        Object.assign(option, {
          big: next.DownUrl,
          w: next.PIC_Width,
          h: next.PIC_Height
        })
      } else if (next.PIC_TYPE === 2) {
        option.small = next.DownUrl
      }
      return option
    }, {})
    return Object.assign(options, { imgData })
  }

  // 上传照片
  function uploadPic(img, extInfo, fail) {
    var businessType // 业务类型，1-发群图片，2-向好友发图片
    // if (selType === SessionType.C2C) { // 向好友发图片
    //     businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG
    // } else if (selType === SessionType.GROUP) { // 发群图片
    //     businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG
    // }
    businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG
    // 封装上传图片请求
    var opt = {
      'file': img, // 图片对象
      // 'onProgressCallBack': onProgress || (() => {}), // 上传图片进度条回调函数
      'From_Account': extInfo.sendUserId, // 发送者帐号
      'To_Account': extInfo.toUserId, // 接收者
      'businessType': businessType// 业务类型
    }
    // 上传图片
    return new Promise((resolve) => {
      webim.uploadPic(
        opt,
        (resp) => {
          console.log('上传成功发送图片')
          resolve(resp)
        },
        () => {
          console.log('上传失败')
          fail && fail()
        }
      )
    })
  }

  // 发送图片
  function sendPic(images, msgInfo) {
      if (!msgInfo.sendUserId) {
        console.error('您还没有登录！！')
        return
      }
      var data = msgInfo.data || ''
      var desc = msgInfo.desc || ''
      var ext = msgInfo.ext || ''
      var selSess = new webim.Session(webim.SESSION_TYPE.C2C, msgInfo.toUserId, msgInfo.toUserId, null, Math.round(new Date().getTime() / 1000))
      var isSend = true // 是否为自己发送
      var seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
      var random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
      var msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
      var subType = webim.GROUP_MSG_SUB_TYPE.COMMON
      var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, msgInfo.sendUserId, subType, null)
      var imagesObj = new webim.Msg.Elem.Images(images.File_UUID)
      for (var i in images.URL_INFO) {
          var img = images.URL_INFO[i]
          var newImg
          var type
          switch (img.PIC_TYPE) {
              case 1: // 原图
                  type = 1 // 原图
                  break
              case 2:// 小图（缩略图）
                  type = 3 // 小图
                  break
              case 4:// 大图
                  type = 2 // 大图
                  break
          }
          newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl)
          imagesObj.addImage(newImg)
      }
      msg.addImage(imagesObj)

      var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext)
      msg.addCustom(custom_obj)

      // 调用发送图片接口
      return new Promise((resolve) => {
        webim.sendMsg(msg, function(resp) {
            console.log('发送图片成功')
            resolve()
        }, function(err) {
            alert(err.ErrorInfo)
        })
      })
  }

  /* ********************************* 腾讯请求漫游消息接口 ********************************* */
  function getIMRoamMsgs(id, time, pageSize) {
    const option = {
      'Peer_Account': id,
      'MaxCnt': pageSize,
      'LastMsgTime': Math.round(new Date(time.replace(/-/g, '/')).getTime() / 1000),
      'MsgKey': ''
    }
    return new Promise((resolve) => {
      webim.getC2CHistoryMsgs(option, (resp) => {
        resolve(resp)
      })
    })
  }

  /* ********************************* 推送系统消息接口 ********************************* */
  async function sendSystemMsg(systemMsg) {
    const res = await pushSystemMsg(systemMsg)
    if (res.result.code === ERR_OK) {
      console.log('排队完成，推送系统消息成功')
    } else {
      console.log('推送系统消息失败')
    }
  }

  return {
    login,
    logout,
    sendNoticeMsg,
    sendNormalMsg,
    formatImgMsgOption,
    createGroup,
    joinGroup,
    quitGroup,
    parseMsgs,
    parseMsg,
    parseMsgInSystem,
    uploadPic,
    sendPic,
    getIMRoamMsgs,
    sendSystemMsg
  }
})()

export default IM
