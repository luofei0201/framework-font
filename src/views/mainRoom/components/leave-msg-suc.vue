<template>
  <main>
    <div class="icon-box">
      <svg class="icon" style="" aria-hidden='true'>
        <use xlink:href='#icon-zhuanjiechenggong'></use>
      </svg>
    </div>
    <p class="tips">留言成功</p>
    <p style="text-align: center;margin-top: 1.2rem">
      <a class="go-chat" @click="goChat">{{totalTime}}s返回聊天</a>
    </p>
  </main>
</template>

<script>
  export default {
    // name: "leaveMsgSuc.vue"
    data() {
      return {
        totalTime: 5
      }
    },
    mounted() {
      this.countDown()
    },
    methods: {
      countDown() {
        const self = this
        let clock = window.setInterval(() => {
          this.totalTime--
          if (this.totalTime === 1) {
            // 倒计时小于0时清除计时器
            window.clearInterval(clock)
            self.goChat()
          } else if (this.totalTime <= 0) {
            window.clearInterval(clock)
          }
        }, 1000)
      },
      goChat() {
        this.$router.back(-1)
        // this.$router.push('/room/chat')
        this.totalTime = 0
      }
    }
    }
</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';
main {
  width: 100%;
  min-height: 100vh;
  position: fixed;
  top: 0;
  z-index: 2;
  background: @bg-normal;
  .icon-box {
    text-align: center;
    .icon {
      width: 11rem;
      height: 11rem;
      margin: 10rem auto 5rem;
    }
  }
  .tips {
    color: @text-light;
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
  }
  .go-chat {
    cursor: pointer;
    color: #00f;
    font-size: 1.5rem;
  }
}
</style>
