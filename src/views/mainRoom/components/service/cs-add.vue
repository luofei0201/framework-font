<template>
  <div class="cs-add">
    <div class="cs-label-wrapper">
      <transition @enter="switchLabelFrame">
        <div class="cs-label-container" id="csLabelContainer" v-if="curLabelInfo">
          <div
            class="cs-label"
            ref="csLabel"
            @touchstart.capture="startSlide($event)"
            @touchmove.capture="slideMove($event)"
            @touchend.capture="endSlide($event)"
            :style="setRotate"> <!-- 限制边框范围及显示阴影 -->
            <div class="container">
              <div class="header">
                <img width=100% class="header-img" src="/video/static/img/chat/csAddBg.png">
                <div class="header-msg">
                  <div class="avatar" @click="enterSerCenter">
                    <img width=100% height=100% v-lazy="avatarImg">
                  </div>
                  <!-- @click="enterSerCenter" -->
                  <div class="nickname">{{curLabelInfo.nickName}}</div>
                </div>
              </div>
              <div class="video-btn">
                <button class="button video-res-btn" :class="{'on-line': isCsOnline}" @click.self="clickToLineUp(curLabelInfo)">
                  <svg class="icon extend-click" aria-hidden="true">
                    <use xlink:href="#icon-zixun"></use>
                  </svg>
                  立即视频
                </button>
              </div>
              <div class="cs-info">
                <ul>
                  <li class="cs-info-list">
                    <span class="title">当前状态</span>
                    <label class="state" :class="{'on-line': isCsOnline}"></label>
                    <span class="text with-state">
                      <label :class="{'on-line': isCsOnline}">{{isCsOnline ? '在线' : '离线'}}</label>
                    </span>
                  </li>
                  <li class="cs-info-list">
                    <span class="title">服务总量</span>
                    <span class="text">
                      <label>{{curLabelInfo.servTimes || 0}}次</label>
                    </span>
                  </li>
                  <li class="cs-info-list">
                    <span class="title">收到礼物</span>
                    <span class="text">
                      <label>{{curLabelInfo.giftCount || 0}}份</label>
                    </span>
                  </li>
                  <li class="cs-info-list">
                    <span class="title">客服标签</span>
                    <span class="text">
                      <label class="cs-label" v-for="(item,index) in csLabels" :key="index">{{item}}</label>
                      <span v-show="csLabels.length === 0">--</span>
                    </span>
                  </li>
                </ul>
              </div>
              <!-- <div class="footer-btn">设定喜欢的客服标签</div> -->
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="slide-tip">
      <div class="tip tip-left">
        <span class="label">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-zuohua"></use>
          </svg>
        </span>
        <span class="text">左滑切换</span>
      </div>
      <div class="tip tip-right">
        <span class="text">右滑添加</span>
        <span class="label">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-zuohua"></use>
          </svg>
        </span>
      </div>
    </div>
    <div class="slide-btn">
      <div class="btn btn-left" @click="hendleChange">换一个</div>
      <!--<div class="btn btn-right" @click="hendleAdd">添加为专属客服</div>-->
      <XButton class="btn btn-right" :gradients="['#FF8C6A', '#FF80A0']" @click.native="hendleAdd" :disabled="addDis">
        <svg class="icon extend-click" aria-hidden="true">
          <use xlink:href="#icon-xin"></use>
        </svg>
        添加为专属客服
      </XButton>
    </div>
    <div class="fload-tip">
      <div class="tip tip-left" id="fload-tip-left" :class="{'show-fload-tip-left': angle <= -targAngle}">
        <svg class="icon extend-click" aria-hidden="true">
          <use xlink:href="#icon-huanyipi"></use>
        </svg>
      </div>
      <!-- <div class="tip tip-right show-fload-tip-right" id="fload-tip-right" @click="$router.back(-1)"> -->
      <div class="tip tip-right" id="fload-tip-right" :class="{'show-fload-tip-right': angle >= targAngle}">
        <svg class="icon extend-click" aria-hidden="true">
          <use xlink:href="#icon-zhuanshukefu"></use>
        </svg>
        <badge :text="myCs.length"></badge>
      </div>
    </div>
    <!--  弹框提示客户最多只能添加3个专属客服 -->
    <div v-transfer-dom>
      <alert v-model="showTip" :title="'您已经添加了3个专属客服啦！'"></alert>
    </div>
    <!-- <alert v-model="showTip" :title="'您已经添加了3个专属客服啦！'"></alert> -->
  </div>
