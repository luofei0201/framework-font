<!-- 转接成功的提示模态框 -->
<template>
  <div class="connect-success">
    <x-dialog v-model="queueSuccess">
      <div class="avatar"><img width=100% height=100% v-lazy="avatar"></div>
      <p class="confirm-bd-tit" style="">
          <icon class="icon" type="success"></icon> 转接成功！
      </p>
      <p class="confirm-bd-subtit">本次视频由客服{{this.csInfo.csNick}}为您服务</p>
      <!--<p class="confirm-tips">{{name}}{{num ? `已经为您服务过${num}次`: '首次为您服务'}}</p>-->
      <!-- <p class="confirm-tips" v-if="num">{{this.csInfo.csName}}已经为您服务过<label class="num">{{num}}</label>次</p>
      <p class="confirm-tips" v-else>{{this.csInfo.csName}}首次为您服务</p> -->
    </x-dialog>
    <!-- <div class="countdown" v-show="queueSuccess">
      <countdown v-model="time" :start="queueSuccess"></countdown>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { XDialog, Icon } from 'vux'
  import { queueStatus } from '@/common/js/status'
  import { getCsAvatar } from '@/server/index.js'

  export default {
    components: {
      XDialog,
      Icon
    },
    computed: {
      ...mapGetters([
        'queueMode',
        'csInfo'
      ]),
      avatar() {
        return this.csInfo.csId && getCsAvatar(this.csInfo.csId)
        // return 'http://video-servertest.ihxlife.com:8083/api/v1/video/image/csHeader?id=00235530bcdd11e8bac9b72d08583910'
      },
      queueSuccess: {
        set() {

        },
        get() {
          return this.queueMode.status === queueStatus.queueSuccess
        }
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
.connect-success {
  letter-spacing: .1rem;
  .weui-dialog {
    overflow: auto!important;
    .avatar {
      width: 8rem;
      height: 8rem;
      position: absolute;
      top: -4rem;
      left: 0;
      right: 0;
      margin: auto;
      padding: 0.5rem;
      background: linear-gradient(to right, #FF8C6A, #FF80A0);
      border-radius: 50%;
      overflow: hidden;
      img {
        border-radius: 50%;
        vertical-align: middle;
        object-fit: cover;
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
    .confirm-bd-tit {
      height: 4rem;
      color: #000000;
      line-height: 4.7rem;
      font-size: 1.6rem;
      font-weight: bold;
      text-align: center;
      margin-top: 5rem;
    }
    .confirm-bd-subtit {
      color: #000000;
      font-size: 1.3rem;
      margin-bottom: 4rem;
    }
    .confirm-tips {
      font-size: 1.2rem;
      .num {
        color: #ff444a;
      }
    }
  }
  .countdown {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
    width: 7.2rem;
    height: 7.2rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    font-size: 4.4rem;
    line-height: 7.2rem;
    text-align: center;
    color: #fff;
    font-weight: lighter;
  }
}
</style>
