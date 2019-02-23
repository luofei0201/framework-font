<template>
  <div class="video-footer">
    <div class="footer-bar">
      <div class="hang-up">
        <button class="footer-btn footer-btn-hang-up extend-click" @click="warningConfirmShow">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-guaduan"></use>
          </svg>
        </button>
      </div>
      <div class="menu" :style="canTouch">
        <button class="footer-btn footer-btn-gift extend-click" @click="videoConnected && $emit('sendGift')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-liwu"></use>
          </svg>
        </button>
        <!-- <button class="footer-btn footer-btn-star extend-click" @click="$emit('handleAssess')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-pingjia"></use>
          </svg>
        </button> -->
        <button class="footer-btn footer-btn-switch extend-click" @click="videoConnected && $emit('changeCamera')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-qiehuanshexiangtou"></use>
          </svg>
        </button>
        <button class="footer-btn footer-btn-screen extend-click" @click="videoConnected && $emit('minimizeVideoBar')">
           <!-- :class="{'isBtnHighLight': isMinimizeBtnHighLight}" -->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-suoxiao"></use>
          </svg>
          <div class="tips" v-if="false">点击文字交流</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tools from '@/common/js/tools'

export default {
  data() {
    return {
      isMinimizeBtnHighLight: false
    }
  },
  props: {
    videoConnected: {
      type: Boolean
    }
  },
  computed: {
    canTouch() {
      return !this.videoConnected ? 'opacity: .4;' : undefined
    }
  },
  methods: {
    warningConfirmShow() {
      const self = this
      this.$vux.confirm.show({
        title: '真的要退出当前视频嘛？？',
        onConfirm() {
          self.$emit('hangUpVideo')
        }
      })
    },
    async minimizeBtnHighLight() {
      this.isMinimizeBtnHighLight = true
      await Tools.AsyncTools.sleep(5000)
      this.isMinimizeBtnHighLight = false
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/mixin.less';
@import '~@/common/style/theme.less';

.video-footer {
  .footer-bar {
    width: 100%;
    height: 6.8rem;
    display: flex;
    align-items: center;
    .hang-up {
      width: 6.8rem;
      height: 6.8rem;
      padding: 1.4rem;
      box-sizing: border-box;
      .footer-btn {
        .icon {

        }
      }
    }
    .menu {
      width: calc(~'100% - 6.8rem');
      height: 6.8rem;
      padding: 1.4rem;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      .footer-btn {
        margin-left: 1.4rem;
      }
    }
    div > .footer-btn {
      width: 4rem;
      height: 4rem;
      padding: 0;
      margin: 0;
      border: 0;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, .3);
      &.isBtnHighLight {
        // background-color: rgba(0, 0, 0, .9);
        // box-shadow: 0 0 .5rem .5rem rgba(255, 255, 255, .8);
      }
      &.footer-btn-hang-up {
        background-color: rgba(255, 149, 156, 1);
      }
      &.footer-btn-gift {
        background-color: unset;
      }
      &.footer-btn-star {
        background-color: unset;
      }
      &.footer-btn-switch {

      }
      &.footer-btn-screen {
        .icon {
          width: 2rem;
          height: 2rem;
        }
      }
      .icon {
        width: 2.4rem;
        height: 2.4rem;
        fill: @text-lighter;
      }
      .tips {
        position: absolute;
        top: -3.4rem;
        right: 0;
        display: inline-block;
        white-space: nowrap;
        background-color: rgba(0, 0, 0, .9);
        color: #fff;
        font-size: 1.2rem;
        line-height: 1.2rem;
        padding: .6rem;
        border-radius: .4rem;
        &::after {
          content: '';
          display: block;
          width: 0;
          height: 0;
          position: absolute;
          bottom: -.6rem;
          right: 1.2rem;
          border-width: 0.8rem 0.8rem 0 0.8rem;
          border-style: solid;
          border-color: rgba(0, 0, 0, .9) transparent transparent transparent;
        }
      }
    }
  }
}
</style>
