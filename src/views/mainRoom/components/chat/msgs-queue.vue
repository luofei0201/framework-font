<script type="text/ecmascript-6">
import Tools from '@/common/js/tools'
import { mapGetters } from 'vuex'
import msgDictionary from '@/common/js/msgDictionary'
import { sessionStatus } from '@/common/js/status'
import { InlineLoading } from 'vux'

export default {
  render() {
    return (
      <ul class="msgs-queue"
        on-touchstart={() => this.showCopyButton(event)}
        on-touchend={() => this.clearLoop(event)}>
        <li class="chat_content_block chat_content_start" ref="chatContentStart"></li>
        {
          this.historyMsgs.map((msg, index) => (<li class={{ chat_content_li: true, text_center: msg.msgStatus === msgDictionary.getStatusCode('tip') }} key={ msg.timestamp }>
            { msgDictionary.getTemplate.call(this, msg) }
          </li>))
        }
        {
          this.historyMsgs.length !== 0 &&
          <li class="chat_content_li text_center history-block">
            <span class="item line border-1px-before"></span>
            <span class="item text">以上为历史消息</span>
            <span class="item line border-1px-before"></span>
          </li>
        }
        {
          this.msgs.map((msg, index) => (<li class={{chat_content_li: true, text_center: msg.msgStatus === msgDictionary.getStatusCode('tip')}} key={ msg.timestamp }>
            { msgDictionary.getTemplate.call(this, msg) }
          </li>))
        }
        { /* <li class={{chat_content_block: true, chat_content_end: true, bot_assess: this.isBotAssessShow}} ref="chatContentEnd" ></li> */ }
      </ul>
    )
  },
  components: {
    InlineLoading
  },
  props: {
    historyMsgs: {
      type: Array,
      default() {
        return []
      }
    },
    msgs: {
      type: Array,
      default() {
        return []
      }
    },
    isBotAssessShow: {
      type: Boolean
    }
  },
  data() {
    return {
      msgDictionary,
      Loop: null
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'csInfo'
    ])
  },
  methods: {
    reConnect() {
      console.log('重新连接')
      this.$emit('handleReConnectToOnlineChat')
    },
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
    clickImgMsg(id) {
      this.$emit('onClickImgMsg', id)
    },

    // 点击留言按钮,进入留言页面
    leaveMsg() {
      this.$emit('toLeaveMsg')
    },

    // 进入在线客服个人中心
    enterSerCenter(msg) {
      let csId = ''
      switch (msg.chatType) {
        case sessionStatus.robot:
          return
        case sessionStatus.video:
          csId = msg.avatar
          break
        case sessionStatus.onLine:
          csId = msg.avatar
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
    showCopyButton(event) {
      const e = event || window.event
      this.Loop && clearInterval(this.Loop) // 再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(() => {
        const text = e.target.innerText
        this.$emit('msgLongPress', { e, msg: text })
      }, 500)
    },
    clearLoop() {
      this.Loop && clearInterval(this.Loop)
      this.Loop = null
    },
    timeFilter(val) {
      const temp = new Date(val.replace(/-/g, '/'))
      return Tools.DateTools.formatDate(temp, 'MM月dd日 hh:mm')
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.chat-content {
  width: 100%;
  overflow: hidden;
  ul {
    .chat_content_block {
      width: 100%;
      &.chat_content_start {
        height: 2rem;
      }
      &.chat_content_end {
        height: 0;
        &.bot_assess {
          height: 9.2rem;
        }
      }
    }
    .chat_content_li {
      position: relative;
      width: 100%;
      &.text_center {
        text-align: center;
      }
      &.history-block {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 2rem;
        .item {
          display: inline-block;
          &.line {
            width: 20%;
            .border-1px-before(@label-line-normal);
          }
          &.text {
            font-size: 1.2rem;
            padding: 0 1.2rem;
            line-height: 1.2rem;
            color: @label-line-normal;
          }
        }
      }
      .dialog-item {
        .tit {
          line-height: 1.5;
          font-size: 1.4rem;
          color: @text-normal;
        }
        .text {
          line-height: 1.25;
          font-size: 1.2rem;
          transform: scale(0.8, 0.8);
          transform-origin: 0 0;
          color: @text-light;
        }
      }
      .cell {
        width: 27.5rem;
        margin: 0 auto 1.4rem;
        border-radius: 0.5rem;
        background: @text-lighter;
        &.fail-container {
          .fail-con {
            display: flex;
            padding: 1.9rem 5.5rem 1.9rem 1.9rem;
            img {
              flex: none;
              width: 4.8rem;
              height: 4.8rem;
              margin: 0 1.9rem 0 0;
            }
          }
          .fail-bottom {
            font-size: 1.2rem;
            color: #2196f3;
            padding: 0.4rem 0;
            text-align: center;
            // border-top: 1px solid @text-lighter-a;
            .border-1px-before(@label-line-normal);
            a {
              display: inline-block;
              line-height: 1.2rem;
            }
          }
        }
        .suc-con {
          display: flex;
          padding: 1rem 1.6rem;
          .avatar {
            width: fit-content;
            text-align: center;
            margin-right: 2rem;
            img {
              width: 5.6rem;
              height: 5.6rem;
              border-radius: 50%;
            }
            .name {
              font-size: 1.2rem;
              color: #cdcdcd;
              padding-top: 0.6rem;
            }
          }
          .diamond {
            margin-left: 0.8rem;
            img {
              width: 5.2rem;
              height: 2.9rem;
              /*margin-top: 4.8rem;*/
            }
          }
        }
      }
      .tips-item {
        position: relative;
        display: inline-block;
        max-width: 52%;
        min-height: 1.2rem;
        padding: 0.3rem 0.6rem;
        margin: 0 auto 1.8rem;
        transform: scale(calc(~"10 / 12"));
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        .item-span {
          vertical-align: middle;
          color: @text-lighter;
          font-size: 1.2rem;
          height: 1.2rem;
          line-height: 1.8rem;
          .icon {
            width: 1.2rem;
            height: 1.2rem;
            fill: #fff;
            display: inline-block;
            vertical-align: inherit;
          }
          .button {
            color: #2196f3;
          }
        }
      }
      .card-item {
        width: 100%;
        margin-bottom: 1.4rem;
        margin-top: 2rem;
        .card-container {
          text-align: center;
          .card {
            position: relative;
            margin: 0 auto 1.2rem;
            width: 15.6rem;
            height: 5.2rem;
            background: @bg-light;
            border-radius: 1rem;
            .avatar {
              position: absolute;
              left: 0;
              right: 0;
              top: -2.3rem;
              width: 4.6rem;
              height: 4.6rem;
              border-radius: 50%;
              // overflow: hidden;
              margin: 0 auto;
              border: 0.3rem solid rgb(244, 244, 244);
              box-sizing: border-box;
              .avatar-decorate {
                position: absolute;
                top: -.3rem;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                z-index: 1;
                transform: scale(1.4)
              }
              img {
                border-radius: 50%;
                object-fit: cover;
              }
            }
            .text {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0.6rem;
              font-size: 1.2rem;
              color: @text-light;
              .name {
                color: #ff959c;
              }
            }
          }
          .label {
            font-size: 1.2rem;
            font-weight: 400;
            color: @text-lighter-a;
            line-height: 1.8rem;
          }
        }
      }
      .msgs-item {
        width: calc(~"100% - 9rem");
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
          // overflow: hidden;
          align-items: flex-start;
          .avatar-decorate {
            position: absolute;
            top: -.3rem;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            z-index: 1;
            transform: scale(1.4)
          }
          .bot-avatar {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            img {
              border-radius: 50%;
              overflow: hidden;
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
          width: calc(~"100% - 5.8rem");
          font-size: 1.4rem !important;
          display: flex;
          flex-direction: column;
          div {
            span {
              font-size: 1.4rem !important;
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
              .chat-content-shadow(@bg-light-shadow)// left: 0;;;;
            }
            &.right-content-style {
              border-radius: 1.2rem 0.4rem 1.2rem 1.2rem;
              color: @text-lighter;
              background-color: @text-special;
              .chat-content-shadow(@text-special-shadow)// right: 0;;;;
            }
            &.content-extend {
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
              background-color: unset!important;
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
              background: unset!important;
              background-color: unset!important;
              background-image: unset!important;
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
                // overflow: hidden;
                .text-img-cell {
                  vertical-align: middle;
                  max-width: 100%;
                  object-fit: cover;
                  overflow: hidden;
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
                background: linear-gradient(
                  to right,
                  @text-lighter-a,
                  @text-lighter-a 0.5rem,
                  transparent 0.5rem,
                  transparent
                );
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
            .decorate-section {
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              height: 100%;
              &.trans-direct {
                left: 0;
                transform: rotateY(180deg);
                transform-origin: 0;
              }
              .decorate{
                position: absolute;
                width: 4rem;
                height: 4rem;
                z-index: 100;
                background-size: contain;
                background-repeat: no-repeat;
                &.top {
                  top: 0;
                }
                &.bottom {
                  bottom: 0;
                }
              }
            }
          }
          .msg-enter-active,
          .msg-leave-active {
            &.left-content-style {
              transform-origin: left top;
            }
            &.right-content-style {
              transform-origin: right top;
            }
            transition: all ease 0.2s;
          }
          .msg-enter,
          .msg-leave-to {
            opacity: 0;
            transform: scale(0, 0.8);
          }
        }
      }
    }
  }
}
</style>
