<template>
  <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle">
    <div class="before-trigger" v-if="beforePullDown">
      <bubble :y="bubbleY"></bubble>
    </div>
    <div class="after-trigger" v-else>
      <div v-if="isPullingDown" class="loading">
        <div class="mf-loading-container">
          <!-- <img src="/video/static/img/loading.gif"> -->
          <spinner :type="`lines`" :size="'30px'"></spinner>
        </div>
      </div>
      <div v-else><span>{{pulldownResult}}</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bubble from '@/views/mainRoom/components/chat/bubble'
import { Spinner } from 'vux'
// ['android', 'ios', 'ios-small', 'bubbles', 'circles', 'crescent', 'dots', 'lines', 'ripple', 'spiral']
export default {
  components: {
    Bubble,
    Spinner
  },
  props: {
    beforePullDown: {
      type: Boolean
    },
    isRebounding: {
      type: Boolean
    },
    isPullingDown: {
      type: Boolean
    },
    pullDownStyle: {
      type: String
    },
    bubbleY: {
      type: Number
    },
    pulldownResult: {
      type: String
    }
  }
}
</script>

<style lang="less">
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  transform: translateY(-50px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  .after-trigger {
    margin-top: 10px;
    .mf-loading-container {
      img {
        width: 20px;
        height: 20px;
        display: block;
      }
    }
  }
}
</style>
