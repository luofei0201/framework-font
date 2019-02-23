<template>
  <div class="chat-header-bar">
    <div class="switch">
      <!-- <button class="item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wode"></use>
        </svg>
      </button> -->
      <button class="item center">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wode"></use>
        </svg>
      </button>
      <!-- <button class="item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wode"></use>
        </svg>
      </button> -->
    </div>
    <!-- <div class="rightBar">
      <button class="button">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wode"></use>
        </svg>
      </button>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="less">
@import '~@/common/style/theme.less';

.chat-header-bar {
  // position: relative;
  width: 100%;
  height: 5rem;
  background-color: @theme;
  z-index: 50;
  .switch {
    width: 5.4rem;
    height: 5.4rem;
    margin: 0 auto;
    transform: translateY(1.2rem);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      width: 5.4rem;
      height: 5.4rem;
      padding: 0;
      margin: 0;
      border: 0;
      border: .4rem solid @theme;
      border-radius: 50%;
      background-color: #ffdede;
      .icon {
        width: 50%;
        height: 50%;
        fill: #695e5e;
      }
      // &.center {
      //   height: 5rem;
      //   width: 5rem;
      // }
    }
  }
  .rightBar {
    position: absolute;
    top: 0;
    right: 0;
    width: 4.8rem;
    height: 4.8rem;
    .button {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      border: 0;
      background-color: @theme;
      .icon {
        width: 40%;
        height: 40%;
        fill: #fff;
      }
    }
  }
}
</style>
