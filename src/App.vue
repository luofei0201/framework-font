<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
      <!--<main-room></main-room>-->
      <!--<share v-if="false"></share>-->
    </keep-alive>
  </div>
</template>

<script>
import { wxConfig } from '@/common/js/share'
import deviceConfig from './config/device'
import { beforeEnterVideo } from '@/common/js/beforeEnterVideo'
import { stringEx } from './config/extend'
import Tools from '@/common/js/tools'
// import { mapGetters, mapActions, mapMutations } from 'vuex'
// const wx = require('@/common/js/wx')
// import { mapGetters, mapMutations } from 'vuex'
// import Tools from '@/common/js/tools'
// import wxConfig from './config/wechat'

export default {
  name: 'App',
  // components: {
  //   'MainRoom': () => import('@/views/mainRoom'),
  //   'Share': () => import('@/views/share')
  // },
  computed: {
    // ...mapGetters([
    //   'theme'
    // ])
  },
  created() {
    // 取当前路由 # 之前的
    const url = window.location.href.split('#')[0]
    // 配置微信
    console.log(`配置微信接口传递的链接：url: ${url}`)
    wxConfig(url)
    // console.log(JSON.stringify(res))
    // console.log('11111111');

    deviceConfig()
    beforeEnterVideo()
    stringEx()

    // 关闭菜单项
    // this.addevent()
    // wx.showSafariMenu()
  },
  mounted() {
    const query = this.$route.query
    const realQuery = Tools.getRealQuery(window.location.href)
    const openId = query.openId || realQuery.openId || realQuery.openid || 'visitor'
    const origin = query.origin || realQuery.origin || realQuery.attach || 'WE'
    console.log(realQuery)
    this.$router.replace({path: `/room?openId=${openId}&origin=${origin}`})
  },
  methods: {
    // ...mapMutations({
    //   setTheme: 'SET_THEME'
    // }),
    // ...mapActions([
    //   'systemConfig'
    // ])
  },
  activated() {
    this.$setgoindex()
  }
}
</script>

<style type="text/css" lang="less">
/*- 引入关闭按钮 -*/
/*@import '~vux/src/styles/close.less';*/
/** env = windows **/
::-webkit-input-placeholder {
  font-family: -apple-system-font, "Helvetica Neue", sans-serif;
}
input, textarea{
  -webkit-appearance: none;
  outline: none;
}
button {
  outline: none;
}
ul, li, ol, dl {
  list-style-type: none;
}
html, body {
  width: 100%;
  height: 100%;
  /* line-height: 1.6; */
  font-family: -apple-system-font, "Helvetica Neue", sans-serif, "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei";
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  /*font-size: 62.5%;*/
}
a {
  // color: rgb(82, 144, 239);
  color: unset;
  -webkit-touch-callout: none;
}
/*防止iPhone X 底部小黑条遮挡页面最底部内容的情况*/
body {
  padding-bottom: constant(safe-area-inset-bottom);
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app .weui-dialog {
  opacity: .85;
  overflow: auto;
  border-radius: 10px;
  .weui-dialog__ft {
    .weui-dialog__btn, .weui-dialog__btn_default, .weui-dialog__btn_primary {
      color: #2196f3;
    }
  }
}

/* 标签轮播图圆点的样式 .popup-main .eva-more */
.label-btn-box > .vux-slider > .vux-indicator > a > .vux-icon-dot.active {
  background-color: #FF959C!important;
  transform: scale(.7, .7);
}
.label-btn-box >.vux-slider > .vux-indicator > a > .vux-icon-dot {
  border: 1px solid #FF959C;
  border-radius: 50%;
  background-color: #ffffff !important;
  transform: scale(.7, .7);
}
/* 个人中心客服照片轮播 */
/*.filter > .vux-slider > .vux-indicator > a > .vux-icon-dot.active {*/
  /*background-color: #ffffff !important;*/
  /*transform: scale(1.5, 1.5);*/
/*}*/

/*.filter > .vux-slider > .vux-indicator > a > .vux-icon-dot {*/
  /*border: 1px solid #ffffff;*/
  /*border-radius: 100%;*/
  /*margin: 0 .5rem;*/
  /*transform: scale(1.5, 1.5);*/
  /*!*background-color: #ffffff !important;*!*/
/*}*/

/*-,评价组件星星颜色-*/
.popup-main .vux-rater-box {
  fill: #bfbfbf;
}

.popup-main .is-active {
  fill: #FEC656;
}

/*---------对Nexus5做响应式------------*/
@media screen and(min-width: 321px) and(max-width: 360px) {
  html {
    font-size: 9.6px !important;
  }
}

/*-------对iPhone5做响应式-----------*/
@media screen and(max-width: 321px) {
  html {
    font-size: 8.5333px !important;
    // font-size: 41.92637px !important; // font-size:41.857137680 px !important;
  }
}

/*---------对iPhone6做响应式---------*/
@media screen and(min-width: 361px) and (max-width: 376px) {
  html {
    font-size: 10px !important;
  }
}

/*-------对iPhone6 plus做响应式------*/
@media screen and(min-width: 376px) and (max-width: 475px) {
  html {
    font-size: 11.04px !important;
  }
}

/*---------对微信浏览器做的响应式-------*/
@media screen and(min-width: 500px) and (max-width: 680px) {
  html {
    font-size: 13.8889px !important;
  }
}

@media screen and(min-width: 680px) {
  html {
    font-size: 17px !important;
  }
}

/*------------------pc端--------------*/
@media screen and(min-width: 768px) {
  html {
    font-size: 11.2px !important;
  }
}

.vux-alert, .vux-confirm {
  .vux-x-dialog {
    .weui-mask {
      z-index: 2000;
    }
    .weui-dialog {
      width: 70%;
      border-radius: 9px;
      .weui-dialog__hd {
        padding: 1.8em 1.6em 0.5em;
        .weui-dialog__title {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }
      .weui-dialog__bd {
        min-height: unset!important;
      }
      .weui-dialog__ft {
        line-height: 44px;
        a {
          color: rgba(33, 150, 243, 1)!important;
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
