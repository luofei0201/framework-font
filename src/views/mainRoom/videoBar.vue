<template>
  <div class="video-bar">
    <!-- 排队 -->
    <!-- <line-up
      class="line-up"
      v-show="isLineUpShow"
      @ready="readyToVideo"
    ></line-up> -->
    <!-- 最大化 -->
    <audio id="videoRing" loop v-show="false" src="/video/static/audio/ring.mp3" type="audio/mpeg"></audio>
    <div class="video-window" :class="remoteVideo" >
      <video height=100%
        id="remoteVideo"
        :class="{'video-blur': videoFilter.blur}"
        :muted="videoFilter.muted"
        autoplay
        playsinline
      ></video>
      <img width=40% v-show="isVideoFilter" src="/video/static/img/video/video-filter.png" class="video-watermark">
      <div class="video-mask">
        <div class="full-screen-btn" v-show="!fullScreen" @click="openVideoBar">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-quanping"></use>
          </svg>
        </div>
      </div>
      <img width=100% height=100% v-if="videoScreenShotShow" :src="videoScreenShotSrc" class="video-screen-shot">
    </div>
    <div class="video-window bgc" :class="localVideo" v-show="fullScreen && !videoScreenShotShow">
      <video height=100%
        id="localVideo"
        v-if="!videoScreenShotShow"
        muted
        autoplay
        playsinline
      ></video>
      <div class="video-mask"></div>
    </div>
    <toast v-model="isToastTextShow" :time="10000000" type="text" position="default" width="80%">{{isVideoFilter ? `视频客服${csInfo.csNick}当前暂离，请稍后` : toastText}}</toast>
    <div class="full-screen-container" v-show="fullScreen && !videoScreenShotShow">
      <div class="video-header">
        <div class="avatar" @click="stopRTC">
          <img v-lazy="this.csInfo.csAvatar">
        </div>
        <div class="name">{{this.csInfo.csNick || '--'}}</div>
      </div>
      <video-footer
        ref="videoFooter"
        :videoConnected="isVideoConnectSuccess"
        @hangUpVideo="handleHangUpVideo"
        @sendGift="giftSectionShow = true"
        @changeCamera="isChangeCamera = !isChangeCamera"
        @minimizeVideoBar="closeVideoBar"
      ></video-footer>
      <video-msg-list></video-msg-list>
      <div class="video-fload-btn">
        <div class="item">
          <div class="item-icon icon-hongxin extend-click" @click="sendLike">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="likesCountStyle"></use>
            </svg>
          </div>
          <div class="text">{{likesCount || 0}}</div>
        </div>
        <!-- <div class="item">
          <div class="item-icon icon-zhuanfa">
            <svg class="icon extend-click" aria-hidden="true">
              <use xlink:href="#icon-zhuanfa"></use>
            </svg>
          </div>
          <div class="text">100</div>
        </div> -->
      </div>
      <section class="send-gift-section" v-show="giftSectionShow" @click.stop="giftSectionShow = false">
        <send-gift :theme="`dark`" @selectGift="selectGift"></send-gift>
      </section>
    </div>
    <canvas id="videoCanvas" v-show="false"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
import { Toast } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import { ERR_OK, enterVideoRTCRoom } from '@/server/index.js'
import { RTCRoomMixin, IMMixin, sendMsgsMixin } from '@/common/js/mixin'
import { msgStatus, msgTypes } from '@/common/js/status'
// import IM from '@/server/im.js'

