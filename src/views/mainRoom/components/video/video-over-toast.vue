<template>
  <div class="video-over-toast" :class="{ 'status-bg': !status }">
    <div class="header">
      <div class="avatar">
        <img v-lazy="avatar">
      </div>
      <div class="name">{{csNick}}</div>
    </div>
    <div class="container">
      <h1 class="title">视频通话结束</h1>
      <div class="line border-1px-before"></div>
      <p class="desc time">{{time || '00:00'}}</p>
      <p class="desc">总通话时长</p>
    </div>
    <div class="footer" v-if="isFooterBtnShow">
      <!-- <button id="onMenuShare" class="share" type="button" v-if="isShareBtnShow" @click="$emit('showShare', csId, csName)">分享</button> -->
      <button class="back" type="button" @click="$emit('goBackToChat')">返回</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getCsAvatar } from '@/server/index.js'

export default {
  props: {
    csId: {
      type: String
    },
    csNick: {
      type: String
    },
    time: {
      type: String
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      isFooterBtnShow: false
    }
  },
  computed: {
    avatar() {
      return getCsAvatar(this.csId)
    }
  },
  mounted() {
    const enterVideoStatus = window.sessionStorage.getItem('enterVideoStatus')
    this.isFooterBtnShow = enterVideoStatus !== 'iOS-Safari'
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.video-over-toast {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  color: @text-lighter;
  &.status-bg {
    background-color: #444;
  }
  .header {
    width: 8.6rem;
    height: 14rem;
    margin: 3.6rem auto;
    display: inline-block;
    .avatar {
      width: 8.6rem;
      height: 8.6rem;
      border-radius: 50%;
      background: linear-gradient(to right, #FF8C6A, #FF80A0);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        padding: 0.3rem;
        box-sizing: border-box;
        object-fit: cover;
      }
    }
    .name {
      display: inline-block;
      vertical-align: top;
      font-size: 1.4rem;
      padding: 0 1rem;
      color: @text-lighter;
      margin: 0.7rem 0;
    }
  }
  .container {
    min-height: 20rem;
    .title {
      font-size: 2.4rem;
      font-weight: 400;
    }
    .line {
      width: 70%;
      height: 0.01rem;
      margin: 0.8rem auto;
      .border-1px-before(@text-lighter);
    }
    .desc {
      font-size: 1.6rem;
      line-height: 2.6rem;
      opacity: 0.8;
      font-weight: lighter;
      &.time {
        font-size: 2.2rem;
      }
    }
  }
  .footer {
    padding-bottom: 5rem;
    button {
      display: block;
      width: 15rem;
      height: 4rem;
      margin: 0 auto;
      padding: 0;
      border: 0;
      font-size: 1.4rem;
      color: @text-lighter;
      border-radius: 2rem;
      &.share {
        background: rgba(100, 100, 100, .3);
        margin-bottom: 1.6rem;
      }
      &.back {
        background: linear-gradient(90deg, rgba(255, 144, 91, 0.6), rgba(255, 126, 171, 0.6));
      }
    }
  }
}
</style>
