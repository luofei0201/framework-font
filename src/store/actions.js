import * as types from './mutation-types'
import Tools from '@/common/js/tools'
import IM from '@/server/im'
import { TIME_3_MIN, TIME_5_MIN, MSG_PAGE_SIZE, sessionStatus, toggleBarStatus, roomStatus, queueStatus, msgStatus, msgTypes, dialogTypes, tipTypes, systemMsgStatus, themeMap } from '@/common/js/status'
import { ERR_OK, createSession, getCsAvatar, transTimeoutRedistribution, getSessionDetail, getSystemConfig } from '@/server/index.js'

// 系统配置附属函数
const config_cb = {
  // 本地身份开启标识
  'localCapacityFlag': {
    get: function() {
      return this.value
    }
  },
  // 排队人数上限
  'queueLimit': {
    get: function() {
      return this.value
    }
  },
  // 缓存过期时间（24小时制）
  'cacheExpireTime': {
    compare: function(cacheT) {
      const now = new Date()
      const cache = new Date(cacheT)
      // 缓存时间为当天，且当前时间小于系统配置缓存过期时刻
      return (cache.getDate() === now.getDate()) && (now.getHours() < +this.value)
    }
  },
  // 会话超时时间（分钟）
  'sessionTimeOut': {
    compare: function(cacheT) {
      const now = new Date()
      const cache = new Date(cacheT)
      // 缓存时间为当天，且缓存时间与当前时间差小于系统配置缓存过期时间
      return (cache.getDate() === now.getDate()) && ((now.getTime() - cacheT) < Tools.DateTools.minutes2Timestamp(this.value))
    }
  },
  // 转接超时时间
  'connectTimeOut': {
    get: function() {
      return this.value
    }
  },
  // 图片压缩下限
  'compressLimit': {
    get: function() {
      return this.value
    }
  },
  // 主题
  'theme': {
    getTheme: function() {
      const themeKey = Object.keys(this.value).filter(key => this.value[key] == 1)[0] // eslint-disable-line
      return themeMap[themeKey]
    }
  }
}

async function systemConfigAPI() {
  const res = await getSystemConfig()
  if (res.result.code === ERR_OK) {
    let data = res.data
    // 初始化合并系统配置信息
    return Tools.merge(data, config_cb)
  } else {
    console.log('error in getSystemConfig: ', res.result.message)
  }
}

// 系统配置
export const systemConfig = (function() {
  let config = null

  return async function getConfig({ commit }, key) {
    if (!config) {
      config = await systemConfigAPI()
    }
    return config[key]
  }
})()

// 键盘弹出延迟（弃用）
export const closeBarBuffer = async function({ commit }, { mutationType, delay }) {
  commit(mutationType, false)
  await Tools.AsyncTools.sleep(delay)
}

// 修改键盘和拓展层的弹出状态，统一接口
export const toggleBar = function({ commit, state }, type) {
  switch (type) {
    case toggleBarStatus.allFold:
      commit(types.SET_EXTEND_BAR, false)
      commit(types.SET_INPUT_BAR, false)
      break
    case toggleBarStatus.inputBar:
      state.extendBarOpen && commit(types.SET_EXTEND_BAR, false)
      commit(types.SET_INPUT_BAR, true)
      break
    case toggleBarStatus.extendBar:
      state.inputBarOpen && commit(types.SET_INPUT_BAR, false)
      commit(types.SET_EXTEND_BAR, true)
      break
  }
}

// 进入排队(人工，视频)时的tips
export const beforeQueue = function({ commit, state }, { mode, content }) {
  commit(types.SET_QUEUE_MODE, {
    mode,
    status: queueStatus.queuing
  })
  const tip = {
    content,
    time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    msgStatus: msgStatus.tip,
    msgType: tipTypes.tip_normal
  }
  sendMsgs({ commit, state }, [tip])
}

