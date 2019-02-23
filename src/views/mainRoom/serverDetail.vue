<!-- 客服的个人中心 -->
<template>
  <div class="serverDetail container">
    <!-- 默认高度为180px, 如果设置aspect-ratio会根据宽度自动计算高度,如 :aspect-ratio="300/375" -->
<!--    <swiper auto dots-class="custom-bottom" dots-position="center" :aspect-ratio="160/375">
      <swiper-item class="swiper-img" v-for="(item, index) in personalDisplay" :key="index">
        <img :src="item" style="width: 100%;object-fit: fill;">
      </swiper-item>
    </swiper>
      &lt;!&ndash; <div class="flex-box-item">
        <p class="tips" @click="$emit('showShare', cuSerInfo.id, cuSerInfo.nickName)">偷偷的分享</p>
      </div> &ndash;&gt;
    </div>-->

    <div class="container-top">
      <div class="img" id="iconImg">
        <svg @click="showCsImg" class="icon icon-img" id="iconImg" aria-hidden="true"><use xlink:href="#icon-Group"></use></svg>
      </div>
      <div class="item-top">
        <div class="left">
          <div class="avatar">
            <img v-lazy="avatarImgSrc" :key="avatarImgSrc">
          </div>
        </div>

        <div class="right info">
          <p class="name">{{cuSerInfo.nickName}}</p>
          <P v-if="onlineCs">当前状态 &nbsp;&nbsp;<label class="status" :class="{'on-line': isCsOnline}">{{isCsOnline ? '在线' : '离线'}}</label></P>
          <p>服务总量 &nbsp;&nbsp;{{cuSerInfo.servTimes === null ? 0 : cuSerInfo.servTimes}}</p>
        </div>
      </div>

      <div class="flex-box" style="height: 5.4rem; margin-top: 2.5rem;">
        <div class="flex-box-item btn-container">
          <!--  @click.native="clickToLineUp" class="btn" :class="{'online': isCsOnline}" -->
          <x-button mini @click.native="enterLinUp" v-if="onlineCs" class="video-res-btn"
                    style="font-size: 1.2rem;color: #ffffff;background: #FF8D88;border: 1px solid #ffffff;">
            <svg class="icon extend-click" aria-hidden="true">
              <use xlink:href="#icon-zixun"></use>
            </svg>
            立即视频
          </x-button>
        </div>

        <div class="flex-box-item" id="myCs" v-if="myCs">
            <div class="bg-box" @click="addCs">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xin"></use>
              </svg>
              添加为专属客服
            </div>
        </div>
      </div>

      <div class="statistics">
        <div class="feedback">
          <span>好评率 {{cuSerInfo.feedback}}%</span>
        </div>
        <div class="flex-box-item count-like">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xin-hong1"></use>
          </svg>
          <span style="color: #bdbdbd;font-size: 1.5rem;">&nbsp;{{ cuSerInfo.likesCount }}</span>
        </div>
      </div>

      <div class="container-item flex-box" style="background: unset; margin-top: 3.5rem">
        <div class="flex-box-item">
          <p><span style="">{{ cuSerInfo.servYears || 0 }}</span>年</p>
          <p class="tips">服务年限</p>
        </div>
        <div class="flex-box-item">
          <p><span>{{cuSerInfo.giftCount || 0}}</span>份</p>
          <p class="tips">收到礼物</p>
        </div>
        <div class="flex-box-item">
          <p><span>{{serTimes}}</span>次</p>
          <p class="tips">为我服务</p>
        </div>
      </div>
    </div>

    <!-- the gifts which send to me -->
    <div class="container-item">
      <div class="container-item-tit">
        <span @click="showGifts" id="sendGiftBtn">送礼物</span>
        <span style="color: #909090;" @click="showGiftsRecord">
          <!--收到礼物-->
          <!--<label style="color: #FF959C;">{{giftNum}}</label> 份-->
          查看详情
          <svg class="icon icon-arrow" aria-hidden="true"><use xlink:href="#icon-ziyuanldpi"></use></svg>
        </span>
      </div>
      <send-gift style="height: unset;background-color: unset"
                 :giftType="giftType"
      ></send-gift>
    </div>

    <!-- labels  -->
    <div class="container-item">
      <p class="container-item-tit">对她印象</p>
      <div class="container-item-con">
        <label-btn class="label" :labelType="labelType"></label-btn>
      </div>
    </div>

    <!-- about me -->
    <div class="container-item about-me">
      <p class="container-item-tit">关于我</p>
      <div class="container-item-con ">
        <div class="about-me-item">
          <div class="tit">星座</div>
          {{cuSerInfo.starSign === null ? `保密` : cuSerInfo.starSign}}
        </div>
        <div class="about-me-item">
          <div class="tit">家乡</div>
          {{cuSerInfo.hometown === null ? `保密` : cuSerInfo.hometown}}
        </div>
        <div class="about-me-item">
          <div class="tit">爱好</div>
          {{cuSerInfo.hobby === null ? `保密` : cuSerInfo.hobby}}
        </div>
      </div>
    </div>

    <div class="btn-box">
      <a class="btn btn-back" @click="$router.back(-1)">返 回</a>
      <!--<a class="btn btn-lin-up" v-if="enterVideo" @click="enterLinUp">立即视频</a>-->
    </div>

    <!-- 页面底部给客服发送礼物 -->
    <div class="gift-send" v-show="giftSend" id="giftsSend">
      <send-gift style="height: unset;background-color: unset"
                 :giftType="allGifts"
                 @selectGift="selectGift"
      ></send-gift>
    </div>

    <!-- 自定义遮罩层 -->
    <div class="filter" v-show="filter">
      <!--关闭按钮股-->
      <div class="close">
        <a @click="closeFilter"><svg class="icon icon-close" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg></a>
      </div>
      <swiper id="swiperImg" v-model="currentImg" class="swiper" height="36rem" :show-dots="false" @on-index-change="changePage">
        <swiper-item class="swiper-img" height="300px" v-for="(item, index) in personalDisplay" :key="index">
          <img class="cs-img" :src="item" style="">
        </swiper-item>
      </swiper>
      <p class="name">{{cuSerInfo.nickName}}</p>
      <p class="tip">华夏客服</p>
      <div class="bar">
        <div class="bar-item" :class="{'active': imgIndex === (currentImg + 1)}"
             v-for="imgIndex in personalDisplay.length" :key="imgIndex"></div>
      </div>
      <p class="tag" style="font-size: 3.2rem;">{{currentImg + 1}}/{{personalDisplay.length}}</p>
    </div>
    <!--<div v-transfer-dom>-->
      <!--<previewer :list="personalDisplay" ref="previewer" @on-index-change="changeImg"></previewer>-->
    <!--</div>-->

    <!-- 发送礼物动画效果弹层 -->
    <transition name="fade">
      <section class="gift-section" v-if="giftAnimeView">
        <img :src="giftSrc">
      </section>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // import Tools from '@/common/js/tools'
  import { mapGetters } from 'vuex'
  import Tools from '@/common/js/tools'
  import { Swiper, SwiperItem, XButton, XCircle, TransferDom } from 'vux'
  import { ERR_OK, getCsInfo, csPhoto, getTimesForMe, getCsAvatar, giftSend } from '@/server/index.js'

  export default {
    name: 'server-detail',
    directives: {
      TransferDom
    },
    components: {
      Swiper,
      SwiperItem,
      XButton,
      XCircle,
      'SendGift': () => import('@/views/mainRoom/components/chat/send-gift'),
      'LabelBtn': () => import('@/views/mainRoom/components/label-btn')
    },
    data() {
     return {
       personalDisplay: [],
       cuSerInfo: {},
       serTimes: '0',
       // labelType: 'all',
       labelType: 'notAll',
       giftType: 'notAll',
       allGifts: 'all',
       giftNum: 0, // 收到的礼物的份数 unused
       giftSend: false,
       filter: false,
       giftAnimeView: false,
       giftSrc: null,
       currentImg: 0
     }
    },
    computed: {
      onlineCs() {
        return !this.$route.query.csType
      },
      avatarImgSrc() {
        return getCsAvatar(this.$route.query.cusSerId)
      },
      isCsOnline() {
        return this.$route.query.csStatus === '3' || this.$route.query.csStatus === '5'
      },
      myCs() {
        return this.$route.query.isMark
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted() {
      let self = this
      // const bigImg = document.getElementById('swiperImg')
      // const iconImg = document.getElementById('iconImg')
      const sendBtn = document.getElementById('sendGiftBtn')
      // const gifts = document.getElementById('giftsSend')

      document.addEventListener('click', (e) => {
        // 发送礼物组件隐藏
        // if (!gifts.contains(e.target))
          if (!sendBtn.contains(e.target)) self.giftSend = false
        // 点击图片外的其他区域 大图模式隐藏
        // if (!bigImg.contains(e.target) && !iconImg.contains(e.target)) self.filter = false
      })

      this.$nextTick(() => {
        this.getCsInfo() // 获取坐席信息
        this.timesForMe() // 获取为我服务次数
      })
    },
    methods: {
      // 获取客服信息
      async getCsInfo() {
        const cuSerId = this.$route.query.cusSerId
        // debugger
        // console.log('==============router' + document.referrer + '===============')
        const res = await getCsInfo(cuSerId)
        // debugger
        if (res.result.code === ERR_OK) {
          this.cuSerInfo = res.data
          const cuSerPic = res.data.photos

          for (var i in cuSerPic) {
            // this.getPic(cuSerPic[i].url)
            this.personalDisplay.push(csPhoto(cuSerPic[i].id))
          }
        } else {
          console.log('======================= error about get cuSerInfo')
        }
      },

      // 获取为我服务次数
      async timesForMe() {
        const userId = this.userInfo.userId
        const csId = this.$route.query.cusSerId
        const res = await getTimesForMe(csId, userId)

        if (res.result.code === ERR_OK) {
          this.serTimes = res.data.serTimes
        } else {
          console.log('========== there are some errors' + JSON.stringify(res.result))
        }
      },

      // 点击咨询按钮
      enterLinUp() {
        const csData = {
          id: this.$route.query.cusSerId,
          status: this.$route.query.csStatus,
          nickName: this.cuSerInfo.nickName
        }
        this.$emit('clickToLineUp', csData)
      },

      // 点击了送礼物
      showGifts() {
        this.giftSend = true
      },
      // 发送某个具体的礼物
      async selectGift(giftInfo) {
        console.log('发礼物辣：', giftInfo)
        this.showGiftAnime(giftInfo)
        // this.sendGiftMsg(giftInfo)
        const gift = {
          'sessionId': '',
          'userId': this.userInfo.userId,
          'userName': this.userInfo.userName,
          'csId': this.$route.query.cusSerId,
          'csName': this.cuSerInfo.realName,
          'giftId': giftInfo.giftId,
          'giftName': giftInfo.giftName
        }
        const res = await giftSend(gift)
        if (res.result.code === ERR_OK) {
          console.log('发送礼物成功')
        } else {
          console.log('there are some errors about send gifts' + JSON.stringify(res.result))
        }
      },
      // 发送礼物时的动画弹层
      async showGiftAnime(giftInfo) {
        this.showGiftView(giftInfo.giftId)
        await Tools.AsyncTools.sleep(4000)
        this.resetGiftView()
      },
      showGiftView(id) {
        this.giftAnimeView = true
        this.giftSrc = `/video/static/img/gift/${id}.gif`
      },
      resetGiftView() {
        this.giftAnimeView = false
        this.giftSrc = null
      },

      // 添加为专属客服
      addCs() {
        const csInfo = {
          'userId': this.userInfo.userId,
          'csId': this.$route.query.cusSerId
        }
        this.$emit('addCs', csInfo)
        const myCsBtn = document.getElementById('myCs')
        myCsBtn.style.display = 'none'
      },

      // showGiftsRecord
      showGiftsRecord() {
        this.$router.push({
          path: '/room/csGiftsList',
          query: {
            csId: this.$route.query.cusSerId
          }
        })
      },

      // 点击右上角小图标展示坐席生活照
      showCsImg() {
        // this.$refs.previewer.show(0)
        this.filter = true
      },
      closeFilter() {
        this.filter = false
      },
      changeImg(arg) {
        console.log(arg)
      },
      // 切换轮播页
      changePage(index) {
        this.currentImg = index
      }
    }
  }

</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';

  .container {
    height: unset;
    cursor: pointer;
    padding-bottom: 6.5rem;
    background: @bg-normal;
    box-sizing: border-box;
    .icon {
      width: 1.3rem;
      height: 1.2rem;
      /*fill: #FF959C;*/
      vertical-align: -0.15em
    }
    .container-top {
      background: url("/video/static/img/service/csDetailBg.png") no-repeat;
      box-sizing: border-box;
      background-size: contain;
      background-color: #ffffff;
      .img {
        padding: 2rem 1.5rem 0 0;
        text-align: right;
        .icon-img {
          width: 1.8rem;
          height: 1.6rem;
          cursor: pointer;
        }
      }
      .item-top {
        display: flex;
        position: relative;
        .left {
          margin-left: 4rem;
          .avatar {
            width: 10rem;
            height: 10rem;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
          }
        }
        .right {
          color: #ffffff;
          line-height: 2;
          font-size: 1.2rem;
          margin-left: 3.5rem;
          .name {
            font-size: 1.4rem;
            font-weight: 600;
          }
          .status {
            color: @label-line-light;
          }
          .status:before {
            content: '';
            display: inline-block;
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            background: @label-line-light;
            margin: 0 .3rem 0 0;
          }
          .on-line {
            color: #ffffff;
          }
          .on-line:before {
            background: #ffffff;
          }
        }
      }
      .flex-box {
        .btn-container {
          .icon {
            fill: #ffffff;
          }
        }
        .bg-box {
          width: 12.3rem;
          height: 4.5rem;
          color: #FF8787;
          font-size: 1.2rem;
          line-height: 5rem;
          margin-top: 1.2rem;
          background: url("/video/static/img/service/csBg1.png") no-repeat;
          background-size: contain;
          .icon {
            fill: #FF8787;
          }
        }
      }
      .statistics {
        display: flex;
        margin-top: -.2rem;
        justify-content: space-between;
        .feedback {
          width: 10rem;
          height: 7rem;
          line-height: 8rem;
          font-size: 1.2rem;
          margin-left: 3.6rem;
          background: url("/video/static/img/service/csFbBg.png") no-repeat;
          background-size: contain;
          span {
            display: inline-block;
            color: #ffffff;
            margin-left: 1.2rem;
            transform: rotate(10deg);
          }
        }
        .count-like {
          margin: 2rem 1.5rem 0 0;
          .icon {
            width: 1.5rem;
            height: 1.5rem;
            fill: #FF959C;
          }
        }
      }
    }
    .container-item {
      width: 100%;
      margin-top: 1rem;
      padding: 1.5rem 1rem 2rem;
      box-sizing: border-box;
      background: @bg-light;
      .container-item-tit {
        display: flex;
        color: #FF959C;
        font-size: 1.4rem;
        justify-content: space-between;
        .icon-arrow {
          width: 1rem;
          height: 1rem;
          vertical-align: .025em;
        }
      }
    }
    .about-me {
      .about-me-item {
        display: flex;
        color: @text-light;
        font-size: 1.2rem;
        padding: 1.2rem 0 0;
        .tit {
          flex: none;
          width: 10rem;
          color: @text-lighter-a;
        }
      }
    }
    .flex-box {
      display: flex;
      .flex-box-item {
        flex: 1;
        text-align: center;
        p {
          color: #FC8780;
          font-size: 1.2rem;
          span {
            font-size: 3.8rem;
            font-weight: 500;
          }
        }
        .tips {
          color: @text-lighter-a;
        }
      }
    }
    .btn-box {
      display: flex;
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 5rem;
      font-size: 1.8rem;
      color: @text-lighter;
      box-sizing: border-box;
      text-align: center;
      background: linear-gradient(to right, #FF905B, #FF7EAB);
      .btn {
        flex: 1;
        height: 3.5rem;
        color: @text-lighter;
        line-height: 3.5rem;
        align-self: center;
      }
    }
    .gift-send{
      position: fixed;
      bottom: 0;
      width: 100vw;
      background-color: #ffffff;
      box-shadow: 0 -3px 10px 0 rgba(147, 147, 147, 0.1);
    }
    .filter {
      z-index: 2;
      position: fixed;
      top: 0;
      width: 100vw;
      height: 100vh;
      cursor: pointer;
      background: rgba(0, 0, 0, .8);
      .close {
        padding: 1.5rem 1.5rem 0;
        text-align: right;
        .icon {
          height: 2.4rem;
          width: 2.4rem;
        }
      }
      .swiper {
        width: 80%;
        margin: 2vh auto 1.5em;
        .swiper-img {
          text-align: center;
          .cs-img {
            width: 73vw;
            object-fit: cover;
            margin: 0 auto;
            border-radius: 5px;
          }
        }
      }
      p {
        line-height: 1.5;
        color: #fff;
        text-align: center;
      }
      .name {
        font-size: 2.1rem;
      }
      .tip {
        color: rgba(187, 187, 187, 1);
        font-size: 1.6rem;
      }
      .bar {
        display: flex;
        width: 56vw;
        height: 3px;
        margin: 1.5rem auto;
        border-radius: 2px;
        background-color: #676767;
        .bar-item {
          flex: 1;
        }
        .active {
          height: 5px;
          align-self: center;
          border-radius: 3px;
          background-color: #ffffff;
          box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.3)
        }
      }
    }
  }

</style>
