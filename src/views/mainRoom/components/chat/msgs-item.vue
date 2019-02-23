<template v-once>
  <div class="msgs-item"
    @touchstart="showCopyButton"
    @touchend="clearLoop"
    :class="[{'item-padding-left': msg.isSelfSend, 'item-padding-right': !msg.isSelfSend}]">
    <div class="avatar" v-if="!msg.isSelfSend">
      <div class="bot-avatar bg-image">
        <img width=100% height=100% v-lazy="avatarUrl" @click="enterSerCenter">
        <!-- @click="enterSerCenter" -->
      </div>
      <!-- <svg class="icon extend-click" aria-hidden="true">
        <use xlink:href="#icon-wode"></use>
      </svg> -->
    </div>
    <div class="content-box" :class="[{'right-content-box': msg.isSelfSend, 'left-content-box': !msg.isSelfSend}]">
      <p class="name" v-if="!msg.isSelfSend">{{msg.nickName}}</p>
        <div
          class="content chat-content-shadow"
          :class="[{
            'right-content-style': msg.isSelfSend,
            'left-content-style': !msg.isSelfSend,
            'padding-for-img': msg.msgType === msgTypes.msg_img,
            'padding-for-HX': msg.msgType === msgTypes.msg_XH_express
          }]">
          <!-- 消息状态 -->
          <div class="msg-status" v-if="msg.isSelfSend">
            <inline-loading v-if="msg.status === 'pending'"></inline-loading>
            <div class="failed" v-if="msg.status === 'failed'" @click="$emit('resendMsgs', msg)">
              <svg class="icon extend-click" aria-hidden="true">
                <use xlink:href="#icon-gantanhao"></use>
              </svg>
            </div>
          </div>
          <!-- 基本消息 -->
          <span class="text" :id="msgCellId" v-if="msg.msgType === msgTypes.msg_normal" v-html="msg.content" @click="$emit('targetLink', $event)">{{msg.content}}</span>
          <!-- 点赞消息 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_liked" v-html="msg.content"></span>
          <!-- 机器人感谢消息 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_bot_thanks">小华感谢您的认可</span>
          <!-- 转人工 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_no_idea">
            小华好像听不太懂您的问题呢，可转
            <span class="button" @click="enterOnLineLineUp">人工客服</span>
          </span>
          <!-- 热点问题 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_hot">
            {{msg.content}}
            <span class="line"></span>
            <span class="text-extend-hot">
              <span class="text-extend">您可能想问：</span>
              <span class="text-extend button" v-for="(item, index) in msg.msgExtend" :key="index" @click="clickHotQues(item.question)">{{item.question}}</span>
              <!-- <span class="text-extend button" @click="enterOnLineLineUp">人工客服</span> -->
            </span>
          </span>
          <!-- 图片消息 -->
          <span class="text text-img" v-if="msg.msgType === msgTypes.msg_img">
            <img class="text-img-cell"
            :id="imgId"
            height=100%
            :src="msg.imgData.small"
            @click="clickImgMsg"
            :class="[{'right-img-style': msg.isSelfSend, 'left-img-style': !msg.isSelfSend}]">
            <!-- :onerror="msg.imgData.small" -->
          </span>
          <!-- 小华表情消息 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_XH_express">
            <img class="text-XH" height=100% :src="msg.imgData.small">
          </span>
          <!-- 礼物消息 -->
          <span class="text gift-item" v-if="msg.msgType === msgTypes.msg_gift">
            我送给{{this.csInfo.csNick || '客服'}}一个{{msg.giftInfo.giftName}} !
            <img class="text-gift" :src="giftIconSrc">
          </span>
          <!-- 留言 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_leave">{{msg.content}}，请<span class="button" @click="leaveMsg">点击留言</span>~</span>
          <!-- 猜问题 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_guess">我猜您想知道这些问题</span>
          <!-- 名片消息 -->
          <span class="text" v-if="msg.msgType === msgTypes.msg_card">
            <div class="text-card">
              <div class="card-left">
                <span class="name">{{msg.proxyInfo.agentName}}</span>
                <!-- <span class="sex">{{msg.proxyInfo.agentSex}}</span> -->
                <span class="sex">
                  <svg class="icon extend-click" aria-hidden="true">
                    <use xlink:href="#icon-nan"></use>
                  </svg>
                </span>
              </div>
              <div class="card-right">
                <ul>
                  <li class="infoList">
                    <span class="title">工号：</span>
                    <span class="val">{{msg.proxyInfo.agentId}}</span>
                  </li>
                  <li class="infoList">
                    <span class="title">所属渠道：</span>
                    <span class="val">个险</span>
                  </li>
                  <li class="infoList">
                    <span class="title">电话：</span>
                    <span class="val phone" @click="callPhone($event)">{{msg.proxyInfo.agentPhone}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </span>
        </div>
        <!-- 猜问题 模块 -->
        <div class="content chat-content-shadow left-content-style content-extend" v-if="msg.msgType === msgTypes.msg_guess">
          <span class="text">
            <span class="text-extend button" v-for="(item, index) in msg.msgExtend" :key="index" @click="clickHotQues(item.question)">{{item.question}}</span>
            <!-- <span class="text-extend button" @click="enterOnLineLineUp">人工客服</span> -->
          </span>
        </div>
    </div>
    <!-- <div class="avatar" v-show="false">
      <svg class="icon extend-click" aria-hidden="true">
        <use xlink:href="#icon-wode"></use>
      </svg>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { msgTypes, sessionStatus } from '@/common/js/status'
import { getCsAvatar } from '@/server/index.js'
import { InlineLoading } from 'vux'

export default {
  components: {
    InlineLoading
  },
  props: {
    msg: {
      type: Object
    }
  },
  data() {
    return {
      msgTypes: msgTypes
    }
  },
  computed: {
    avatarUrl() {
      switch (this.msg.chatType) {
        case sessionStatus.robot:
          return '/video/static/img/chat/xiaohua@2x.png'
        case sessionStatus.video:
          return getCsAvatar(this.msg.avatar)
        case sessionStatus.onLine:
          return getCsAvatar(this.msg.avatar)
        default:
          return '/video/static/img/chat/xiaohua@2x.png'
      }
    },
    giftIconSrc() {
      return `/video/static/img/gift/${msg.giftInfo.giftId}.png`
    },
    imgId() {
      return `${this.msg.timestamp}`
    },
    msgCellId() {
      return `msgCell_${this.imgId}`
    },
    ...mapGetters([
      'csInfo'
    ])
  },
  mounted() {
    console.log('chat-content-item ===> 你个组件你被引用了哈哈哈')
  },
  methods: {
    callPhone(event) {
      const e = event || window.event
      window.location.href = `tel:${e.currentTarget.innerText}`
    },
    enterOnLineLineUp() {
      this.$emit('handleReConnectToOnlineChat')
    },
    clickHotQues(ques) {
      this.$emit('clickHotQues', ques)
    },
    clickImgMsg() {
      this.$emit('onClickImgMsg', +this.imgId)
    },

    // 点击留言按钮,进入留言页面
    leaveMsg() {
      this.$emit('toLeaveMsg')
    },

    // 进入在线客服个人中心
    enterSerCenter() {
      var csId = ''
      switch (this.msg.chatType) {
        case sessionStatus.robot:
          return
        case sessionStatus.video:
          csId = this.msg.avatar
          break
        case sessionStatus.onLine:
          csId = this.msg.avatar
          break
        default:
          return
      }
    // （机器人没有个人中心)
      this.$router.push({
        path: '/room/cusServ/serverDetail',
        query: {
          cusSerId: csId,
          csType: 'online'
        }
      })
    },
    /* *********************************** CopyButton *********************************** */
    showCopyButton() {
      if (this.msg.msgType === msgTypes.msg_normal) {
        clearInterval(this.Loop) // 再次清空定时器，防止重复注册定时器
        this.Loop = setTimeout(() => {
          const el = document.getElementById(this.msgCellId)
          this.$emit('msgLongPress', el, this.msg.content)
          // alert(`长按${JSON.stringify(this.msg.content)}`)
        }, 500)
      }
    },
    clearLoop() {
      clearInterval(this.Loop)
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.msgs-item {
  width: calc(~'100% - 9rem');
  // padding-top: 1.2rem;
  // padding-bottom: 1.2rem;
  display: flex;
  &.item-padding-left {
    padding-left: 9rem;
  }
  &.item-padding-right {
    padding-right: 9rem;
  }
  .avatar {
    position: relative;
    width: 3.8rem;
    height: 3.8rem;
    background-color: @text-light;
    border-radius: 50%;
    margin: 0 1rem;
    overflow: hidden;
    align-items: flex-start;
    .bot-avatar {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      // .bg-image('~/video/static/img/chat/xiaohua');
    }
    .icon {
      width: 1.2rem;
      height: 1.2rem;
      padding: 1.3rem;
      fill: @label-line-normal;
    }
  }
  .content-box {
    position: relative;
    width: calc(~'100% - 5.8rem');
    font-size: 1.4rem!important;
    display: flex;
    flex-direction: column;
    div {
      span {
        font-size: 1.4rem!important;
        text-align: justify;
      }
    }
    &.left-content-box {
      align-items: flex-start;
    }
    &.right-content-box {
      align-items: flex-end;
    }
    .name {
      font-size: 1.2rem;
      color: @text-light;
      line-height: 1.8rem;
    }
    .content {
      position: relative;
      // top: 2.3rem;
      display: inline-block;
      width: auto;
      max-width: 100%;
      padding: 0.8rem 1.2rem;
      margin-bottom: 1.4rem;
      box-sizing: border-box;
      .msg-status {
        position: absolute;
        left: -4.2rem;
        top: 0;
        width: 1.8rem;
        height: 1.8rem;
        margin: 1rem 1.2rem;
        align-items: flex-end;
        .failed {
          width: 100%;
          height: 100%;
          .icon {
            width: 100%;
            height: 100%;
            fill: #f00;
          }
        }
      }
      &.left-content-style {
        border-radius: 0.4rem 1.2rem 1.2rem 1.2rem;
        color: @text-normal;
        background-color: @bg-light;
        .chat-content-shadow(@bg-light-shadow)
        // left: 0;
      }
      &.right-content-style {
        border-radius: 1.2rem 0.4rem 1.2rem 1.2rem;
        color: @text-lighter;
        background-color: @text-special;
        .chat-content-shadow(@text-special-shadow)
        // right: 0;
      }
      &.content-extend{
        width: 100%;
        .text {
          -webkit-user-select: text;
          .text-extend {
            display: block;
            margin-bottom: 0.6rem;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      &.padding-for-img {
        padding: 0;
        // overflow: hidden;
        box-shadow: none;
        .text {
          display: inline-block;
          height: 12rem;
          // background-color: #f00;
        }
      }
      &.padding-for-HX {
        padding: 0;
        box-shadow: none;
        background-color: unset;
        border-radius: 0;
        .text {
          display: inline-block;
          height: 12rem;
        }
      }
      .text {
        position: relative;
        line-height: 2rem;
        max-width: 100%;
        word-wrap: break-word;
        -webkit-user-select: text;
        img, p > img {
          max-width: 100%;
        }
        &.gift-item {
          padding-left: 2rem;
          display: inline-block;
        }
        .text-gift {
          position: absolute;
          width: 5.8rem;
          top: 0;
          bottom: 0;
          left: -4.5rem;
          margin: auto;
        }
        &.text-img {
          .text-img-cell {
            vertical-align: middle;
            max-width: 100%;
            object-fit: cover;
            &.left-img-style {
              border-radius: 0.4rem 1.2rem 1.2rem 1.2rem;
            }
            &.right-img-style {
              border-radius: 1.2rem 0.4rem 1.2rem 1.2rem;
            }
          }
        }
        .button {
          color: rgb(82, 144, 239);
        }
        .line {
          display: block;
          width: 100%;
          height: 0.1rem;
          transform-origin: bottom left;
          transform: scaleY(0.5);
          background: linear-gradient(to right, @text-lighter-a, @text-lighter-a 0.5rem, transparent 0.5rem, transparent);
          background-size: 1rem 100%;
          margin: 0.9rem 0;
        }
        .text-label {
          color: @text-lighter-a;
        }
        .text-extend-hot {
          .text-extend {
            display: block;
            margin-bottom: 0.6rem;
            &:first-child {
              color: @text-lighter-a;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .text-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .card-left {
            width: 5.6rem;
            vertical-align: center;
            // text-align: center;
            margin-right: 1.2rem;
            .name {
              display: inline-block;
              font-size: 1.5rem;
              font-weight: 400;
              color: @text-normal;
              // line-height: 3.5rem;
              margin-bottom: 1rem;
            }
            .sex {
              width: 1.2rem;
              height: 1.2rem;
              display: block;
              .icon {
                width: 100%;
                height: 100%;
                fill: rgb(82, 144, 239);
              }
            }
          }
          .card-right {
            font-size: 1.2rem;
            ul {
              .infoList {
                .title {
                  color: @text-lighter-a;
                }
                .val {
                  color: @text-light;
                  &.phone {
                    color: rgb(82, 144, 239);
                  }
                }
              }
            }
          }
        }
      }
    }
    .msg-enter-active, .msg-leave-active {
      &.left-content-style {
        transform-origin: left top;
      }
      &.right-content-style {
        transform-origin: right top;
      }
      transition: all ease .2s;
    }
    .msg-enter, .msg-leave-to {
      opacity: 0;
      transform: scale(0, .8);
    }
  }
}
</style>
