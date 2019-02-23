<template>
  <div class="tips-item">
    <!-- <span class="item-span" v-if="msg.msgType === tipTypes.tip_time">{{msg.content}}</span> -->
    <span class="item-span" v-if="msg.msgType === tipTypes.tip_time">{{msg.content | timeFilter}}</span>
    <span class="item-span" v-if="msg.msgType === tipTypes.tip_normal">{{msg.content}}</span>
    <span class="item-span" v-if="msg.msgType === tipTypes.tip_success">
      <svg class="icon icon-success extend-click" aria-hidden="true">
        <use xlink:href="#icon-chenggong"></use>
      </svg>
      {{msg.content}}
    </span>
    <span class="item-span" v-if="msg.msgType === tipTypes.tip_fail">
      <svg class="icon icon-fail extend-click" aria-hidden="true">
        <use xlink:href="#icon-zhuanjiemang"></use>
      </svg>
      客服转接失败，请稍后重试~
    </span>
    <span class="item-span" v-if="msg.msgType === tipTypes.tip_line_up">
      当前排队{{msg.queueNum}}人，请耐心等待
      <span class="button" @click="$emit('onLineCancelQueue')">取消排队</span>
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
// import { formatDate } from '@/common/js/dateConfig.js'
import Tools from '@/common/js/tools'
import { tipTypes } from '@/common/js/status'

export default {
  props: {
    msg: {
      type: Object
    }
  },
  data() {
    return {
      tipTypes: tipTypes
    }
  },
  created() {
    console.log('tips-item ===> 你个组件你被引用了哈哈哈')
  },
  filters: {
    timeFilter(val) {
      const temp = new Date(val.replace(/-/g, '/'))
      return Tools.DateTools.formatDate(temp, 'MM-dd hh:mm')
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';

.tips-item {
  position: relative;
  display: inline-block;
  max-width: 52%;
  min-height: 1.2rem;
  padding: 0.3rem 0.6rem;
  margin: 0 auto 1.8rem;
  transform: scale(calc(~'10 / 12'));
  background-color: rgba(0, 0, 0, .2);
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
      color: #2196F3;
    }
  }
}
</style>
