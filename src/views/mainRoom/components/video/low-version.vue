<template>
  <section class="section">
    <main class="main">
      <div class="img-box"><img src="/video/static/img/systemUpgrade.png"></div>
      <div class="tips">
        <p>非常抱歉，当前版本过低，无法接入视频客服</p>
        <p>请把手机系统升级为11.0版本或以上</p>
      </div>
      <p class="update">升级方案：<label>xxxxxxx</label> </p>
      <x-button :gradients="['#FF8C6A', '#FF80A0']" style="width: 12rem; margin-top: 6rem;" @click="goBack">取 消</x-button>
    </main>
  </section>
</template>

<script>
  import { XButton } from 'vux'
  export default {
    // name: "low-version"
    components: {
      XButton
    },
    methods: {
      goBack() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">
  .section {
    width: 100%;
    min-height: 100vh;
    position: fixed;
    top: 0;
    z-index: 6000;
    background: #F4F4F4;
    .main {
      padding: 10rem 0 0;
      .img-box {
        width: 18.39rem;
        margin: 0 auto;
        text-align: center;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .tips, .update {
        color: #ADADAD;
        line-height: 1.5;
        font-size: 1.2rem;
        text-align: center;
      }
      .tips {
        margin-top: 3.88rem;
      }
      .update {
        margin-top: 2rem;
        label {
          color: #2196F3;
        }
      }
    }
  }
</style>