// 人工（视频）排队完成，接通客服后，修改对应的房间模式
export const afterQueueSuccess = async function({ commit, state }, { mode, msgsObj }) {
  if (mode === roomStatus.videoChat) {
    // 房间状态
    commit(types.SET_ROOM_MODE, roomStatus.videoChat)
    const tip = {
      content: `视频客服${state.csInfo.csNick}转接成功，祝您沟通愉快！`,
      time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      msgStatus: msgStatus.tip,
      msgType: tipTypes.tip_success
    }
    sendMsgs({ commit, state }, [tip])
    // 排队状态
    commit(types.SET_QUEUE_MODE, {
      mode,
      status: queueStatus.queueSuccess
    })
    await Tools.AsyncTools.sleep(3500)
    commit(types.SET_QUEUE_MODE, {
      mode,
      status: queueStatus.queueOver
    })
  } else if (mode === roomStatus.menChat) {
    commit(types.SET_QUEUE_MODE, {
      mode,
      status: queueStatus.queueOver
    })
    // 清空转接定时器
    state.userInfo.transTimeout && clearTimeout(state.userInfo.transTimeout)
    // 设置坐席信息
    const csInfo_onLine = Tools.CopyTools.objDeepClone(state.csInfo)
    csInfo_onLine.csId = msgsObj.csId
    csInfo_onLine.csAvatar = getCsAvatar(msgsObj.csId)
    csInfo_onLine.csName = msgsObj.csName
    csInfo_onLine.csNick = msgsObj.csNick
    commit(types.SET_CS_INFO, csInfo_onLine)
    // action 删除msgs中排队状态的tips
    deleteTipMsg({ commit, state })
    // 设置会话ID
    commit(types.SET_SESSION_ID, msgsObj.sessionId)
    // 房间状态
    commit(types.SET_ROOM_MODE, roomStatus.menChat)
    // 提示语
    const tip = {
      content: `人工客服${state.csInfo.csNick}转接成功，祝您沟通愉快！`,
      time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      msgStatus: msgStatus.tip,
      msgType: tipTypes.tip_success
    }
    // 发送欢迎语
    const msg = {
      nickName: state.csInfo.csNick,
      avatar: state.csInfo.csId,
      content: state.csInfo.welcomeText,
      isSelfSend: false,
      time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      timestamp: new Date().getTime(),
      msgStatus: msgStatus.msg,
      msgType: msgTypes.msg_normal,
      chatType: sessionStatus.onLine
    }
    sendMsgs({ commit, state }, [tip, msg])
    saveCurMsgs({ commit, state }, { origin: state.userInfo.origin, msg })
    // action 初始化用户最后响应时间
    // updateLastAction({ commit, state })
    // 存本地localstorage
    const data = {
      csInfo: csInfo_onLine,
      sessionId: state.sessionId,
      chatGuid: state.chatGuid,
      roomMode: roomStatus.menChat
    }
    Tools.CacheTools.setCacheData({ key: `${state.userInfo.origin}_curServInfo`, check: state.userInfo.userId, data })
  }
}

// 排队失败
export const afterQueueFailed = function({ commit, state }, { sendFailed }) {
  sendFailed && transTimeoutRedistribution({
    userId: `${state.userInfo.userId}`,
    origin: state.userInfo.origin || 'WE',
    callType: 'ZX',
    sessionId: `${state.chatGuid}`,
    chatResult: '02',
    desc: '坐席转接超时，客户端请求转接其他客服',
    againAllot: false
  })
  commit(types.SET_QUEUE_MODE, {
    mode: roomStatus.AIChat,
    status: queueStatus.noneQueue
  })
  commit(types.SET_QUEUE_NUM, 0)
  const tip = {
    content: '转接失败',
    time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    msgStatus: msgStatus.tip,
    msgType: tipTypes.tip_fail
  }
  sendMsgs({ commit, state }, [tip])
}

