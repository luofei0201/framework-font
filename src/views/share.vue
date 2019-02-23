<template>
  <div class="container share">
    <div class="top">
      <div class="outline">
        <div class="avatar">
           <img v-lazy="avatarImgSrc" :key="avatarImgSrc">
        </div>
      </div>
      <p class="name">客服{{name}}</p>
    </div>
    <div class="section">
      <div class="des">
        我刚刚在“华夏保险”官微体验了在线客服 客服小姐姐她颜值高、水平高、服务好，邀 请你也加入华夏保险VIP~
      </div>
      <div class="label-box">
        <label-btn :labelType="labelType"></label-btn>
      </div>
      <div class="rec">
        <div class="qr-code">
          <img src="/video/static/img/share/qr_code.jpg">
        </div>
        <div class="txt">
          扫描二维码关注官微 有更多惊喜等着你~
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import ConnectFail from "./mainRoom/components/video/connect-fail";
import {getCsAvatar} from '@/server/index.js'
export default {
  components: {
    'LabelBtn': () => import('@/views/mainRoom/components/label-btn')
  },
  data() {
    return {
      labelType: 'notAll'
    }
  },
  computed: {
    name() {
      return this.$route.query.csName
    },
    avatarImgSrc() {
      return getCsAvatar(this.$route.query.csId)
    }
  }
}
</script>

<style scoped lang="less">
.share {
  width: 100%;
  height: 100%;
  background: #F8F8F8;
  .top {
    color: #D6D7DC;
    line-height: 1.5;
    padding-top: 3rem;
    text-align: center;
    .outline {
      width: 11.4rem;
      height: 11.4em;
      margin: 0 auto;
      border-radius: 50%;
      border: 1px solid #FF959C;
      .avatar {
        width: 11rem;
        height: 11rem;
        border-radius: 50%;
        margin: .2rem;
        background: linear-gradient(to right, #FF8C6A, #FF80A0);
        img {
          width: 10.4rem;
          height: 10.4rem;
          border-radius: 50%;
          margin: .3rem auto;
        }
    }
    }
    .name {
      font-size: 1.2rem;
      margin-top: 1.2rem;
    }
  }
  .section {
    margin: 2.5rem 3.75rem;
    .des {
      width: 30rem;
      font-size: 1.4rem;
      color: #ffffff;
      padding: 2rem;
      box-sizing: border-box;
      border-radius: 5px;
      box-shadow: 0 2px 12px .3rem rgba(0, 0, 0, .1);
      background: linear-gradient(to right, #FF8C6A, #FF80A0);
    }
    .label-box {
      margin-top: 2.5rem;
    }
    .rec {
      display: flex;
      margin-top: 5rem;
      .qr-code {
        padding: 0 2.45rem 0 3rem;
        img {
          width: 8.2rem;
          height: 8.2rem;
        }
      }
      .txt {
        color: #FF959C;
        font-size: 1.2rem;
        padding: 2.4rem 3rem 0 2rem;
        background: url("/video/static/img/share/quota@2x.png") no-repeat;
        background-size: 2.4rem;
      }
    }
  }
}
</style>
