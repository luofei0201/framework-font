<!-- 引导用户分享的弹层 -->
<template>
  <div class="container share-guide">
    <div class="step-one">
      <img src="/video/static/img/ios-guide1.png" style="width: 7.6rem">
    </div>
    <div class="step-two">
      <img src="/video/static/img/shareGuide.png" style="width: 22.2rem;">
    </div>
  </div>
</template>

<script>
  export default {
    methods: {

    }
  }
</script>

<style scoped lang="less">
  .share-guide {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 100vh;
    opacity: .6;
    background: #646464;
    z-index: 6000;
    img {
      vertical-align: middle;
    }
    .step-one {
      width: 100%;
      text-align: right;
      margin: .8rem 1.4rem 1.6rem 0;
    }
    .step-two {
      width: 100%;
      text-align: center;
    }
  }

</style>
