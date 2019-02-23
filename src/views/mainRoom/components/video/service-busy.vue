<template>
  <section>
    <div class="img-box"><img src="/video/static/img/lineing.png"></div>
    <div class="tips">
      <p class="tips-big">客服正忙，请稍后重试</p>
      <p>可点击右下按钮寻找新客服</p>
    </div>
    <flexbox>
      <flexbox-item :gutter="5">
        <x-button :gradients="['#FF8C6A', '#FF80A0']" style="width: 12.5rem;">取 消</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button :gradients="['#1D62F0', '#19D5FD']" style="width: 12.5rem;">其他客服</x-button>
      </flexbox-item>
    </flexbox>
  </section>
</template>

<script>
  import { Flexbox, FlexboxItem, XButton } from 'vux'
  export default {
    // name: "service-busy.vue"
    components: {
      Flexbox,
      FlexboxItem,
      XButton
    }
  }
</script>

<style scoped lang="less">
  section {
    width: 100%;
    min-height: 100vh;
    position: fixed;
    top: 0;
    z-index: 2;
    background: #F4F4F4;
    padding: 10rem 0 0;
    .vux-flexbox {
      margin: 9rem 0 0;
    }
    .img-box {
      width: 8.8rem;
      height: 8.8rem;
      margin: 0 auto;
      text-align: center;
      border-radius: 50%;
      background-color: #D7DCE3;
      img {
        width: 60%;
        height: 60%;
        margin: 20%;
        vertical-align: middle;
      }
    }
    .tips {
      color: #ADADAD;
      font-size: 1.4rem;
      margin: 4.0rem 0 0;
      text-align: center;
      .tips-big {
        color: #9E9E9E;
        font-weight: bold;
        font-size: 2rem;
        margin-bottom: 1.6rem;
      }
    }
  }
</style>
