<template>
  <div class="card-item">
    <div class="card-container" v-if="msg.msgType === cardTypes.bot_card">
      <div class="card">
        <div class="avatar">
          <img width=100% height=100% src="/video/static/img/chat/xiaohua@2x.png">
        </div>
        <div class="text">
          <span class="name">{{msg.cardInfo.nickName}}</span>
          智能客服
        </div>
      </div>
      <!-- <div class="label">{{msg.cardInfo.nickName}}进入会话竭诚为您服务~</div> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { cardTypes } from '@/common/js/status'

export default {
  props: {
    msg: {
      type: Object
    }
  },
  data() {
    return {
      cardTypes: cardTypes
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';

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
        border-radius:50%;
        overflow: hidden;
        margin: 0 auto;
        border: 0.3rem solid rgb(244, 244, 244);
        box-sizing: border-box;
        img {
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
          color: #FF959C;
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
</style>
