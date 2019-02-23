/*
* @Author: primavera <primaveraiiiiing618@gmail.com>
* @Date:   2018-07-18 14:29:00
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-18 14:29:00
*/
// import ENV from './env';
const env = process.env.NODE_ENV
const production = {
  // 生产

  // uat
  userPath: 'https://xxx.xxx.com/user-server/api/v1', // 用户服务,整合video-server,chat-server,online
  webRTCRoomPath: 'https://xxx.xxx.com/room-server/api/v1', // 房间服务
  TMPath: 'https://xxx.xxx.com/tm-server/api/v1' // 腾讯消息服务

}

const development = {
  userPath: 'http://xxx.xxx.xxx.xxx/api/v1', // 用户服务,整合video-server,chat-server,online
  webRTCRoomPath: 'http://xxx.xxx.xxx.xxx/api/v1', // 房间服务
  TMPath: 'http://xxx.xxx.xxx.xxx/api/v1' // 腾讯消息服务
 
}

const location = env === 'production' ? production : development
export default location
