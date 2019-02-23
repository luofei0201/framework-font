<template>
  <div class="send-express">
    <div class="menu-nav">
      <div class="nav-list">
        <tab :line-width="99" bar-active-color="#f4f4f4">
          <tab-item :selected="currIndex === 0" @on-item-click="currIndex = 0">
            <div class="menu-nav-item">
              <svg class="icon extend-click" aria-hidden="true">
                <use xlink:href="#icon-lishibiaoqing"></use>
              </svg>
            </div>
          </tab-item>
          <tab-item :selected="currIndex === 1" @on-item-click="currIndex = 1">
            <div class="menu-nav-item">
              <svg class="icon extend-click" aria-hidden="true">
                <use xlink:href="#icon-biaoqing-"></use>
              </svg>
            </div>
          </tab-item>
          <tab-item :selected="currIndex === 2" @on-item-click="currIndex = 2" :disabled="isRobotChat">
            <div class="menu-nav-item">
              <div class="menu-nav-xiaohua">
                <img width=100% height=100% :src="xiaohuaItemImg">
              </div>
              <!-- <svg class="icon extend-click" aria-hidden="true">
                <use xlink:href="#icon-wode"></use>
              </svg> -->
            </div>
          </tab-item>
        </tab>
      </div>
      <div class="nav-delete">
        <div class="menu-nav-item">
          <div class="menu-nav-delete" @click="$emit('deleteBtn')">
            <svg class="icon extend-click" aria-hidden="true">
              <use xlink:href="#icon-chahao"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="page-area">
      <div class="history-emoji" v-if="currIndex === 0">
        <p v-if="!express[0].list.length" class="history-text">您当前还未发过表情</p>
        <ul v-else>
          <li
            class="history-item-li"
            v-for="(item, index) in express[0].list"
            v-html="item.code"
            :key="index"
            @click="selectEmoji(item.code)"
          ></li>
        </ul>
      </div>
      <div class="emoji-swiper" v-if="currIndex === 1">
        <swiper dots-position="center">
          <swiper-item v-for="(page, index) in express[1].list" :key="index">
            <ul>
              <li
                class="swiper-item-li"
                v-for="list in page.pageList"
                v-html="list.code"
                :key="list.id"
                @click="selectEmoji(list.code)"
              ></li>
            </ul>
          </swiper-item>
        </swiper>
      </div>
      <div class="xiaohua-express" v-if="currIndex === 2">
        <swiper dots-position="center">
          <swiper-item v-for="(page, index) in express[2].list" :key="index">
            <ul>
              <li
                class="swiper-item-li"
                v-for="(item, index) in page.pageList"
                :key="`xiaohua_${index}`"
                @click="$emit('sendXiaoHua', item.id)">
                <send-extend-item
                  :icon="`/video/static/img/express/${item.id}.gif`"
                ></send-extend-item>
              </li>
            </ul>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
import { emojiMap } from '@/common/js/emojiMap'
import { roomStatus } from '@/common/js/status'