// 配置排队成功后给坐席推送接入信息
export const configSendSystemMsg = function({ state }, msgsObj) {
  return {
    userId: msgsObj.csId,
    msgBody: {
      data: {
        code: msgsObj.code,
        chatGuid: state.chatGuid,
        csId: msgsObj.csId,
        csName: msgsObj.csName || msgsObj.csNick,
        csNick: msgsObj.csNick || '',
        userId: state.userInfo.userId,
        userAvatar: state.userInfo.avatar,
        userName: state.userInfo.nickName || state.userInfo.userName,
        userNick: state.userInfo.nickName || state.userInfo.userName,
        userPhone: state.userInfo.userPhone,
        openId: state.userInfo.userId,
        origin: state.userInfo.origin || 'WE',
        robotSessionId: state.sessionRamId,
        accessId: msgsObj.accessId || '',
        queueStartTime: msgsObj.queueStartTime,
        queueEndTime: msgsObj.queueEndTime
      },
      desc: '',
      ext: ''
    }
  }
}

// 人工客服排队完成后，删除消息队列里的排队状态tips
export const deleteTipMsg = function({ commit, state }) {
  for (let i = state.msgs.length - 1; i >= 0; i--) {
    if (state.msgs[i].msgStatus === msgStatus.tip && state.msgs[i].msgType === tipTypes.tip_line_up) {
      commit(types.SET_MSGS, state.msgs.slice(0, i).concat(state.msgs.slice(i + 1, state.msgs.length)))
      break
    }
  }
}

// 人工（视频）服务结束后，更新 vuex 数据
export const afterServerFinish = function({ commit, state }, mode) {
  commit(types.SET_CS_INFO, {})
  commit(types.SET_QUEUE_NUM, 0)
  commit(types.SET_SESSION_ID, '')
  commit(types.SET_QUEUE_MODE, {
    mode: roomStatus.AIChat,
    status: queueStatus.noneQueue
  })
  commit(types.SET_ASSESS_STATUS, false)
  commit(types.SET_ROOM_MODE, roomStatus.AIChat)
  // initSession({ commit, state })
  const tip = {
    content: '本次服务已结束，如需继续咨询，请重新联系客服',
    time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    msgStatus: msgStatus.tip,
    msgType: tipTypes.tip_normal
  }
  sendMsgs({ commit, state }, [tip])
  if (mode === sessionStatus.video) {
    commit(types.SET_SERVER_TIME, '')
    commit(types.SET_ROOM_ID, '')
    commit(types.SET_VIDEO_FILTER, false)
  } else
  if (mode === sessionStatus.onLine) {
    // 清空定时器
    state.userInfo.actionTimeout && state.userInfo.actionTimeout.length && state.userInfo.actionTimeout.forEach(item => {
      clearTimeout(item)
    })
    const userInfo = Tools.CopyTools.objShallowClone(state.userInfo)
    userInfo.actionTimeout = []
    commit(types.SET_USER_INFO, userInfo)
    // 清空本地localstorage
    Tools.CacheTools.removeCacheData('curServInfo')
  }
}

// 创建会话
export const initSession = async function({ commit, state }) {
  // 创建机器人会话
  const res = await createSession(state.userInfo.userId, state.userInfo.userName, state.userInfo.userPhone, sessionStatus.robot, state.sessionRamId)
  if (res.result.code === ERR_OK) {
    console.log('============================= 会话创建成功 辣 =============================')
    commit(types.SET_SESSION_ID, res.data.id)
    return 0
  } else {
    console.log('============================= 会话创建失败 辣 =============================')
  }
}

