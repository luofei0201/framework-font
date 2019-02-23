/*
* @Author: Primavera
* @Date:   2018-10-29 15:30:00
 * @Last Modified by: Primavera
 * @Last Modified time: 2018-10-29 15:30:00
*/
import { sessionStatus, msgStatus, msgTypes, tipTypes } from '@/common/js/status'
import Tools from '@/common/js/tools'
// import { formatDate, isTimeDiffLongEnough } from '@/common/js/dateConfig.js'

/**
 * [MsgsLoader MsgsLoader]
 */
const MsgsLoader = {
  info: {},
  page: {},
  roamMsgsIterator: {},
  history: {},
  init: function(config) {
    return Creator.createMsgsLoader(config)
  },
  getMsgs: async function() {
    if (this.noMoreMsgs()) {
      // 当前已无消息
      return
    }
    let list = []
    console.info('this.page.curPage :' + this.page.curPage)
    console.info('this.page.curTime :' + this.page.curTime)
    console.info('this.page.pageSize :' + this.page.pageSize)
    if (this.roamMsgsIterator.hasNext()) {
      // 拉取漫游消息
      const curSession = this.roamMsgsIterator.list[this.roamMsgsIterator.index]
      list = await curSession.getRoamMsgs(this.info.id, this.page)
      if (curSession.isCurSessionReachFinalPage(this.page)) {
        // 消息为当前会话最后一页，更新当前会话、分页
        this.roamMsgsIterator.next()
        this.page.resetPage()
        list.length && this.page.updateCurTime(list[0].time)
      } else {
        this.page.updateCurPage()
        list.length && this.page.updateCurTime(list[0].time)
      }
    } else {
      // 拉取历史消息
      list = await this.history.getHistoryMsgs(this.info.id, this.page)
      if (list.length) {
        this.page.updateCurPage()
        list.length && this.page.updateCurTime(list[0].time)
      }
    }
    return list
  },
  noMoreMsgs: function() {
    return !this.roamMsgsIterator.hasNext() && this.history.isHistoryOver
  },
  timeTipsFormat: function(list) {
    let timeCache = list[0].time
    let map = []
    list.length && list.forEach((item, i) => {
      item.timestamp = new Date(item.time.replace(/-/g, '/')).getTime()
      if (Tools.DateTools.isTimeDiffLongEnough(timeCache, item.time) || i === 0) {
        map.push({
          content: item.time,
          time: item.time,
          msgStatus: msgStatus.tip,
          msgType: tipTypes.tip_time
        })
        timeCache = item.time
      }
      map.push(item)
    })
    return map
  }
}

export default MsgsLoader

/**
 * [Session 会话]
 */
const Session = {
  sessionId: '',
  csId: '',
  chatType: '',
  chatCount: 0,
  isCurSessionReachFinalPage: function(page) {
    // 当前会话已经拉取到最后一页
    return this.chatCount - page.curPage * page.pageSize <= 0
  },
  getRoamMsgs: async function(id, Pagination) {
    let res = []
    let map = []
    switch (this.chatType) {
      case sessionStatus.robot:
        // 机器人
        res = await this.getBotAPI(id, this.sessionId, Pagination.curPage, Pagination.pageSize)
        if (res.length) {
          res.forEach(item => {
            map.unshift(Creator.createMessage(id, item))
          })
        }
        break
      case sessionStatus.video:
        // 视频
        res = await this.getVideoAPI(id, this.csId, Pagination.curTime, Pagination.pageSize)
        map = Creator.IMMsgsparse(res.MsgList)
        break
      case sessionStatus.onLine:
        // 在线
        break
      case sessionStatus.website:
        // 官网
        break
    }
    // 过滤最后一页条数
    const LeftCount = this.chatCount - (Pagination.curPage - 1) * Pagination.pageSize
    if (LeftCount <= Pagination.pageSize) {
      return map.slice(map.length - LeftCount)
    } else {
      return map
    }
  },
  getBotAPI: async function() {},
  getVideoAPI: async function() {}
}

/**
 * [Iterator 迭代器]
 */
const Iterator = {
  list: [],
  index: 0,
  next: function() {
    const done = !this.hasNext()
    const value = this.hasNext() ? this.list[this.index++] : undefined
    return { value, done }
  },
  hasNext: function() {
    return this.index < this.list.length
  }
}

/**
 * [SessionList 会话队列]
 */
const SessionList = {
  sesslist: [],
  getIterator: function() {
    let iterator = Object.create(Iterator)
    iterator.list = this.sesslist
    return iterator
  }
}

