<!-- 转接成功的提示模态框 -->
<template>
  <div class="share-dialog">
    <x-dialog v-model="show">
      <div class="avatar"><img width=100% height=100% v-lazy="avatar"></div>
      <p class="confirm-bd-subtit">在线服务结束，感谢您的陪伴！</p>
      <button class="share-btn extend-click" @click="$emit('toShare')">去分享</button>
      <button class="close-btn extend-click" @click="$emit('cancelShare')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chahao"></use>
        </svg>
      </button>
    </x-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { XDialog, Icon } from 'vux'
  import { getCsAvatar } from '@/server/index.js'

  export default {
    components: {
      XDialog,
      Icon
    },
    computed: {
      ...mapGetters([
        'csInfo'
      ]),
      avatar() {
        return this.csInfo.csId && getCsAvatar(this.csInfo.csId)
        // return 'http://video-servertest.ihxlife.com:8083/api/v1/video/image/csHeader?id=00235530bcdd11e8bac9b72d08583910'
      }
    },
    props: {
      show: {
        type: Boolean
      }
    },
    data() {
      return {
        time: 3
      }
    }
  }
</script>

<style scoped lang="less">
@import '~@/common/style/theme.less';

.share-dialog {
  .weui-dialog {
    overflow: auto!important;
    .avatar {
      width: 6.8rem;
      height: 6.8rem;
      position: absolute;
      top: -3.8rem;
      left: 0;
      right: 0;
      margin: auto;
      padding: 0.4rem;
      background: linear-gradient(to right, #FF8C6A, #FF80A0);
      border-radius: 50%;
      overflow: hidden;
      img {
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .weui-icon-success {
      color: #FF959C;
      font-size: 2rem;
      line-height: 4.7rem;
    }
    p {
      line-height: 1.75;
    }
    .confirm-bd-subtit {
      color: #000000;
      font-size: 1.3rem;
      margin-bottom: 2.4rem;
      margin-top: 5.4rem;
    }
    .share-btn {
      width: 9rem;
      height: 3rem;
      background: linear-gradient(90deg, rgba(30, 130, 209, 1), rgba(112, 183, 240, 1));
      border-radius: 2rem;
      border: 0;
      margin: 0 0 2.6rem 0;
      padding: 0;
      color: @text-lighter;
      font-size: 1.3rem;
    }
    .close-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 2rem;
      height: 2rem;
      border: 0;
      margin: 0;
      padding: 0;
      background: rgba(255, 149, 156, 1);
      border-radius: 50%;
      .icon {
        width: 50%;
        height: 50%;
        transform: translateY(0.1rem);
        fill: @text-lighter;
      }
    }
  }
}
</style>
