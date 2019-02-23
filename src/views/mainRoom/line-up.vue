<template>
  <section class="section line-up">
    <!--<div class="top"></div>-->
    <main class="main">
      <div class="img-box">
        <img src="/video/static/img/lineing.gif">
      </div>
      <div class="tips">
        <p class="tips-top" v-if="queueNum">当前还有<label class="num">{{queueNum >= 0 ? queueNum : 0}}</label>人排队.</p>
        <p class="tips-top" v-else>排队成功，正在为您转接视频客服</p>
      </div>
      <a type="reset" class="btn-cancel" @click="clickToCancelLineUp">取 消</a>
       <!-- @confirmToVideo="confirmToVideo" -->
    </main>
  </section>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { IMMixin } from '@/common/js/mixin'
import IM from '@/server/im'
import { ERR_OK, videoQueue, videoQueueHeartBeat } from '@/server/index.js'
import { roomStatus, queueStatus, systemMsgStatus } from '@/common/js/status'

export default {
  mixins: [
    IMMixin
  ],
  computed: {
    ...mapGetters([
      'userInfo',
      'queueNum',
      'sessionId',
      'sessionRamId'
    ])
  },
  data() {
    return {
      accessId: null,
      videoHeart: false, // 判断心跳变量
      videoHeartBeatCount: 0,
      videoHeartBeatTimer: null,
      videoHeartBeatReq: null,
      videoHeartBeatFailCount: 0 // 心跳包超时失败次数
    }
  },
  mounted() {
    this.initQueue()
  },
  methods: {
    async initQueue() {
      /* map -> {
        userId,
        userName,
        csId,
        csName,
        nickName,
        toCsFlag,
        origin,
        userPriority,
        robotSessionId
      } */
      const query = this.$route.query
      const res = await videoQueue(
        this.userInfo.userId,
        this.userInfo.userName,
        query.csId,
        query.csName,
        this.userInfo.nickName,
        true,
        this.userInfo.origin || 'WE',
        this.userInfo.userPriority,
        this.sessionRamId
      )
      if (res.result.code === ERR_OK) {
        console.log('===============================> 排队啊 排队啊 排队啊 <===============================')
        this.setQueueMode({
          mode: roomStatus.AIChat,
          status: queueStatus.queuing
        })
        // 记录排队开始时间
        window.sessionStorage.setItem('queue_start_time', new Date().getTime())

        const data = res.data
        // 记录accessId
        this.accessId = data.accessId
        // 初始化排队人数
        this.setQueueNum(+data.queueNum)
        if (+data.queueNum === 0) {
          // 当前队列无人排队，直接推送排队成功的消息给坐席
          const msg = {
            code: systemMsgStatus.VIDEO_REQUEST_CS_ENTENCE,
            csId: query.csId,
            csName: query.csName,
            accessId: data.accessId,
            queueStartTime: data.startTime,
            queueEndTime: data.endTime
          }
          const config = await this.configSendSystemMsg(msg)
          await IM.sendSystemMsg(config)

          // 客服转接定时器
          const VIDEO_CS_REQ_TRANS_FAIL_msg = {
            code: systemMsgStatus.VIDEO_CS_REQ_TRANS_FAIL,
            csId: msg.csId
          }
          this.reqTransTimeout({
            msg: VIDEO_CS_REQ_TRANS_FAIL_msg,
            toast: this.$vux.toast,
            delay: 30000
          }).then(() => {
            // 取消排队接口
            this.videoQueueCancelAPI(3)
            // 排队失败返回
            this.queueFailedReturn()
            // 发送排队失败通知
            this.afterQueueFailed()
          })
        } else {
          // 开启心跳
          this.startVideoHeartBeat()
        }
      } else {
        console.log('error in videoQueue')
      }
    },
    clickToCancelLineUp() {
      // 停止心跳
      this.stopVideoHeartBeat()

      const VIDEO_QUEUES_CANCEL_msg = {
        code: systemMsgStatus.VIDEO_QUEUES_CANCEL,
        csId: this.$route.query.csId
      }
      // 取消排队接口
      this.videoQueueCancelAPI(2)
      // 排队失败返回
      this.queueFailedReturn()

      this.queueNum === 0 && this.reqTransTimeout({
        msg: VIDEO_QUEUES_CANCEL_msg
      })
    },
    startVideoHeartBeat() {
      this.videoHeart = true
      const query = this.$route.query
      this.videoHeartBeatTimer = setInterval(async() => {
        console.warn('====== 我现在请求心跳 ======')
        if (!this.videoHeart || !this.$route.query.csId) {
          // 非常规退出 & 浏览器回退
          this.stopVideoHeartBeat()
          return
        }
        this.videoHeartBeatCount++
        if (this.videoHeartBeatCount === 20) {
          this.$vux.toast.show({
            type: 'text',
            text: '坐席繁忙，请耐心等待',
            width: '50%',
            time: 5000
          })
        }
        this.videoHeartBeatReq = await videoQueueHeartBeat(query.csId, this.userInfo.userId)
        if (this.videoHeartBeatReq.code === ERR_OK) {
          console.info('心跳成功, 心跳ID:', this.videoHeartBeatTimer)
          this.videoHeartBeatFailCount = 0
        } else {
          this.videoHeartBeatFailCount++
          if (this.videoHeartBeatFailCount > 2) {
            console.error('心跳失败 辣')
          }
        }
      }, 7000)
      debugger
    },
    stopVideoHeartBeat() {
      this.videoHeart = false
      debugger
      clearInterval(this.videoHeartBeatTimer)
      if (this.videoHeartBeatReq) {
        this.videoHeartBeatReq = null
        this.videoHeartBeatTimer = null
        this.videoHeartBeatFailCount = 0
      }
    },
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO',
      setQueueMode: 'SET_QUEUE_MODE',
      setQueueNum: 'SET_QUEUE_NUM'
    }),
    ...mapActions([
      'configSendSystemMsg',
      // 'afterQueueSuccess',
      'reqTransTimeout',
      'afterQueueFailed'
    ])
  }
}
</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';

  .line-up {
    width: 100%;
    min-height: 100%;
    background-color: @bg-normal;
    .main {
      padding: 10rem 0 0;
      .img-box {
        width: 15.3rem;
        /*height: 15.3rem;*/
        margin: 0 auto;
        line-height: 11rem;
        text-align: center;
        img {
          width: 100%;
          vertical-align: middle;
          /*animation: waiting 30s;*/
          /*animation-timing-function: ease-in;*/
        }
      }
      .tips {
        line-height: 1.75;
        text-align: center;
        padding-top: 5.0rem;
        letter-spacing: .05rem;
        .tips-top {
          color: #909090;
          font-size: 1.8rem;
          font-weight: bold;
          .num {
            color: #ff444a;
          }
        }
        .tips-bottom {
          color: #BBBBBB;
          font-size: 1.6rem;
        }
      }
      .btn-cancel {
        height: 4rem;
        width: 15rem;
        display: block;
        color: #ffffff;
        font-size: 2rem;
        line-height: 4rem;
        margin: 10rem auto 0;
        border-radius: 2rem;
        text-align: center;
        background: linear-gradient(to right, #FF8C6A, #FF80A0);
      }
      /*animation*/
/*      @keyframes waiting {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(7200deg);
        }
      }*/
    }
  }
</style>