/**
 * [Pagination 分页]
 */
const Pagination = {
  curPage: 1,
  curTime: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
  pageSize: 5,
  resetPage: function() {
    this.curPage = 1
  },
  updateCurPage: function() {
    // 更新分页
    this.curPage += 1
  },
  updateCurTime: function(newTime) {
    // 更新时间
    this.curTime = newTime
  }
}

/**
 * [History 历史消息]
 */
const History = {
  isHistoryOver: false,
  getHistoryMsgsAPI: async function() {},
  getHistoryMsgs: async function(id, page) {
    let list = await this.getHistoryMsgsAPI(id, page)
    let map = []
    if (list.length) {
      list.forEach(item => {
        if (!item.chatType) {
          item.chatType = '2'
        }
        item.msgContent = JSON.parse(item.msgContent)[0].MsgContent
        map.unshift(Creator.createMessage(id, item))
      })
    } else {
      this.isHistoryOver = true
    }
    return map
  }
}

/**
 * [Creator 工厂]
 */
const Creator = {
  createMessage: function(id, msgObj) {
    let options = {}
    if (msgObj.chatType === sessionStatus.robot) {
      // 机器人
      const isSelfSend = msgObj.sendUserId === id
      if (isSelfSend) {
        // 我发送的机器人的
        options = {
          nickName: msgObj.sendUserName,
          content: msgObj.msgContent,
          isSelfSend: true,
          time: msgObj.msgTime,
          msgStatus: msgStatus.msg,
          msgType: msgTypes.msg_normal
        }
      } else {
        // 机器人发给我的
        const data = JSON.parse(msgObj.msgContent).data
        data.botName = msgObj.sendUserName
        data.time = msgObj.msgTime
        options = Tools.MsgsFilterTools.botAnswerfilter(data)
      }
    } else if (msgObj.chatType === sessionStatus.video) {
      // IM
      const obj = msgObj.msgContent
      options = {
        nickName: obj.Desc.nickName,
        content: obj.Data,
        isSelfSend: obj.Desc.sendUserId === id,
        time: obj.Desc.time,
        msgStatus: obj.Desc.msgStatus,
        msgType: obj.Desc.msgType
      }
      // 添加图片
      if (options.msgType === msgTypes.msg_img) {
        options.imgData = obj.Ext.imgData
      }
      // 添加名片
      if (options.msgType === msgTypes.msg_card) {
        options.proxyInfo = obj.Ext.proxyInfo
      }
    }
    return options
  },
  IMMsgsparse: function(newMsgList) {
    var textMsgs = []
    for (var i in newMsgList) { // 遍历新消息
      var msg = this.parseMsg(newMsgList[i])
      textMsgs.push(msg)
    }
    return textMsgs
  },
  parseMsg: function(newMsg) {
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
      isSystem: newMsg.getFromAccount() === '@TIM#SYSTEM' || false,
      msgType,
      msgStatus,
      chatType,
      time
    }
  },
  createSession: function(sessionObj, getBotAPI, getVideoAPI) {
    let session = Object.create(Session)
    session.sessionId = sessionObj.sessionId
    session.csId = sessionObj.csId
    session.chatType = sessionObj.chatType
    session.chatCount = sessionObj.chatCount
    session.getBotAPI = getBotAPI
    session.getVideoAPI = getVideoAPI
    return session
  },
  createSessionList: function(sessions) {
    let sessionList = Object.create(SessionList)
    sessionList.sesslist = sessions || []
    return sessionList
  },
  createPagination: function(pageSize) {
    let pagination = Object.create(Pagination)
    pagination.pageSize = pageSize
    return pagination
  },
  createHistory: function(getHistoryMsgsAPI) {
    let history = Object.create(History)
    history.getHistoryMsgsAPI = getHistoryMsgsAPI
    return history
  },
  createMsgsLoader: function({ info, pageSize, sessions, getHistoryMsgsAPI, getBotAPI, getVideoAPI }) {
    let msgsLoader = Object.create(MsgsLoader)
    msgsLoader.info = info
    msgsLoader.page = this.createPagination(pageSize)
    // 初始化
    let sessionsTemp = []
    sessions.forEach(item => {
      if (item.chatCount) {
        sessionsTemp.push(this.createSession(item, getBotAPI, getVideoAPI))
      }
    })
    let sessionList = this.createSessionList(sessionsTemp)
    msgsLoader.roamMsgsIterator = sessionList.getIterator()
    msgsLoader.history = this.createHistory(getHistoryMsgsAPI)
    return msgsLoader
  }
}
