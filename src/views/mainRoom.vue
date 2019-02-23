<template>
  <div class="main-room">
    <keep-alive :include="['chat', 'cus-serv']">
      <router-view class="router-view" id="router-view"
        @showGiftAnime="showGiftAnime"
        @requestVideoServer="requestVideoServer"
        @cancelVideoLineUp="iOSVideoFailed"
        @iOSVideoFailed="iOSVideoFailed"
        @quitRTCResponse="quitRTCResponse"
      ></router-view>
      <!-- @showIosGuide="iosGuide = true"
      @showLowVersion="lowVersion = true" -->
      <!-- @showShare="toShare"
      @showIframe="showIframe" -->
    </keep-alive>

    <!-- 主视频窗口 -->
    <videoBar class="video-bar"
      ref="videoBar"
      v-if="isVideoBarOpen"
      @showGiftAnime="showGiftAnime"
      @videoFailed="iOSVideoFailed"
    ></videoBar>

    <!-- 视频初始化倒计时 -->
    <connect-success ref="connectSuccess"></connect-success>

    <!-- 视频服务结束统计报告 -->
    <div v-transfer-dom>
      <!-- <div class="dialog-mask-section"></div> -->
      <x-dialog v-model="isVideoOverReportShow" :dialog-style="{ 'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent' }">
        <video-over-toast
          :csId="csInfo.csId"
          :csNick="csInfo.csNick"
          :time="serverTime"
          :status="servStatus"
          @goBackToChat="goBackToChat"
        ></video-over-toast>
        <!-- @showShare="showShare" -->
      </x-dialog>
    </div>
    <!-- @showShare="toShare" -->
    <!-- <share-dialog
      :show="isShareView"
      @cancelShare="isShareView = false"
      @toShare="toShare"
    ></share-dialog> -->
    <ios-guide v-if="iosGuide" @click.native="iosGuide = false"></ios-guide>
    <low-version v-if="lowVersion" @click.native="lowVersion = false"></low-version>
    <!-- <share-guide v-if="shareGuide" @click.native="shareGuide = false"></share-guide> -->

    <!-- 评价 -->
    <assess
      :showAssess="this.isAssessView"
      @handleToCancelAssess="handleToCancelAssess"
      @assessSuccess="assessSuccess"
    ></assess>
    <!-- <transition @enter="showIframeEnter" @leave="showIframeLeave">
      <section class="iframe-section" id="iframe-section" v-if="iframeView">
        <iframe-bar class="iframe-bar" :iframeSrc="iframeSrc" @closeIframe="iframeView = false"></iframe-bar>
      </section>
    </transition> -->

    <!-- 礼物动画 -->
    <transition name="fade">
      <section class="gift-section" v-if="giftAnimeView">
        <img :src="giftSrc">
      </section>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
// import wx from 'weixin-js-sdk'
import { showSafariItem } from '@/common/js/share'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { loginMixin, IMMixin, getMsgsMixin } from '@/common/js/mixin'
import { roomStatus, sessionStatus } from '@/common/js/status'
import Tools from '@/common/js/tools'
import { ERR_OK, saveQueueTicket, getQueueTicket } from '@/server/index.js'
// import anime from 'animejs'