</template>

<script type="text/ecmascript-6">
import Tools from '@/common/js/tools'
import { XButton, Badge, Alert, TransferDomDirective as TransferDom } from 'vux'
import anime from 'animejs'
import { ERR_OK, addCs, queryCsInfo, getCsAvatar } from '@/server/index.js'
import { mapGetters } from 'vuex'

export default {
  name: 'cs-add',
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Badge,
    Alert
  },
  props: {
    myCs: {
      type: Array
    },
    updateCsItem: {
      type: Object
    }
  },
  data() {
    return {
      /**
       * scale_r:       // 卡片旋转半径
       * touch_start_x: // 用户touch的起始位置
       * angle:         // 卡片旋转角度
       * opacityNum:    // 卡片透明度
       * targAngle:     // 卡片旋转触发切换或者添加的角度
       * endAngle:      // 卡片旋转结束后的终止位置
       * @type {Number}
       */
      scale_r: 700,
      touch_start_x: 0,
      angle: 0,
      opacityNum: 1,
      targAngle: 10,
      endAngle: 40,
      curLabelInfo: null,
      csLabels: [],
      cslist: [
        // {
        //   cs_id: 123456,
        //   nickname: '丽丽',
        //   serviceTime: 12,
        //   gift: 123
        // },
        // {
        //   cs_id: 123456,
        //   nickname: '田老师红烧肉',
        //   serviceTime: 52372,
        //   gift: 2561
        // }
      ],
      // m_cslist: [], // 已添加的专属客服
      // m_csNum: this.$route.query.myCsNum, // 已有的专属客服的个数
      floadTipLeftAnimeCache: null,
      floadTipRightAnimeCache: null,
      showTip: false,
      addDis: false // 此时‘添加’按钮可点击
    }
  },
  computed: {
    avatarImg() {
      return getCsAvatar(this.curLabelInfo.id)
    },
    setRotate() {
      return `transform: rotateZ(${this.angle}deg); opacity: ${this.opacityNum};`
    },
    isCsOnline() {
      return this.curLabelInfo.status === '3' || this.curLabelInfo.status === '5'
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.getCsList()
  },
  methods: {
    updateCsList(item) {
      this.cslist.push(item)
    },
    clickToLineUp(cs) {
      this.$emit('goToLineUp', cs)
    },
    startSlide(event) {
      const e = event.targetTouches[0]
      // const label = this.$refs.csLabel
      this.touch_start_x = e.clientX
      console.log(`x: ${this.touch_start_x}`)
    },
    slideMove(event) {
      // debugger
      const e = event.targetTouches[0]
      const move = e.clientX - this.touch_start_x
      this.angle = (Math.asin(move / this.scale_r) * 180) / Math.PI
      if (Math.abs(this.angle) >= this.targAngle) {
        this.opacityNum = 1 - (this.angle - this.targAngle) / (this.endAngle - this.targAngle)
      }
      console.log(`angle: ${this.angle}`)
    },
    endSlide(event) {
      // const e = event.targetTouches[0]
      if (Math.abs(this.angle) <= this.targAngle) {
        // 复原
        this.angle = 0
      } else {
        if (this.angle > 0) {
          this.hendleAdd()
        } else {
          this.hendleChange()
        }
      }
    },
    async hendleChange() {
      // 切换
      this.angle = -this.endAngle
      // this.resetAngle()
      await Tools.AsyncTools.sleep(300)
      this.resetAngle()
      console.log('switchCS')
      await Tools.AsyncTools.sleep(10)
      this.switchCS()
    },

    // 当用户点击‘添加’按钮时触发的事件
    async hendleAdd() {
      // 添加
      this.angle = this.endAngle
      this.addDis = true // 此时的按钮再次点击无效
      // this.resetAngle()
      // 模拟请求服务，添加专属客服
      await Tools.AsyncTools.sleep(300)
      this.resetAngle()
      console.log('addCS')
      await Tools.AsyncTools.sleep(10)
      await this.addCS()
    },
    // 将当前客服添加为专属客服 获取当前专属客服的个数this.$route.query
    async addCS() {
      // debugger
      // 包装当前已添加的专属客服列表
      const temp = [this.cslist[0]].concat(this.myCs)
      // 数组去重
      Array.from(new Set(temp))
      if (temp.length > 3) {
        this.addDis = false // 此时‘添加’按钮可以重新点击
        this.showTip = true
        this.curLabelInfo = this.cslist[0]
        if (this.curLabelInfo.labels) {
          this.csLabels = this.curLabelInfo.labels.split(',')
        }
        return
      }

      // 用户Id
      const userId = this.userInfo.userId
      // 选中客服的ID
      const cuSerId = this.cslist[0].id
      const data = {
        'userId': userId,
        'csId': cuSerId
      }

      const res = await addCs(data)
      if (res.result.code === ERR_OK) {
        // console.log(JSON.stringify(res))
        this.$emit('resetMyCs', temp)
      } else {
        console.log('error about add the cS' + JSON.stringify(res))
      }
      this.resetCurLabelInfo()
      this.addDis = false // 此时‘添加’按钮可以重新点击
      this.$vux.toast.text('您已成功添加专属客服', 'default')
      // await Tools.AsyncTools.sleep(2000)
      this.$router.push('/room/cusServ/list')
      return 0
    },
    switchCS() {
      const temp = this.cslist[0]
      this.cslist.push(temp)
      this.resetCurLabelInfo()
      // this.avatarImg = getImgUrl(this.curLabelInfo.resultUrl)
      // this.avatarImg = this.getAvatar(this.curLabelInfo.id)
      // this.getAvatar(this.curLabelInfo.id)
      // this.avatarImg = getCsAvatar(this.curLabelInfo.id)
    },
    resetCurLabelInfo() {
      // 更新当前显示的客服
      this.cslist.splice(0, 1)
      this.curLabelInfo = this.cslist[0]
      // 更新当前客服标签，当前客服没有标签清空上一个
      if (this.curLabelInfo.labels) {
        this.csLabels = this.curLabelInfo.labels.split(',')
      } else {
        this.csLabels = []
      }
    },
    resetAngle() {
      this.curLabelInfo = null
      this.angle = 0
      this.opacityNum = 1
    },
    switchLabelFrame() {
      const extendBarframes = anime.timeline()
      extendBarframes.add({
        targets: '#csLabelContainer',
        scaleX: [0, 1],
        scaleY: [0, 1],
        duration: 200,
        easing: 'easeOutBack'
      }).add({
        targets: '#csLabelContainer .header',
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 150,
        offset: 150,
        easing: 'easeInOutExpo'
      }).add({
        targets: '#csLabelContainer .video-btn',
        scaleX: [0, 1],
        scaleY: [0, 1],
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 150,
        offset: 200,
        easing: 'easeInOutExpo'
      }).add({
        targets: '#csLabelContainer .cs-info-list',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: function(el, i) { return i * 30 },
        duration: 100,
        offset: 250,
        easing: 'easeInOutExpo'
      }).add({
        targets: '#csLabelContainer .footer-btn',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 100,
        offset: 350,
        easing: 'easeInOutExpo'
      })
    },

    // 分页获取客服列表(当前接口只能一次查询所有客服）
    async getCsList() {
      const page = 1
      const pageSize = -1
      const userId = this.userInfo.userId
      const listType = '2'
      const res = await queryCsInfo(page, pageSize, userId, listType)
      debugger
      // labels
      if (res.result.code === ERR_OK) {
        this.cslist = res.data.csList

        this.curLabelInfo = this.cslist[0]
        if (this.curLabelInfo.labels) {
          this.csLabels = this.curLabelInfo.labels.split(',')
        }
        // this.avatarImg = getCsAvatar(this.curLabelInfo.id)
        // console.log('===========客服列表:' + JSON.stringify(this.cslist))
      } else {
        console.log('error about query csInfo')
      }
    },

    // 点击专属客服头像进入客服的个人中心
    enterSerCenter() {
      this.$router.push({
        path: '/room/cusServ/serverDetail',
        query: {
          cusSerId: this.curLabelInfo.id,
          csStatus: this.curLabelInfo.status || 1,
          isMark: 'mark'
        }
      })
    }
  },
  watch: {
    updateCsItem(newVal) {
      if (newVal) {
        this.cslist.push(newVal)
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';

.cs-add {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: @bg-light-shadow;
  background-image: url('/video/static/img/chat/bg.jpg');
  background-size: cover;
  background-position: center;
  .cs-label-wrapper{
    width: 100%;
    height: 44rem;
    padding: 2.5rem;
    box-sizing: border-box;
    .cs-label-container {
      width: 100%;
      height: auto;
      .cs-label {
        width: 100%;
        border-radius: 1rem;
        background-color: @bg-light;
        box-shadow: 0 0.5rem 1.2rem 0 rgba(0, 0, 0, .05);
        overflow: hidden;
        transform-origin: 50% calc(~'50% + 700px');
        // &.labelTransitionTiming {
        //   transition: all .3s cubic-bezier(0.1, 0.4, 0.35, 1.48);
        // }
        transition: transform .3s cubic-bezier(0.1, 0.4, 0.35, 1.48);
        .container {
          .header {
            position: relative;
            width: 100%;
            height: 17.5rem;
            text-align: center;
            // background-image: url('~/video/static/img/chat/csAddBg.png');
            // background-size: 100%;
            .header-img {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              object-fit: cover;
            }
            .header-msg {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              width: 10.2rem;
              height: 12.6rem;
              z-index: 10;
              .avatar {
                width: 10.2rem;
                height: 10.2rem;
                border-radius: 50%;
                cursor: pointer;
                overflow: hidden;
                img {
                  object-fit: cover;
                }
              }
              .nickname {
                font-size: 1.4rem;
                padding-top: 1rem;
                color: @text-lighter;
              }
            }
          }
          .video-btn {
            width: 100%;
            text-align: center;
            .button {
              background-color: #fff;
              margin: 2rem 0 0 0;
              padding: 0;
              width: 7.8rem;
              height: 2.2rem;
              line-height: 2rem;
              border: 1px solid @label-line-light;
              border-radius: 1rem;
              color: @label-line-light;
              font-size: 1.2rem;
              .icon {
                width: 1.4rem;
                height: 1.4rem;
                vertical-align: text-bottom;
                fill: @label-line-light;
              }
              &.on-line {
                border: 1px solid rgba(255, 149, 156, .5);
                color: rgba(255, 149, 156, 1);
                .icon {
                  width: 1.4rem;
                  height: 1.4rem;
                  vertical-align: text-bottom;
                  fill: rgba(255, 149, 156, 1);
                }
              }
            }
          }
          .cs-info {
            width: 100%;
            padding: 4rem 2rem 2rem 4rem;
            color: @text-light;
            font-size: 1.2rem;
            box-sizing: border-box;
            ul {
              width: 100%;
              .cs-info-list {
                width: 100%;
                height: 1.8rem;
                line-height: 1.8rem;
                margin-bottom: .8rem;
                display: flex;
                justify-content:space-between;
                .title {
                  width: 5rem;
                  font-weight: 700;
                }
                .state {
                  width: 1.4rem;
                  height: 1.4rem;
                  margin-top: 0.2rem;
                  border-radius: 50%;
                  background-color: @label-line-light;
                  vertical-align: bottom;
                  &.on-line {
                    background-color: #56de47;
                  }
                }
                .text {
                  width: calc(~'100% - 6.4rem');
                  display: flex;
                  flex-wrap: nowrap;
                  &.with-state {
                    width: calc(~'100% - 9rem');
                    label {
                      color: @label-line-light;
                    }
                  }
                  label {
                    flex: 33.3%;
                    margin-right: 0.8rem;
                    &.on-line {
                      color: #56de47;
                    }
                    &.cs-label {
                      max-width: 6rem;
                      padding: 0.1rem 0.3rem;
                      box-sizing: border-box;
                      line-height: 1.4rem;
                      border: 0.1rem solid rgba(255, 149, 156, 1);
                      border-radius: 2.5rem;
                      color: rgba(255, 149, 156, 1);
                      text-align: center;
                    }
                  }
                }
              }
            }
          }
          .footer-btn {
            width: 100%;
            padding: 0 0 1.8rem 4rem;
            box-sizing: border-box;
            color: rgba(255, 149, 156, 1);
            font-size: 1.2rem;
          }
        }
      }
    }
  }
  .slide-tip {
    width: 100%;
    height: 4rem;
    padding: 0 7rem;
    box-sizing: border-box;
    color: @text-light;
    opacity: .7;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.4rem;
    .tip {
      flex: 50%;
      display: flex;
      align-items: center;
      .label {
        display: inline-block;
        width: 4rem;
        height: 4rem;
        .icon {
          width: 4rem;
          height: 4rem;
          fill: @text-light;
        }
      }
      .text {
        display: inline-block;
        font-size: 1.2rem;
        line-height: 1.2rem;
        font-weight: 400;
      }
      &.tip-left {
        justify-content: flex-start;
        .text {
          padding-left: 1.4rem;
        }
      }
      &.tip-right {
        cursor: pointer;
        justify-content: flex-end;
        .text {
          padding-right: 1.4rem;
        }
        .icon {
          transform: rotateY(180deg);
        }
      }
    }
  }
  .slide-btn {
    width: max-content;
    height: 4rem;
    margin: 0 auto;
    // box-sizing: border-box;
    display: flex;
    justify-content: center;
    .btn {
      border-radius: 2rem;
      font-size: 1.4rem;
      // line-height: 4rem;
      cursor: pointer;
      &.btn-left {
        padding: 0 2rem;
        background-color: #fff;
        color: @text-normal;
        line-height: 4rem;
        box-shadow: 0 0.5rem 1.2rem 0 rgba(0, 0, 0, .05);
        margin-right: 2rem;
      }
      &.btn-right {
        width: 15rem;
        margin: 0;
        padding: 0 1.2rem;
        background: linear-gradient(to right, #FF8C6A, #FF80A0);
        color: @text-lighter;
        text-align: left;
        .icon {
          width: 2rem;
          height: 2rem;
          vertical-align: middle;
          fill: @text-lighter;
        }
      }
    }
  }
  .fload-tip {
    position: absolute;
    top: 2rem;
    width: 100%;
    height: 3rem;
    z-index: 200;
    .tip {
      position: absolute;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      box-sizing: border-box;
      box-shadow: 0 0.5rem 1.2rem 0 rgba(0, 0, 0, .05);
      transition: all .5s cubic-bezier(0.2, 0, 0.4, 1);
      .icon {
        width: 3rem;
        height: 3rem;
      }
      &.tip-left {
        left: 2rem;
        border: solid .1rem #fff;
        background-color: rgb(247, 224, 234);
        transform: translateX(-50rem);
        opacity: 0;
        &.show-fload-tip-left {
          transform: translateX(0);
          opacity: 1;
        }
        .icon {
          padding: 0.3rem;
          width: 2.2rem;
          height: 2.2rem;
          fill: #fff;
        }
      }
      &.tip-right {
        right: 2rem;
        transform: translateX(50rem);
        opacity: 0;
        &.show-fload-tip-right {
          transform: translateX(0);
          opacity: 1;
        }
        .vux-badge {
          position: absolute;
          right: -0.3rem;
          bottom: -0.3rem;
          vertical-align: bottom;
          // line-height: 16px;
        }
      }
    }
  }
}
</style>
