<template>
  <div class="send-file">
    <send-extend-item
      v-for="(item, index) in fileItems"
      :key="index"
      :mode="item.mode"
      :icon="item.icon"
      :text="item.text"
    ></send-extend-item>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
    'SendExtendItem': () => import('@/views/mainRoom/components/chat/send-extend-item')
  },
  data() {
    return {
      fileItems: [
        {
          icon: '#icon-wode',
          text: '照片',
          mode: 'file'
        },
        {
          icon: '#icon-wode',
          text: '文件',
          mode: 'file'
        }
      ]
    }
  }
}
</script>

<style lang="less">
.send-file {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 2.4rem 1.8rem;
  .send-extend-item {
    height: 9.6rem;
    flex-basis: 25%;
    text-align: center;
  }
}
</style>
