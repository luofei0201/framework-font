<template>
  <section class="section">
    <!--<div class="top"></div>-->
    <main class="main">
      <div class="img-box"><img src="/video/static/img/networkBusy.png"></div>
      <p class="tip">抱歉网络繁忙，视频连接失败，请稍后重连！</p>
      <flexbox>
        <flexbox-item :gutter="3">
          <x-button :gradients="['#FF8C6A', '#FF80A0']" style="width: 12.5rem;">取 消</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button :gradients="['#1D62F0', '#19D5FD']" style="width: 12.5rem;">重 连</x-button>
        </flexbox-item>
      </flexbox>
    </main>
  </section>
</template>

<script>
  import { XButton, Flexbox, FlexboxItem } from 'vux'
  export default {
    // name: "connect-fail"
    components: {
      XButton,
      Flexbox,
      FlexboxItem
    }
  }
</script>

<style scoped lang="less">
  .section {
    width: 100%;
    min-height: 100vh;
    position: fixed;
    top: 0;
    z-index: 2;
    background: #F4F4F4;
    .vux-flexbox {
      margin: 9rem 0 0;
    }
    .main {
      padding: 10rem 0 0;
      .img-box {
        width: 18.6rem;
        margin: 0 auto;
        text-align: center;
        border-radius: 50%;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .tip {
        color: #ADADAD;
        line-height: 1.25;
        font-size: 1.4rem;
        margin: 5.0rem 0 0;
        text-align: center;
      }
    }
  }
</style>