export default {
  name: 'room',
  directives: {
    TransferDom
  },
  components: {
    'videoBar': () => import('@/views/mainRoom/videoBar'),
    'ConnectSuccess': () => import('@/views/mainRoom/components/video/connect-success'),
    'videoOverToast': () => import('@/views/mainRoom/components/video/video-over-toast'),
    // 'ShareDialog': () => import('@/views/mainRoom/components/share-dialog'),
    'IosGuide': () => import('@/views/mainRoom/components/video/ios-guide'),
    'LowVersion': () => import('@/views/mainRoom/components/video/low-version'),
    // 'ShareGuide': () => import('@/views/mainRoom/components/share-guide'),
    'Assess': () => import('@/views/mainRoom/components/assess'),
    XDialog
    // 'iframeBar': () => import('@/views/mainRoom/components/iframe-bar')
  },
  mixins: [
    loginMixin,
    IMMixin,
    getMsgsMixin
  ],
  data() {
    return {
      sessionStatus: sessionStatus,
      isVideoOverReportShow: false,
      // share
      // isShareView: false,
      // shareGuide: false,
      // 异常
      iosGuide: false,
      lowVersion: false,
      // iframe
      // iframeView: false,
      // iframeSrc: '',
      // iframePos: {
      //   clientX: 0,
      //   clientY: 0
      // },
      // gift
      giftAnimeView: false,
      giftSrc: null,
      servStatus: true
    }
  },
  computed: {
    isVideoBarOpen() {
      return this.roomMode === roomStatus.videoChat
    },
    // isVideoOverReportShow() {
    //   return this.isVideoBarOpen && this.hasAssess && this.serverTime !== ''
    //   // return true
    // },
    ...mapGetters([
      'sourceUrl',
      'roomMode',
      'isAssessView',
      'serverTime',
      'csInfo',
      'userInfo',
      'sessionId',
      'sessionRamId'
    ])
  },
  activated() {
    this.initRoom()
  },
  mounted() {
    this.$nextTick(async() => {
      document.getElementById('app').style.display = 'block'
      document.getElementById('appLoading').style.display = 'none'
    })
  },
  methods: {
    // 初始化房间
    async initRoom() {
      const query = this.$route.query

      // 初始化
      this.setAssessStatus(false)
      this.setServerTime(null)

      const enterVideoStatus = window.sessionStorage.getItem('enterVideoStatus')

      if (enterVideoStatus === 'iOS-wx' || enterVideoStatus === 'Android') { // 微信环境
        // const self = this
        this.$router.replace({path: `/room/chat?openId=${query.openId}&origin=${query.origin}`})
      }
      else if (enterVideoStatus === 'iOS-Safari') { // Safari环境
        const res = await getQueueTicket(query.openId)
        if (res.result.code === ERR_OK && res.data.queueticket) {
          this.afterEnterSafariQueue(res.data.queueticket)
          return
        }
        // 会话请求校验失效，或异常情况
        this.$vux.toast.text('当前视频咨询已经结束，请返回官微进行其他咨询')
        this.iOSVideoFailed()
      }

      // this.$router.replace({path: `/room/chat?openId=${query.openId}&origin=${query.origin}`})
    },
    // Safari进入排队前
    async afterEnterSafariQueue(data) {
      const userInfo = data.userInfo.parseJSON()
      // 存用户基本信息
      this.setUserInfo(userInfo)
      // 存会话Id (iOS端从微信跳转过来存的那份sessionId就是用的sessionRamId，这样无论是在iOS端还是Android端视频排队的时候传入的sessionId都是用的sessionRamId)
      this.setSessionRamId(data.sessionId)
      // 获取当次会话列表
      this.requestSessionList(userInfo.userId)
      // IM 初始化
      await this.initIM(userInfo)
      // 设置对应请求坐席，进入排队
      this.$router.replace({path: `/room/line-up?csId=${data.csId}&csName=${data.csName}`})
    },
    // 校验异常
    iOSVideoFailed() {
      // this.setRoomMode(roomStatus.videoChat)
      const query = this.$route.query
      this.$router.replace({path: `/room?openId=${query.openId}&origin=${query.origin}`})
      this.setAssessStatus(true)
      this.setServerTime('00:00')
      this.servStatus = false
      this.isVideoOverReportShow = true
    },
    // 响应用户的视频请求
    requestVideoServer({ csId, csName, csNick }) {
      // this.setSessionTicket({ csId, csName, csNick })
      const enterVideoStatus = window.sessionStorage.getItem('enterVideoStatus')
      switch (enterVideoStatus) {
        case 'low-version': // 版本过低
          this.lowVersion = true
          break
        case 'iOS-wx': // 当前为iOS的微信环境，需跳转至Safari，并保持当次机器人会话信息
          showSafariItem()
          this.setSessionTicket({ csId, csName, csNick })
          // this.iosGuide = true
          break
        case 'iOS-Safari': // 当前为iOS的Safari环境
          // this.$router.push({path: `/room/line-up?csId=${csId}&csName=${csName}`})
          // this.beforeQueue({
          //   mode: roomStatus.videoChat,
          //   content: `尊敬的${+this.userInfo.userGrade <= 3 ? this.userInfo.userGradeName : ''}客户，正在为您转接视频客服，请稍后。`
          // })
          this.iOSVideoFailed()
          break
        case 'Android': // 当前为Android环境，进入专属客服
          // this.iosGuide = true
          this.$router.push({path: `/room/line-up?csId=${csId}&csName=${csName}`})
          this.beforeQueue({
            mode: roomStatus.videoChat,
            content: `尊敬的${+this.userInfo.userGrade <= 3 ? this.userInfo.userGradeName : ''}客户，正在为您转接视频客服，请稍后。`
          })
          break
      }
    },
    // 请求视频后，若当前环境为iOS的微信环境，则存一次会话信息
    async setSessionTicket({ csId, csName, csNick }) {
      // !this.sessionId && await this.initSession()
      const res = await saveQueueTicket(
        csId,
        csName,
        csNick,
        this.userInfo,
        this.userInfo.openId,
        this.sessionRamId
      )
      if (res.result.code === ERR_OK) {
        // this.$vux.toast.text('已为您保存咨询信息')
        // await Tools.AsyncTools.sleep(2000)
        this.iosGuide = true
      } else {
        this.$vux.toast.text('咨询失败')
      }
    },
    quitRTCResponse() {
      this.$refs.videoBar.quitRTC()
    },
    // 评价成功
    assessSuccess(mode) {
      this.setAssessStatus(false)
      this.setAssessView(false)
      debugger
      if (mode === roomStatus.videoChat) {
        this.isVideoOverReportShow = true
      }
      // if (this.serverTime !== '' && this.roomMode === roomStatus.menChat) {
      //   // action
      //   this.afterServerFinish(sessionStatus.onLine)
      // }
    },
    // 手动关闭评价
    handleToCancelAssess() {
      // 用户主动关闭评价
      if (this.serverTime === '') {
        // 当前视频未结束
        this.setAssessView(false)
      } else {
        // 当前视频已结束
        const self = this
        debugger
        this.$vux.confirm.show({
          title: '您真的要放弃评价嘛？？',
          onConfirm() {
            self.assessSuccess(self.roomMode)
            // // 服务结束
            // self.setAssessView(false)
            // self.setAssessStatus(true)
            // // 若当前为人工客服结束，需要手动清空vuex数据
            // if (self.roomMode === roomStatus.menChat) {
            //   // action
            //   self.afterServerFinish(sessionStatus.onLine)
            //   // 分享
            //   // const csId = self.csInfo.csId
            //   // const csName = self.csInfo.csName
            //   // self.toShare(csId, csName)
            // }
          }
        })
      }
    },
    goBackToChat() {
      this.isVideoOverReportShow = false
      const query = this.$route.query
      this.$router.replace({path: `/room/chat?openId=${query.openId}&origin=${query.origin || 'WE'}`})
      this.afterServerFinish(sessionStatus.video)
    },
    // 分享
    // async toShare(csId, csName) {
    //   this.isShareView = false
    //   this.shareGuide = true
    //   this.shareUrl = `https://${window.location.host}/video/index.html`
    //   GoShare(this.shareUrl)
    //   await this.initShare()
    //   this.clickShare()
    // },
    // iframe弹出层
    // showIframe({ link, clientX, clientY }) {
    //   this.iframeView = true
    //   this.iframeSrc = Tools.MsgsFilterTools.transHttp2Https(link)
    //   // this.iframeSrc = 'http://www.baidu.com'
    //   // this.iframePos = {
    //   //   clientX,
    //   //   clientY
    //   // }
    // },
    // showIframeEnter(el, done) {
    //   const showIframeframes = anime.timeline()
    //   showIframeframes.add({
    //     targets: '#router-view',
    //     scale: [1, 0.92],
    //     duration: 200,
    //     easing: 'easeOutQuint',
    //     offset: 0
    //   }).add({
    //     targets: '#iframe-section',
    //     backdropFilter: [blur(0), blur('4px')],
    //     opacity: [0, 1],
    //     duration: 300,
    //     easing: 'easeOutQuint',
    //     offset: 0
    //   }).add({
    //     targets: '#iframe-section .iframe-bar',
    //     // translateX: [this.iframePos.clientX, 0],
    //     // translateY: [this.iframePos.clientY, 0],
    //     opacity: [0, 1],
    //     scale: [0, 1],
    //     duration: 300,
    //     easing: 'easeOutQuint',
    //     offset: 0
    //   })
    //   showIframeframes.complete = done
    // },
    // showIframeLeave(el, done) {
    //   const showIframeframes = anime.timeline()
    //   showIframeframes.add({
    //     targets: '#router-view',
    //     scale: [0.92, 1],
    //     duration: 200,
    //     easing: 'easeInOutQuad',
    //     offset: 0
    //   }).add({
    //     targets: '#iframe-section',
    //     backdropFilter: [blur('4px'), blur(0)],
    //     opacity: [1, 0],
    //     duration: 300,
    //     easing: 'easeInOutQuad',
    //     offset: 0
    //   }).add({
    //     targets: '#iframe-section .iframe-bar',
    //     // translateX: [0, this.iframePos.clientX],
    //     // translateY: [0, this.iframePos.clientX],
    //     opacity: [1, 0],
    //     scale: [1, 0],
    //     duration: 300,
    //     easing: 'easeInOutQuad',
    //     offset: 0
    //   })
    //   showIframeframes.complete = done
    // },
    // 发送礼物时的动画弹层
    async showGiftAnime(giftInfo) {
      this.showGiftView(giftInfo.giftId)
      // const duration = (+giftInfo.duration) * 1000
      await Tools.AsyncTools.sleep(4000)
      this.resetGiftView()
    },
    showGiftView(id) {
      this.giftAnimeView = true
      this.giftSrc = `/video/static/img/gift/${id}.gif`
    },
    resetGiftView() {
      this.giftAnimeView = false
      this.giftSrc = null
    },
    ...mapMutations({
      setRoomMode: 'SET_ROOM_MODE',
      setUserInfo: 'SET_USER_INFO',
      setSessionRamId: 'SET_SESSION_RAM_ID',
      setAssessStatus: 'SET_ASSESS_STATUS',
      setAssessView: 'SET_ASSESS_VIEW',
      setServerTime: 'SET_SERVER_TIME'
    }),
    ...mapActions([
      'systemConfig',
      'beforeQueue',
      'afterServerFinish',
      'initSession'
    ])
  }
}
</script>

<style lang="less">
.main-room {
  position: relative;
  width: 100%;
  height: 100%;
  .router-view {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .video-bar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 101;
  }
  .iframe-section {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.1);
    // .iframe-bar {
    //   transform: scale(0);
    //   transition: transform .3s ease;
    // }
  }
  .gift-section {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    z-index: 200;
    // background-color: rgba(0, 0, 0, 0.2);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .fade-enter-active, .fade-leave-active {
    // backdrop-filter: blur(2px);
    transition: all .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    // backdrop-filter: blur(0);
  }
}
</style>