export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    'SendExtendItem': () => import('@/views/mainRoom/components/chat/send-extend-item')
  },
  props: {
    inputPos: {
      type: Number
    }
  },
  computed: {
    ...mapGetters([
      'roomMode'
    ]),
    isRobotChat() {
      return this.roomMode === roomStatus.AIChat
    },
    xiaohuaItemImg() {
      if (this.isRobotChat) {
        return '/video/static/img/chat/xiaohua_disable@2x.png'
      } else {
        return '/video/static/img/chat/xiaohua@2x.png'
      }
    }
  },
  data() {
    return {
      currIndex: 1,
      express: [
        {
          name: 'history',
          list: [
            // {
            //   code: '&#x1F600;',
            //   id: 0
            // }
          ]
        },
        {
          name: 'emoji',
          list: []
        },
        {
          name: 'xiaohua',
          list: [
            {
              id: 'chang_qing_shu'
            },
            {
              id: 'fu_lin_men'
            },
            {
              id: 'jia_you'
            },
            {
              id: 'ke_hu_li_yi_zhi_shang'
            },
            {
              id: 'me_me_da'
            },
            {
              id: 'xie_xie'
            },
            {
              id: 'ye_ji_chang_hong'
            },
            {
              id: 'zan'
            },
            {
              id: 'zao_shang_hao'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this._setEmojiHistory()
      this.express[1].list = this._normalizeExpressList({
        baseList: emojiMap,
        row: 3,
        col: 8
      })
      this.express[2].list = this._normalizeExpressList({
        baseList: this.express[2].list,
        row: 2,
        col: 4
      })
    })
  },
  methods: {
    _normalizeExpressList({ baseList, row, col }) {
      const singleNum = row * col // 一页的表情个数
      const totalPage = (baseList.length / singleNum >>> 0) + 1 // 页数
      let newList = []
      for (let i = 0; i < totalPage; i++) {
        const list = baseList.slice(i * singleNum, (i + 1) * singleNum)
        const temp = {
          page: i + 1,
          pageList: list
        }
        newList.push(temp)
      }
      return newList
    },
    _setEmojiHistory() {
      const localStorage = window.localStorage
      let temp = JSON.parse(localStorage.getItem('emoji_cache'))
      if (temp) {
        temp.forEach((item) => {
          this.express[0].list.push({
            code: item
          })
        })
      }
    },
    selectEmoji(code) {
      this.$emit('selectEmojiWithCode', code)
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.send-express {
  position: relative;
  width: 100%;
  height: 100%;
  .menu-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4.6rem;
    background-color: @bg-light;
    display: flex;
    justify-content: space-between;
    .nav-list {
      width: 13.8rem;
      height: 4.6rem;
      .vux-tab-wrap {
        width: 100%;
        height: 100%;
        padding-top: 0;
        .vux-tab-container {
          height: 100%;
          .vux-tab {
            height: 100%;
            .menu-nav-item {
              position: absolute;
              z-index: 5;
              width: 4.6rem;
              height: 4.6rem;
              .menu-nav-xiaohua {
                width: 2.4rem;
                height: 2.4rem;
                margin: 1.1rem;
                border-radius: 50%;
                overflow: hidden;
                img {
                  display: block;
                  object-fit: cover;
                }
              }
              .icon {
                display: block;
                width: 2.4rem;
                height: 2.4rem;
                padding: 1.1rem;
                fill: #000;
                background-color: transparent;
              }
            }
            .vux-tab-ink-bar {
              z-index: 0;
            }
          }
        }
      }
    }
    .nav-delete {
      .menu-nav-item {
        width: 4.6rem;
        height: 4.6rem;
        .menu-nav-delete {
          position: relative;
          width: 2.8rem;
          height: 2rem;
          margin: 1.3rem 0 1.3rem 1rem;
          background-color: #FF444A;
          border-top-right-radius: .3rem;
          border-bottom-right-radius: .3rem;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -1.6rem;
            border-right: #FF444A solid 0.8rem;
            border-left: #fff solid 0.8rem;
            border-top: #fff solid 1rem;
            border-bottom: #fff solid 1rem;
            width: 0;
            height: 0;
          }
          .icon {
            display: block;
            width: 1rem;
            height: 1rem;
            padding: 0.5rem 0 0.5rem 0.8rem;
            fill: #fff;
          }
        }

      }
    }
  }
  .page-area {
    width: 100%;
    height: 100%;
    padding-bottom: 4.6rem;
    box-sizing: border-box;
    .history-emoji {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 2.8rem 2.6rem;
      box-sizing: border-box;
      .history-text {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        font-size: 1.4rem;
        height: 1.4rem;
        color: @text-normal;
      }
      ul {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .history-item-li {
          // width: 2.4rem;
          // height: 2.4rem;
          font-size: 2.4rem;
          padding: .9rem 0;
          flex-basis: 12.5%;
          text-align: center;
        }
      }
    }
    .emoji-swiper, .xiaohua-express {
      width: 100%;
      height: 100%;
      .vux-slider {
        width: 100%;
        height: 100%;
        .vux-swiper {
          width: 100%;
          height: 100%!important;
        }
      }
    }
    .emoji-swiper {
      .vux-swiper-item {
        width: 100%;
        height: 100%;
        padding: 2.8rem 2.6rem;
        box-sizing: border-box;
        ul {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .swiper-item-li {
            font-size: 2.4rem;
            padding: .9rem 0;
            flex-basis: 12.5%;
            text-align: center;
          }
        }
      }
    }
    .xiaohua-express {
      .vux-swiper-item {
        width: 100%;
        height: 100%;
        padding: 1.8rem 2.2rem;
        box-sizing: border-box;
        ul {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .swiper-item-li {
            font-size: 2.4rem;
            padding-bottom: 1.4rem;
            flex-basis: 25%;
            text-align: center;
          }
        }
      }
    }
    .vux-indicator {
      .vux-icon-dot {
        &.active {
          background-color: @text-light;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
