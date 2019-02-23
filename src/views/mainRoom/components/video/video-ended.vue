<!-- 通话结束页面 -->
<template>
  <div class="video-ended">
    <div class="container">
      <div class="avatar">
        <img src="/video/static/img/avatar@2x.png">
      </div>
      <p>{{name}}</p>
      <p style="font-size: 2.4rem;margin-top: 5rem;">视频通话结束</p>
      <div style="width: 22.5rem;height: .1rem;margin: 1rem auto; border-color: #fff;background: #fff;"></div>
      <p style="font-size: 2rem">{{callDuration}}</p>
      <p style="font-size: 1.5rem">通话总时长</p>
      <div class="btn-box">
        <x-button :gradients="['#FF8C6A', '#FF80A0']" style="width: 15rem; opacity: .3;">返 回</x-button>
        <x-button @click.native="shareGuide" style="width: 15rem;color: #fff; opacity: .3;background: #646464;">分 享</x-button>
      </div>
    </div>
    <share-guide
      v-if="showGuide"
      @hideShareGuide="hideShare"
    ></share-guide>
  </div>
</template>

<script>
  import { XButton } from 'vux'

  export default {
    // name: "video-ended.vue"
    components: {
      XButton,
      'ShareGuide': () => import('@/views/mainRoom/components/share-guide')
    },
    data() {
      return {
        name: '丽丽',
        callDuration: '1:30:20',
        showGuide: false
      }
    },
    methods: {
      shareGuide() {
        this.showGuide = true
      },
      hideShare() {
        this.showGuide = false
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';

  .container {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 100vh;
    text-align: center;
    box-sizing: border-box;
    background: rgba(163, 158, 170, .3);
    .avatar {
      width: 9rem;
      height: 9rem;
      line-height: 9rem;
      margin: 3.6rem auto;
      border-radius: 50%;
      text-align: center;
      background: linear-gradient(to right, #FF905B, #FF7EAB);
      img {
        width: 8.5rem;
        height: 8.5rem;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    p {
      line-height: 1;
      font-size: 1.4rem;
      color: @text-lighter;
      margin-top: 1rem;
    }
    .btn-box {
      margin-top: 14rem;
    }
  }

</style>