// 排队成功转接超时时，调用转接另一坐席接口
export const reqTransAnotherTimeout = function({ commit, state }, delay) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(async() => {
      // 转接至另外坐席
      const res = await transTimeoutRedistribution({
        userId: `${state.userInfo.userId}`,
        origin: state.userInfo.origin || 'WE',
        callType: 'ZX',
        sessionId: `${state.chatGuid}`,
        chatResult: '02',
        desc: '坐席转接超时，客户端请求转接其他客服',
        againAllot: true
      })
      if ((res.result.code === ERR_OK) && (res.data.status.result_code === '200')) {
        // 发送排队成功的消息给坐席
        const data = res.data.status.data
        const onlineQueueSuccMsg = {
          code: systemMsgStatus.ONLINE_REQUEST_CS_ENTANCE,
          csId: data.userCode,
          csName: data.userName || '',
          csNick: data.userNick || '',
          startTime: data.queueStartTime,
          endTime: data.queueEndTime
        }
        const onlineConfig = await configSendSystemMsg({ state }, onlineQueueSuccMsg)
        await IM.sendSystemMsg(onlineConfig)
        resolve()
      }
      else if (res.data.status.result_code === '480') {
        // 坐席接收到客户的接入请求并且已经成功回推，但客户端没有接收到
        const info = await getSessionDetail(state.sessionRamId, state.userInfo.userId)
        if ((info.result.code === ERR_OK) && info.data.sessionId) {
          const data = info.data
          const msgsObj = {
            sessionId: data.sessionId,
            csId: data.csId,
            csName: data.csName,
            csNick: data.nickName
          }
          afterQueueSuccess({ commit, state }, {
            mode: roomStatus.menChat,
            msgsObj
          })
          resolve('480')
        } else {
          const err = '查询转接会话详情为空'
          reject(err)
        }
      }
      else {
        const err = 'error in transTimeoutRedistribution 转接至另外坐席'
        reject(err)
      }
      // 清空定时器
      timer && clearTimeout(timer)
    }, delay)
    const userInfo = Tools.CopyTools.objShallowClone(state.userInfo)
    userInfo.transTimeout = timer
    commit(types.SET_USER_INFO, userInfo)
  })
}

// 排队成功定时器，一定时间内坐席没转接则提示转接失败
export const reqTransTimeout = function({ commit, state }, { msg, toast, delay = 0 }) {
  state.userInfo.transTimeout && clearTimeout(state.userInfo.transTimeout)
  return new Promise((resolve) => {
    const timer = setTimeout(async() => {
      // 坐席长时间未转接，推送消息到坐席转接失败
      if (msg) {
        const onlineConfig = await configSendSystemMsg({ state }, msg)
        IM.sendSystemMsg(onlineConfig)
      }
      // 本地提示转接失败
      if (toast) {
        toast.text('转接失败，请重试', 'default')
        await Tools.AsyncTools.sleep(2000)
        // toast.hide()
      }
      // 回调
      resolve()
      // 清空定时器
      timer && clearTimeout(timer)
    }, delay)
    const userInfo = Tools.CopyTools.objShallowClone(state.userInfo)
    userInfo.transTimeout = timer
    commit(types.SET_USER_INFO, userInfo)
  })
}

// 更新用户最后活动时间（更新定时器）
export const updateLastAction = function({ commit, state }) {
  // 清空原来的定时器
  state.userInfo.actionTimeout && state.userInfo.actionTimeout.length && state.userInfo.actionTimeout.forEach(item => {
    clearTimeout(item)
  })
  // 当前不是人工服务中，直接返回
  if (state.roomMode !== roomStatus.menChat) {
    return
  }

  // 创建定时器（三分钟），绑定在 vuex 的 userInfo
  const actionTimeout3 = setTimeout(async() => {
    // 推送超时断开连接提示，至本地消息队列
    const now = new Date()
    const msg = {
      nickName: state.csInfo.csNick,
      avatar: state.csInfo.csId,
      content: `尊敬的客户，${state.csInfo.csNick}还没有收到您的回复哦，本次会话将在两分钟后自动中断。`,
      isSelfSend: false,
      time: Tools.DateTools.formatDate(now, 'yyyy-MM-dd hh:mm:ss'),
      timestamp: now.getTime(),
      msgStatus: msgStatus.msg,
      msgType: msgTypes.msg_normal,
      chatType: sessionStatus.onLine
    }
    sendMsgs({ commit, state }, [msg])
  }, TIME_3_MIN)

  // 创建定时器（五分钟），绑定在 vuex 的 userInfo
  const actionTimeout5 = setTimeout(async() => {
    // 用户长时间无响应，主动断开连接
    const sysMsgs = {
      code: systemMsgStatus.ONLINE_USER_ACTION_ENDING_SESSION,
      csId: state.csInfo.csId
    }
    const onlineConfig = await configSendSystemMsg({ state }, sysMsgs)
    IM.sendSystemMsg(onlineConfig)

    // 推送超时断开连接提示，至本地消息队列
    const dialog = {
      time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      msgStatus: msgStatus.dialog,
      msgType: dialogTypes.dialog_disconnect,
      dialogInfo: {
        disconnectTime: 5
      }
    }
    sendMsgs({ commit, state }, [dialog])
    // 清空本地localstorage
    Tools.CacheTools.removeCacheData(`${state.userInfo.origin}_curServInfo`)
  }, TIME_5_MIN)

  const userInfo = Tools.CopyTools.objShallowClone(state.userInfo)
  userInfo.actionTimeout = [actionTimeout3, actionTimeout5]
  commit(types.SET_USER_INFO, userInfo)
}

