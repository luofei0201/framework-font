<template>
  <div class="video-msg-list">
    <div class="scroll-wrapper" id="video-msg-list-bottom-tag">
      <ul>
        <li class="video-msg-item" v-for="(item, index) in this.videoMsgs" :key="index">
          <div class="item-wrapper">
            <span class="level-label">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zuanshi"></use>
              </svg>
              8
            </span>
            <span class="text-section" v-if="item.msgType === msgTypes.msg_gift">
              <span class="text">
                我送给客服一个{{item.giftInfo.giftName}}
                <!-- 我送给{{this.csInfo.csName || '客服'}}一个{{item.giftInfo.name}} -->
              </span>
              <i class="gift-area">
                <img width=100% height=100% :src="`/video/static/img/gift/${item.giftInfo.giftId}.png`">
              </i>
            </span>
            <span class="text-section" v-if="item.msgType === msgTypes.msg_liked">
              <span class="text">我{{userInfo.userName}}给你点赞</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { msgTypes } from '@/common/js/status'
import anime from 'animejs'

export default {
  computed: {
    ...mapGetters([
      'userInfo',
      'csInfo',
      'msgs',
      'videoMsgs'
    ])
  },
  data() {
    return {
      msgTypes: msgTypes,
      v_msgs: [
        {
          text: '木子李送给客服一个草莓蛋糕',
          gift: 'caomeidangao'
        },
        {
          text: '木子李已经评价了客服'
        },
        {
          text: '木子李已分享到微信'
        }
      ]
    }
  },
  watch: {
    videoMsgs() {
      this.$nextTick(() => {
        const e = document.getElementById('video-msg-list-bottom-tag')
        if (this.videoMsgs.length > 3) {
          const scrollObj = {
            scrollTop: e.scrollTop
          }
          anime({
            targets: scrollObj,
            scrollTop: e.scrollHeight - e.clientHeight,
            easing: 'easeInOutQuad',
            round: 1,
            update: function() {
              e.scrollTop = scrollObj.scrollTop
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';

.video-msg-list {
  .scroll-wrapper {
    width: 100%;
    height: 100%;
    padding: 0.5rem 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    ul {
      min-height: calc(~'100% + 1px');
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .video-msg-item {
        width: 100%;
        height: 2.5rem;
        line-height: 1.5rem;
        margin-bottom: 1.2rem;
        color: @text-lighter;
        font-size: 1.2rem;
        .item-wrapper {
          position: relative;
          display: inline-block;
          height: 100%;
          background-color: rgba(0, 0, 0, .3);
          border-radius: .2rem;
          padding: 0.5rem 0.4rem;
          box-sizing: border-box;
          &::nth-child {
            display: inline-block;
            vertical-align: top;
          }
          .level-label {
            width: 3rem;
            height: 1.5rem;
            background-color: #FF959C;
            border-radius: .2rem;
            padding: 0 0.2rem 0 0.6rem;
            .icon {
              width: 1rem;
              height: 0.75rem;
              fill: @text-lighter;
            }
          }
          .text-section {
            position: relative;
            display: inline-block;
            .text {
              font-size: 1.2rem;
              padding: 0 0.8rem;
            }
            .gift-area {
              position: absolute;
              top: 0;
              bottom: 0;
              right: -2.5rem;
              // left: 0;
              margin: auto;
              width: 3rem;
              height: 3rem;
            }
          }
        }
      }
    }
  }
}
</style>
