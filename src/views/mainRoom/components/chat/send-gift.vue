<template>
  <div
    class="send-gift"
    :style="setTheme">
    <!-- 当坐席收到的礼物数大于99 时显示‘99+’ （不推荐正则嵌套的写法...）-->
    <send-extend-item
      v-for="(item, index) in giftMap"
      :key="index"
      :icon="`/video/static/img/gift/${item.giftId}.png`"
      :text="item.giftName + ' ' + (item.giftCount === undefined ? '' : (item.giftCount > 99 ? '99+' : item.giftCount))"
      @click.native.prevent="$emit('selectGift', item)"
    ></send-extend-item>
    <!-- 当客服还没有收到礼物时 -->
    <div class="none-gift" v-if="giftMap.length === 0">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-meiyouneirong"></use>
      </svg>
      <span>&nbsp;&nbsp;~~咦,我竟然还没有收到礼物~</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {ERR_OK, getImgUrl, viewGifts} from '@/server/index.js'
export default {
  components: {
    'SendExtendItem': () => import('@/views/mainRoom/components/chat/send-extend-item')
  },
  props: {
    theme: {
      type: String
    },
    giftsInfo: {
      type: Array
      // 数组默认值需从一个工厂函数获取
    },
    giftType: {
      type: String
    }
  },
  computed: {
    curTheme() {
      return this.themeMap[this.theme] || this.themeMap['light']
    },
    setTheme() {
      return `
        background-color: ${this.curTheme.bgColor};
        color: ${this.curTheme.textColor};
        height: ${this.curTheme.height};
      `
    },
    ...mapGetters([
      'csInfo'
    ])
  },
  data() {
    return {
      themeMap: {
        'light': {
          bgColor: 'rgba(244, 244, 244, 1)',
          textColor: '#909090',
          height: '23rem'
        },
        'dark': {
          bgColor: 'rgba(0, 0, 0, 0.5)',
          textColor: '#fff',
          height: '23rem'
        }
      },
      giftMap: [
        // {
        //   id: 'gift_car',
        //   name: '豪华跑车'
        // },
        // {
        //   id: 'gift_wing',
        //   name: '天使翅膀'
        // },
        // {
        //   id: 'gift_rocket',
        //   name: '土豪火箭'
        // },
        // {
        //   id: 'gift_earphones',
        //   name: '镶钻耳麦'
        // },
        // {
        //   id: 'gift_island',
        //   name: '优享海岛'
        // },
        // {
        //   id: 'gift_cake',
        //   name: '草莓蛋糕'
        // }
      ],
      myGifts: [],
      giftUrl: getImgUrl('url') // 礼物图片连接
      // giftCounts: 0 // 收到礼物的总数
    }
  },
  mounted() {
    this.getGiftsInfo()
  },
  methods: {
    // 获取礼物列表
    async getGiftsInfo() {
      const page = 0
      const pageSize = -1
      var csId = ''
      // const csId = this.csInfo.csId

      if (this.giftType === 'notAll') {
        csId = this.$route.query.cusSerId
      }
      const res = await viewGifts(page, pageSize, csId)

      if (res.result.code === ERR_OK) {
        this.giftMap = res.data.gifts
        // if (this.giftType === 'notAll') {
        //   // 若果获取的是坐席收到的礼物则统计礼物的总数量
        //   for (const i in res.data.gifts) {
        //     this.giftCounts = this.giftCounts + (res.data.gifts[i].giftCount || 0)
        //   }
        //   this.$emit('giftCounts', this.giftCounts)
        // }
      } else {
        console.log('there are some errors about get giftsInfo' + JSON.stringify(res))
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
.send-gift {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 2.4rem 1.8rem;
  .send-extend-item {
    height: 7.6rem;
    flex: 25%;
    flex-grow: 0;
    text-align: center;
  }
  .none-gift {
    width: 100%;
    display: flex;
    color: @text-normal;
    justify-content: center;
    .icon {
      width: 4.8rem;
      height: 4.8rem;
      fill: @text-light;
      vertical-align: -0.15em;
    }
    span {
      align-self: center;
    }
  }
}
</style>