export default {
  mixins: [
    RTCRoomMixin,
    IMMixin,
    sendMsgsMixin
  ],
  components: {
    // 'LineUp': () => import('@/views/mainRoom/components/video/line-up'),
    'VideoFooter': () => import('@/views/mainRoom/components/video/video-footer'),
    'VideoMsgList': () => import('@/views/mainRoom/components/video/video-msg-list'),
    'SendGift': () => import('@/views/mainRoom/components/chat/send-gift'),
    'Assess': () => import('@/views/mainRoom/components/assess'),
    Toast
  },
  computed: {
    likesCountStyle() {
      return this.likes ? '#icon-xin-hong' : '#icon-dianzanqian'
    },
    isVideoFilter: {
      get() {
        return this.videoFilter.blur
      },
      set() {}
    },
    localVideo() {
      if (!this.fullScreen) {
        return 'invisible'
      }
      return this.isChangeCamera ? 'big' : 'small'
    },
    remoteVideo() {
      if (!this.fullScreen) {
        return 'small'
      }
      const chunk = this.isChangeCamera ? 'small' : 'big'
      const bgc = this.isVideoConnectSuccess ? 'bgc' : ''
      return `${chunk} ${bgc}`
    },
    ...mapGetters([
      'fullScreen',
      'roomMode',
      'queueMode',
      'userInfo',
      'csInfo',
      'roomId',
      'sessionId',
      'hasAssess',
      'serverTime',
      'videoFilter'
    ])
  },
  data() {
    return {
      videoScreenShotShow: false,
      videoScreenShotSrc: '',
      // 通话开始时间
      startTimeStamp: null,
      // 是否切换客服跟用户的摄像头位置：[false 客户窗口小窗] / [true 客户窗口大窗]
      isChangeCamera: true,
      // 礼物列表弹层开关：[false 开启 / [true 关闭]
      giftSectionShow: false,
      likes: false,
      likesCount: 0,
      isVideoConnectSuccess: false,
      // 视频提示信息
      isToastTextShow: false,
      toastText: ''
    }
  },
  mounted() {
    document.getElementById('videoRing').play()
    this.readyToVideo()
    this.$nextTick(() => {
      this.likesCount = +this.csInfo.likesCount
    })
  },
  methods: {
    _getVideoTime(dateBegin) {
      const dateEnd = new Date() // 获取当前时间
      const dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
      // 计算出相差天数
      // const day = Math.floor(dateDiff / (24 * 3600 * 1000))
      const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
      const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      // 计算相差分钟数
      const minutes = Math.floor(leave2 / (60 * 1000)).toString().padStart(2, '0')
      const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      // 计算相差秒数
      const seconds = Math.round(leave3 / 1000).toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    openVideoBar() {
      this.setFullScreen(true)
    },
    selectGift(giftInfo) {
      console.log('发礼物辣：', giftInfo)
      this.$emit('showGiftAnime', giftInfo)
      this.sendGiftMsg(giftInfo)
    },
    sendLike() {
      if (this.likes) {
        return
      }
      this.likesCount += 1
      this.sendLikeMsg()
      this.likes = true
    },
    closeVideoBar() {
      this.setFullScreen(false)
    },
    async readyToVideo() {
      // 初始化摄像头
      this.isChangeCamera = true

      this.initRTC()
        .then(() => this.enterRoom(this.roomId))
        .then(() => this.getLocalStream(), err => {
          alert(err)
        })
        .then(info => this.startRTC(info.stream), err => {
          alert(err)
        })
        // .catch(err => {
        //   alert(err)
        //   // this.$emit('videoFailed')
        // })

      this.enterVideoRTCRoomAPI(this.csInfo.csId, this.userInfo.userId, this.userInfo.openId, this.sessionId)
    },
    async enterVideoRTCRoomAPI(roomId, userId, openId, sessionId) {
      const enterVideoStatus = window.sessionStorage.getItem('enterVideoStatus')
      const clientType = enterVideoStatus === 'Android' ? 'Android' : 'iOS'
      const res = await enterVideoRTCRoom(roomId, userId, openId, sessionId, clientType)
      if (res.result.code === ERR_OK) {
        // this.$vux.toast.text('进房成功')
      } else {
        // this.$vux.toast.text('进房失败')
      }
    },
    handleHangUpVideo() {
      if (!this.isVideoConnectSuccess) {
        // 视频成功接通之前客户点击挂断
        // 关闭铃声
        document.getElementById('videoRing').pause()
        this.$emit('videoFailed')
        // return undefined
      }
      // 发送自定义指令
      this.sendCustomDirective({
        msg: '客户点击挂断',
        msgStatus: msgStatus.msg,
        msgType: msgTypes.msg_video_hang_up,
        MsgLifeTime: 0
      })
      // 停止推流
      this.quitRTC()
    },
    async hangUpVideo() {
      // 恢复全屏
      !this.fullScreen && this.setFullScreen(true)
      // 恢复摄像头默认位置
      this.isChangeCamera && (this.isChangeCamera = false)
      // 记录通话时间
      const time = this._getVideoTime(this.startTimeStamp)
      this.setServerTime(time)
      // 判断当前是否评价过
      this.isVideoConnectSuccess && !this.hasAssess && this.setAssessView({
        show: true,
        task: {
          csInfo: Object.assign({}, this.csInfo),
          sessionId: this.sessionId,
          mode: this.roomMode
        }
      })
    },
    getVideoScreenShot() {
      return new Promise(resolve => {
        const canvas = document.getElementById('videoCanvas')
        var canvasCtx = canvas.getContext('2d')
        var video = document.getElementById('remoteVideo')
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
        // 坐原图像的x,y轴坐标，大小，目标图像的x，y轴标，大小。
        canvasCtx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight)
        // 把图标base64编码后变成一段url字符串
        this.videoScreenShotSrc = canvas.toDataURL('image/png')
        this.videoScreenShotShow = true
        resolve()
      })
    },
    showShare(csId, csName) {
      this.$emit('showShare', csId, csName)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setAssessView: 'SET_ASSESS_VIEW',
      setServerTime: 'SET_SERVER_TIME'
    })
  },
  filters: {
    videoTimeFormat(val) {
      const temp = val.split(':')
      return temp.filter(item => item !== '0').join(':')
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.video-bar {
  // &.video-mini-screen {
  //   margin: .5rem .5rem 0 0;
  //   width: 9rem;
  //   height: 16.5rem;
  //   border-radius: .4rem;
  //   overflow: hidden;
  // }
  .line-up {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 102;
  }
  .video-window {
    position: fixed;
    top: 0;
    right: 0;
    &.big {
      width: 100%;
      height: 100%;
      z-index: 0;
      &.bgc {
        background-color: #666;
      }
    }
    &.small {
      margin: .5rem .5rem 0 0;
      width: 9rem;
      height: 16.5rem;
      border-radius: .4rem;
      // z-index: 200;
      overflow: hidden;
      z-index: 1;
      &.bgc {
        background-color: #222;
      }
    }
    &.invisible {
      visibility: hidden;
    }
    video {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      transition: filter ease-in-out .5s;
      // &#remoteVideo {
      //   background-color: #666;
      // }
      // &#localVideo {
      //   transform: translateX(-50%) rotateY(180deg)
      // }
      &.video-blur {
        filter: blur(50px);
      }
      &::-webkit-media-controls {
        display: none !important;
      }
    }
    .video-watermark {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      object-fit: contain;
    }
    .video-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: unset;
      .full-screen-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .icon {
          position: absolute;
          top: 0.4rem;
          left: 0.4rem;
          width: 2rem;
          height: 2rem;
          fill: #fff;
          opacity: .7;
        }
      }
    }
    .video-screen-shot {
      object-fit: cover;
      filter: blur(30px);
    }
  }
  .full-screen-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 101;
    .video-header {
      position: absolute;
      top: 2.6rem;
      left: 1.8rem;
      width: 6rem;
      height: 14rem;
      text-align: center;
      z-index: 10;
      .avatar {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        background: linear-gradient(to right, #FF8C6A, #FF80A0);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 0.25rem;
          box-sizing: border-box;
          object-fit: cover;
        }
      }
      .name {
        display: inline-block;
        vertical-align: top;
        line-height: 1.6;
        background-color: rgb(228, 169, 183);
        border-radius: 1.5rem;
        font-size: 1.2rem;
        padding: 0.01rem 1rem;
        color: @text-lighter;
        margin: 1rem 0;
      }
    }
    .video-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
    .video-msg-list {
      position: absolute;
      bottom: 9.8rem;
      left: 2rem;
      right: 2rem;
      height: 11rem;
      // background-color: #000;
      z-index: 10;
    }
    .video-fload-btn {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 2rem;
      margin: auto;
      width: 4rem;
      height: 14rem;
      z-index: 10;
      .item {
        width: 100%;
        text-align: center;
        padding-bottom: 2rem;
        .item-icon {
          position: relative;
          width: 4rem;
          height: 4rem;
          .icon {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
          &.icon-hongxin {
            background-color: unset;
            .icon {
              width: 4rem;
              height: 3rem;
              fill: #FF959C;
            }
          }
          &.icon-zhuanfa {
            border-radius: 50%;
            background-color: rgba(0, 0, 0, .2);
            .icon {
              width: 2.25rem;
              height: 1.55rem;
              fill: #fff;
            }
          }
        }
        .text {
          line-height: 2rem;
          font-size: 1.2rem;
          margin-top: 0.3rem;
          color: #fff;
          // color: @text-normal;
        }
      }
    }
    .send-gift-section {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 999;
      .send-gift {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
  // .mini-container {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   margin: .5rem .5rem 0 0;
  //   width: 9rem;
  //   height: 16.5rem;
  //   border-radius: .4rem;
  //   z-index: 200;
  //   background-color: #222;
  //   overflow: hidden;
  //   .server-video-window {
  //     width: 100%;
  //     height: 100%;
  //     background-color: #666;
  //     video {
  //       width: 100%;
  //       height: 100%;
  //       object-fit: cover;
  //       &::-webkit-media-controls {
  //         display:none !important;
  //       }
  //     }
  //   }
  // }
}
</style>
