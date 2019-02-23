import http from './request'

// 错误状态码
export const ERR_OK = '0'
export const ERR_FAIL = '-1'

// 获取微信签名
// export const wxConfig = url => http.get('video', `/wxConfig?url=${url}`)

export const getSystemConfig = () => http.get('user', '/video/sys/config')

/**
 ************************************ uat ************************************
*/
/**
 ************************************ RTCRoom ************************************
 */

/**
 * [videoQueue 客户端视频排队]
 */
export const videoQueue = (userId, userName, csId, csName, nickName, toCsFlag, origin, priority, robotSessionId) => http.post('RTCRoom', '/video/user/queue', { userId, userName, csId, csName, nickName, toCsFlag, origin, priority, robotSessionId })
// export const videoQueue = date => http.post('RTCRoom', '/video/user/queue', date)

/**
 * [videoQueueCancel 客户端视频取消排队]
 */
export const videoQueueCancel = (userId, csId, assessId, accessFlag) => http.post('RTCRoom', '/video/user/queue/cancel', { userId, csId, assessId, accessFlag })

/**
 * [videoQueueHeartBeat 客户端排队心跳]
 */
export const videoQueueHeartBeat = (roomId, userId) => http.post('RTCRoom', '/comm/room/heartbeat', { roomId, userId, beatType: 0 })

/**
 * [getCsStatus 获取当前客服状态]
 */
export const getCsStatus = csId => http.get('RTCRoom', `/video/room/status?csId=${csId}`)

/**
 * [videoQueueHeartBeat 客户端排队心跳]
 */
export const enterVideoRTCRoom = (roomId, userId, openId, sessionId, clientType) => http.post('RTCRoom', '/comm/room/enter', { roomId, userId, openId, sessionId, clientType })

/**
 ************************************ video ************************************
 */

/**
 * [getImgUrl 获取照片流请求统一路径]
 */
export const getImgUrl = imgUrl => http.url('user', `/video/image/get?imgUrl=${imgUrl}`)

// 获取客服生活照
export const csPhoto = id => http.url('user', `/video/image/csPhoto?id=${id}`)

/**
 * [getUserInfoByOpenID 获取用户基本信息]
 */
export const getUserInfoByOpenID = openID => http.get('user', `/video/user?openId=${openID}`)

// 评价信息保存
export const saveAssess = async(data) => http.post('user', `/video/user/evaluate`, data)

// 获取客服列表
export const queryCsInfo = async(page, pageSize, userId, listType) => http.get('user', `/video/user/cs/query?page=${page}&pageSize=${pageSize}&userId=${userId}&listType=${listType}`)

// 获取坐席头像
export const getCsAvatar = csId => http.url('user', `/video/image/csHeader?id=${csId}`)

// 专属客服添加
export const addCs = async(data) => http.post('user', `/video/user/cs/create`, data)

// 专属客服删除
export const removeCs = async(data) => http.post('user', `/video/user/cs/delete`, data)

// 客服信息获取（获取客服的个人资料）
export const getCsInfo = async(csId) => http.get('user', `/video/user/cs?csId=${csId}`)

// 查询‘为我服务次数’
export const getTimesForMe = async(csId, userId) => http.get('user', `/video/cs/service?csId=${csId}&userId=${userId}`)

// 礼物查询信息(同标签查询)
export const viewGifts = async(page, pageSize, csId) => http.get('user', `/video/user/gifts?page=${page}&pageSize=${pageSize}&csId=${csId}`)

// 标签信息查询(传csId查询到评价当前客服的标签，csId=‘’查询到所有的标签）
export const viewLabels = async(page, pageSize, csId) => http.get('user', `/video/user/labels?page=${page}&pageSize=${pageSize}&csId=${csId}`)

// 分页查询礼物记录
export const giftsRecording = async(page, pageSize, csId) => http.get('user', `/video/user/cs/gifts?page=${page}&pageSize=${pageSize}&csId=${csId}`)

// 用户向坐席发送礼物 TO DO
export const giftSend = giftInfo => http.post('user', '/video/cs/user/gift', giftInfo)

/**
 * [getUserInfoByOpenID 获取用户基本信息]
 */
export const getShareTicket = url => http.post('user', `/ticket/query`, { url })

/**
 ************************************ chat ************************************
 */

/**
 * [getSessionList 获取会话列表]
 */
