<template>
  <div class="float-bot-assess"
    :class="[
      {'bot-assess-close': isBotAssessToggle},
      {'anime': start}
    ]"
    :style="togglePos"
    @touchstart.capture="!isBotAssessToggle && startSlide($event)"
    @touchmove.capture="!isBotAssessToggle && slideMove($event)"
    @touchend.capture="!isBotAssessToggle && endSlide()">
    <div class="assess-area border-1px-right">
      <p class="text-content" v-if="false">是否已解决您的问题？</p>
      <!-- <div class="btn-area border-1px-before"> -->
      <div class="btn-area">
        <button type="button" class="bot-assess-btn yes border-1px-after" @click.self="$emit('targetBotAssess', true)">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-dianzan"></use>
          </svg>
          已解决
        </button>
        <button type="button" class="bot-assess-btn no" @click.self="$emit('targetBotAssess', false)">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-dianzan"></use>
          </svg>
          未解决
        </button>
      </div>
    </div>
    <div class="slide-btn extend-click-big-right" :class="{'open': !touchToggle || move >= 0}" @click.stop="targetSlideBtn">
      <span class="slide-item top"></span>
      <span class="slide-item bottom"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    // isBotAssessShow: {
    //   type: Boolean
    // }
  },
  data() {
    return {
      isBotAssessToggle: false,
      toggle: 10,
      start: null,
      move: 0
    }
  },
  computed: {
    togglePos() {
      return `transform: translateX(${this.move}px);`
    },
    touchToggle() {
      return Math.abs(this.move) >= this.toggle
    }
  },
  methods: {
    startSlide(event) {
      const e = event.targetTouches[0]
      // const label = this.$refs.csLabel
      this.start = e.clientX
      console.log(`x: ${this.start}`)
    },
    slideMove(event) {
      // debugger
      const e = event.targetTouches[0]
      const change = e.clientX - this.start
      // 限制不能向右滑动
      change < 0 && (this.move = change)
      // this.move = e.clientX - this.start
      console.log(`move: ${this.move}`)
    },
    endSlide() {
      // const e = event.targetTouches[0]
      if (this.move > 0) {
        // 滑动为反方向
        this.move = 0
      } else {
        // 滑动为正方向
        if (this.touchToggle) {
          // 超过限制
          this.move = -180
        } else {
          this.move = 0
        }
        this.isBotAssessToggle = this.touchToggle
      }
      // 复原
      this.start = null
    },
    targetSlideBtn() {
      if (this.touchToggle) {
        this.move = 0
      } else {
        this.move = -180
      }
      this.isBotAssessToggle = this.touchToggle
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/mixin.less';
@import '~@/common/style/theme.less';

.float-bot-assess {
  position: relative;
  // width: 18rem;
  width: 4.4rem;
  // height: 8rem;
  height: 16rem;
  background-color: @text-lighter;
  // border-radius: 1.2rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  box-shadow: 0 0.3rem 1rem 0rem rgba(147, 147, 147, 0.1);
  transition: all 0.4s cubic-bezier(0, 0, 0.2, 1);
  &.bot-assess-close {
    // transform: translateX(-99%)!important;
    transform: translateX(-80%)!important;
  }
  &.anime {
    transition-duration: 0s;
  }
  .assess-area {
    // width: calc(~'100% - 1.4rem');
    width: calc(~'100% - 0.8rem');
    height: 100%;
    .border-1px-right(@label-line-light);
    .text-content {
      text-align: center;
      color: @text-light;
      font-size: 1.4rem;
      line-height: 4.8rem;
    }
    .btn-area {
      // .border-1px-before(@label-line-light);
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      width: 100%;
      // height: 3.2rem;
      height: 100%;
      .bot-assess-btn {
        margin: 0;
        padding: 0;
        border: 0;
        background-color: unset;
        // width: 50%;
        width: 100%;
        height: 100%;
        // font-size: 1.4rem;
        font-size: 1.2rem;
        // line-height: 3.2rem;
        line-height: 1.4rem;
        padding: 1rem;
        .icon {
          // transform: translateY(0.2rem);
          width: 1.4rem;
          height: 1.4rem;
          display: block;
          margin: 0 auto .7rem;
        }
        &.yes {
          // .border-1px-right(@label-line-light);
          .border-1px-after(@label-line-light);
          color: rgb(82, 144, 239);
          .icon {
            fill: rgb(82, 144, 239);
          }
        }
        &.no {
          color: @text-lighter-a;
          .icon {
            fill: @text-lighter-a;
            transform: translateY(0.2rem) rotateX(180deg);
          }
        }
      }
    }
  }
  .slide-btn {
    position: absolute;
    // right: 0.8rem;
    right: 0.5rem;
    top: 0;
    bottom: 0;
    margin: auto;
    // height: 20%;
    height: .8rem;
    width: 0.1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &.open {
      .slide-item {
        &.top {
          // transform: rotateZ(20deg);
          transform: rotateZ(40deg);
        }
        &.bottom {
          // transform: rotateZ(-20deg);
          transform: rotateZ(-40deg);
        }
      }
    }
    .slide-item {
      position: absolute;
      width: 0.1rem;
      height: 51%;
      border-radius: 0.2rem;
      // margin: 0 0.1rem;
      background-color: @text-lighter-a;
      &.top {
        top: 0;
        transform-origin: left bottom;
      }
      &.bottom {
        bottom: 0;
        transform-origin: right top;
      }
    }
  }
}
</style>
