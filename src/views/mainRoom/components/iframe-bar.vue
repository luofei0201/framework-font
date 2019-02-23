<template>
  <div class="iframe-bar">
    <div class="iframe-title">
      <span>{{iframeTitle}}</span>
    </div>
    <div class="iframe-container">
      <iframe sandbox="allow-same-origin allow-scripts" class="iframe" id="targetIframe" :src="src" width=100% height=100%></iframe>
       <!-- :onload="getIframeTitle"  -->
    </div>
    <div class="close-btn extend-click" @click="$emit('closeIframe')">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-chahao"></use>
      </svg>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getIframeUrl } from '@/server/index.js'

export default {
  props: {
    iframeSrc: {
      type: String
    }
  },
  computed: {
    src() {
      return getIframeUrl(this.iframeSrc)
    }
  },
  data() {
    return {
      iframeTitle: ''
    }
  },
  mounted() {

  },
  methods: {
    getIframeTitle() {
      const iframe = document.getElementById('targetIframe')
      this.iframeTitle = iframe.contentWindow.document.title
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/mixin.less';

.iframe-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 94%;
  height: 86%;
  padding-bottom: 1.4rem;
  box-sizing: border-box;
  border-radius: 1.4rem;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 2rem 0.2rem rgba(0, 0, 0, 0.1);
  .iframe-title {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 3.2rem;
    background-color: rgb(57, 55, 59);
    color: #fff;
    font-size: 1.4rem;
    line-height: 3.2rem;
    z-index: 1000;
    text-align: center;
    span {
      display: block;
      padding: 0 4rem;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .iframe-container {
    position: relative;
    width: 100%;
    height: calc(~'100% - 3.2rem');
    // padding-top: 3.2rem;
    // box-sizing: border-box;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .close-btn {
    position: absolute;
    top: 5.2rem;
    right: 2rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    .icon {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 30%;
      height: 30%;
      fill: #fff;
    }
  }
}
</style>