export const getRedirectUrl = () => http.get('user', '/video/user/openId')

/**
 * [createSession 创建会话]
 */
export const createSession = (userId, userName, userPhone, chatType, robotSessionId) => http.post('user', `/chat/session/create`, { userId, userName, userPhone, chatType, robotSessionId })

/**
 * [getSessionStatus 获取会话状态]
 */
export const getSessionStatus = sessionId => http.get('user', `/video/session/query?sessionId=${sessionId}`)

/**
 * [getSessionList 获取会话列表]
 */
export const getSessionList = userId => http.get('user', `/user/session?userId=${userId}`)

/**
 * [getBotInfo 获取机器人基本信息]
 */
export const getBotInfo = () => http.get('user', `/robot/query`)

/**
 * [sendMsgToBot 发送消息给机器人]
 */
export const sendMsgToBot = (question, sessionId, userId, userName, origin) => http.post('user', `/robot/question/send`, {question, sessionId, userId, userName, origin})

/**
 * [getBotRoamMsgs 拉取机器人漫游消息]
 */
export const getBotRoamMsgs = (sessionId, page, pageSize) => http.get('user', `/chat/robot?page=${page}&pageSize=${pageSize}&sessionId=${sessionId}`)

/**
 * [requestHistoryMsgs 拉取历史消息]
 */
export const requestHistoryMsgs = (userId, page, pageSize) => http.get('user', `/chat/history?page=${page}&pageSize=${pageSize}&userId=${userId}`)
// export const requestHistoryMsgs = (userId) => http.get('chat', `/chat/history?userId=${userId}`)

// 获取iframe URL
export const getIframeUrl = url => http.url('user', `/video/frame/content?url=${url}`)

/**
 * [saveQueueTicket 转视频跳转至Safari前保存会话]
 */
export const saveQueueTicket = (csId, csName, csNick, userInfo, openId, sessionId) => http.post('user', `/user/cs/saveQueueTicket`, { csId, csName, csNick, userInfo, openId, sessionId })

/**
 * [getQueueTicket 转视频跳转至Safari后获取会话]
 */
export const getQueueTicket = openId => http.get('user', `/user/cs/getQueueTicket?openId=${openId}`)

/**
 ************************************ onLine ************************************
 */

/**
 * [onLineQueue 客户端在线排队]
 */
export const onLineQueue = data => http.post('user', '/webchat/queue/v1/queueup', data)

/**
 * [onLineQueueCancel 客户端在线取消排队]
 */
export const onLineQueueCancel = data => http.post('user', '/webchat/queue/v1/cancelqueue', data)

/**
 * [chatQueueHeartBeat 客户端排队心跳]
 */
export const chatQueueHeartBeat = data => http.post('user', '/webchat/queue/v1/heartbeat', data)

// 留言common/leaveword/v1/add
export const leaveMsg = async(data) => http.post('user', '/common/leaveword/v1/add', data)

/**
 * [transTimeoutRedistribution 转接超时，重新分配坐席]
 */
export const transTimeoutRedistribution = data => http.post('user', '/webchat/queue/chatresult', data)

/**
 * [getSessionDetail 转接超时，重新分配坐席响应480时，查询人工服务信息（会话Id，坐席信息）]
 */
export const getSessionDetail = (robotSessionId, userId) => http.get('user', `/video/session/detail?robotSessionId=${robotSessionId}&userId=${userId}`)

/**
 ************************************ systemMsg ************************************
 */

/**
 * [pushSystemMsg 推送系统消息]
 */
export const pushSystemMsg = data => http.post('TM', '/im/msg/push', data)

/**
 * [getLoginInfo 获取用户登录信息]
 */
export const getLoginInfo = (userId, userType) => http.get('TM', `/im/account/login?userId=${userId}&userType=${userType}`)

/**
 * [syncGroupC2CMsg 拉取漫游消息]
 */
export const syncGroupC2CMsg = data => http.post('TM', '/syncGroupC2CMsg', data)

/**
 * [getLoginState 获取当前客户IM登录状态]
 */
export const getLoginState = userId => http.get('TM', `/im/account/login/status?userId=${userId}`)

// 获取客服工作时间 callType的值为'ZX' or 'SP' or 空值(即查询所有工作时间)
export const getWorkTime = async(callType) => http.post('user', `/webchat/worktime/getallworktime`, callType)
