<template>
  <div class="dialog-item">
    <div class="cell fail-container" v-if="msg.msgType === dialogTypes.dialog_disconnect">
      <div class="fail-con">
        <img src="/video/static/img/chat/connect-fail@2x.png"
             srcset="/video/static/img/chat/connect-fail.png 1x,
                /video/static/img/chat/connect-fail@2x.png 2x,
                /video/static/img/chat/connect-fail@3x.png 3x">
        <div class="fail-con-left">
          <p class="tit">连接已中断</p>
          <p class="text">您已经有{{msg.dialogInfo.disconnectTime}}分钟没有回复信息，聊天自动中断！</p>
        </div>
      </div>
      <div class="fail-bottom border-1px-before">
        <a @click="reConnect">点击重新连接</a>
      </div>
    </div>
    <div class="cell suc-con" v-if="msg.msgType === dialogTypes.dialog_success">
      <div class="avatar">
        <img src="/video/static/img/avatar@2x.png">
        <p class="name">{{msg.dialogInfo.csName}}</p>
      </div>
      <div class="suc-con-left">
        <p class="tit" style="padding: .8rem 0 1rem 0">尊贵的{{msg.dialogInfo.rank}}客户</p>
        <div style="display: flex">
          <p class="text">人工客服切换成功！祝您沟通愉快！</p>
          <div class="diamond">
            <img src="/video/static/img/chat/diamond.png">
          </div>
        </div>
      </div>
   </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { dialogTypes } from '@/common/js/status'

export default {
  props: {
    msg: {
      type: Object
    }
  },
  data() {
    return {
      dialogTypes: dialogTypes
    }
  },
  methods: {
    reConnect() {
      console.log('重新连接')
      this.$emit('handleReConnectToOnlineChat')
    }
  }
}
</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';
  @import '~@/common/style/mixin.less';

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
    border-radius: .5rem;
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
        color: #2196F3;
        padding: .4rem 0;
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
          padding-top: .6rem;
        }
      }
      .diamond {
        margin-left: .8rem;
        img {
          width: 5.2rem;
          height: 2.9rem;
          /*margin-top: 4.8rem;*/
        }
      }
    }
  }

</style>
