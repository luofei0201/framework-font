<template>
  <main class="main">
    <!-- 点击右上角的手指 -->
    <!-- <div class="step-one">
      <img src="/video/static/img/ios-guide1.png">
    </div> -->
    <!-- 文字提示 -->
    <!-- <div class="step-two">
      <img src="/video/static/img/ios-guide2.png">
    </div> -->
    <!-- <div class="step-thr">
      <img src="/video/static/img/ios-guide3.png">
    </div>
   <div class="step-four">
     <img src="/video/static/img/ios-guide1.png">
   </div>
    <div class="step-fif">
      <img style="" src="/video/static/img/ios-guide4.png">
    </div> -->
  </main>
</template>

<script>
  export default {
    // name: "ios-guide.vue"
  }
</script>

<style scoped lang="less">
  .main {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    // opacity: .85;
    // background: #626262;
    background-image: url('/video/static/img/ios-guide.png');
    background-size: cover;
    background-position: center;
    z-index: 6000;
    .step-one {
      text-align: right;
      img {
        width: 7.6rem;
        margin: 1rem 1.5rem 0;
        vertical-align: middle;
      }
    }
    .step-two, .step-thr {
      text-align: center;
      img {
        width: 18rem;
      }
    }
    .step-thr {
      position: absolute;
      bottom: 19.7rem;
      width: 100%;
    }
    .step-four {
      position: absolute;
      bottom: 9.5rem;
      img {
        display: block;
        width: 8.7rem;
        transform: rotate(180deg);
        margin: 3rem 0 0 7rem;
      }
    }
    .step-fif {
      position: absolute;
      bottom: 7.8rem;
      img {
        width: 4.3rem;
        margin: 0 0 0 4.4rem;
      }
    }
  }
</style>
