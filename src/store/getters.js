import { msgStatus, msgTypes, roomStatus, sessionStatus } from '@/common/js/status'

// 主题
export const theme = state => state.theme
// 初始化时记录的初始URL
export const sourceUrl = state => state.sourceUrl
// 用户基本信息
export const userInfo = state => state.userInfo
// 机器人基本信息
export const botInfo = state => state.botInfo
// 当前客服基本信息
export const csInfo = state => state.csInfo
// 房间Id（群Id）
export const roomId = state => state.roomId
// 会话房间ID（包括机器人，人工客服，视频客服）
export const sessionId = state => state.sessionId
// 会话房间ID（客户端）
export const sessionRamId = state => state.sessionRamId
// 会话列表
export const sessionList = state => state.sessionList
// 人工客服排队ID
export const chatGuid = state => state.chatGuid
// 聊天信息队列
export const msgs = state => state.msgs
// 视频界面的信息队列
export const videoMsgs = state => {
  return state.msgs.filter(item => {
    return item.msgStatus === msgStatus.msg && (item.msgType === msgTypes.msg_gift || item.msgType === msgTypes.msg_liked)
  })
}
// 拓展输入打开状态
export const extendBarOpen = state => state.extendBarOpen
// 软键盘打开状态
export const inputBarOpen = state => state.inputBarOpen
// videoBar全屏状态
export const fullScreen = state => state.fullScreen
// 当前会话模式（机器人，人工客服，视频客服）
export const roomMode = state => state.roomMode
// 聊天发送对象
export const sendType = state => {
  switch (state.roomMode) {
    case roomStatus.AIChat:
      return sessionStatus.robot
    case roomStatus.menChat:
      return sessionStatus.onLine
    case roomStatus.videoChat:
      return sessionStatus.video
  }
}
// 当前排队状态
export const queueMode = state => state.queueMode
// 排队人数
export const queueNum = state => state.queueNum
// 评价状态
export const hasAssess = state => state.hasAssess
// 评价开关
export const isAssessView = state => state.isAssessView
// 评价开关
export const assessTask = state => state.assessTask
// 服务时长
export const serverTime = state => state.serverTime
// 视频滤镜（客服暂离）
export const videoFilter = state => state.videoFilter