// 存当前缓存池消息
export const saveCurMsgs = function({ state }, { origin, msg }) {
  const temp = Tools.CacheTools.getCacheData({ key: `${origin}_cur_msgs`, check: origin }) || []
  Tools.CacheTools.setCacheData({ key: `${origin}_cur_msgs`, check: origin, data: temp.concat(msg) })
}

// 存历史消息（初始化）
export const saveRoamMsgs = function({ state }, origin) {
  // 缓存池消息
  const curTemp = Tools.CacheTools.getCacheData({ key: `${origin}_cur_msgs`, check: origin }) || []
  // 当前缓存池没有上一次聊天的记录，直接退出
  if (!curTemp.length) return
  // 漫游消息分页列表
  const roamTemp = Tools.CacheTools.getCacheData({ key: `${origin}_roam_msgs`, check: origin }) || []

  // 还原分页
  const list = Tools.reduce((val, item) => val.concat(item.pageList), [])(roamTemp)

  // 合并
  const roam = list.concat(curTemp)

  // 分页方式（map的回调）
  const getPage = Tools.paging((item, i, arr) => {
    return {
      page: arr.length - i,
      pageList: roam.slice(i * MSG_PAGE_SIZE, (i + 1) * MSG_PAGE_SIZE)
    }
  }, MSG_PAGE_SIZE)
  const roamList = getPage(roam)
  // 存贮
  Tools.CacheTools.setCacheData({ key: `${origin}_roam_msgs`, check: origin, data: roamList })
  // 清空缓存池消息
  Tools.CacheTools.removeCacheData(`${origin}_cur_msgs`)
  return 0
}

// 取历史消息（分页）
export const getRoamMsgs = function({ state }, { origin, page }) {
  const list = Tools.CacheTools.getCacheData({ key: `${origin}_roam_msgs`, check: origin })
  return list && list.length && list.length >= page ? list[list.length - page].pageList : []
}

// 客服暂离，设置视频模糊
export const setVideoBlur = function({ commit }, fullState) {
  commit(types.SET_VIDEO_FILTER, {
    blur: fullState,
    muted: fullState
  })
}

// 客服静音
export const setVideoMuted = function({ commit, state }, isMuted) {
  commit(types.SET_VIDEO_FILTER, {
    blur: state.videoFilter.blur,
    muted: isMuted
  })
}

// 添加相册图片
export const addPreviewImg = function({ state }, { list, msgsObj }) {
  const data = msgsObj.imgData
  list.push({
    src: data.big,
    msrc: data.small,
    w: data.w,
    h: data.h,
    id: msgsObj.timestamp
  })
  return list
}

// 更新本地消息队列
export const sendMsgs = async function({ commit, state }, msg) {
  const msgT = msg[0].timestamp
  if (Tools.DateTools.isSendTipMsgTime(msgT)) {
    const time = Tools.DateTools.formatDate(new Date(msgT), 'yyyy-MM-dd hh:mm:ss')
    const tip = {
      content: time,
      time,
      msgStatus: msgStatus.tip,
      msgType: tipTypes.tip_time
    }
    commit(types.SET_MSGS, state.msgs.concat(tip))
  }
  // const selfMsg = msg.filter((item) => item.isSelfSend)
  // if ((state.roomMode === roomStatus.menChat) && selfMsg.length) {
  //   // 更新用户最后活动时间（更新定时器）
  //   updateLastAction({ commit, state })
  // }
  commit(types.SET_MSGS, state.msgs.concat(msg))
  return 0
}
