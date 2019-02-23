<template>
<!-- 坐席收到礼物的列表 -->
  <div class="container" id="container">
    <div class="title" >
      <span class="tit-rig">礼物列表</span>
      <span class="btn btn-back" @click="$router.back(-1)">返回</span>
    </div>
    <!-- 每条礼物记录 -->
    <div class="item-container" id="itemContainer">
      <pull-to
        :bottom-load-method="loadMore"
        @bottom-state-change="stateChange"
      >
        <div class="list-item" v-for="(item, index) in giftsList" :key="index">
      <span class="right">
        <span class="name">{{item.name}}</span> <span class="con">送给她一个{{item.giftName}}</span>
      </span>
          <span class="left time">{{item.sendTime}}</span>
        </div>
        <!-- 没有礼物记录时 -->
        <div class="none-gift" v-if="none">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-meiyouneirong"></use>
          </svg>
          <span>&nbsp;&nbsp;~~咦,我竟然还没有收到礼物~</span>
        </div>
        <!-- 提示没有更多记录了 -->
        <divider style="margin: 3rem 0" v-if="noMore"> 啊呀，没有更多了</divider>
      </pull-to>
    </div>
  </div>
</template>

<script>
  import {Divider} from 'vux'
  import Tools from '@/common/js/tools'
  import PullTo from 'vue-pull-to'
  import {ERR_OK, giftsRecording} from '@/server/index.js'

  export default {
    // name: "cs-gifts-list"
    components: {
      Divider,
      PullTo
    },
    data() {
      return {
        page: 1, // 初始化页码
        // nextPage: 1,
        giftsList: [], // 礼物记录
        noMore: false,
        status: true,
        iconLink: '',
        none: false
      }
    },
    created() {
      this.getRecording()
    },
    mounted() {
      this.$nextTick(() => {})
    },
    methods: {
      // 获取第一页的数据
      async getRecording() {
        const page = 1
        const pageSize = 20
        const csId = this.$route.query.csId
        //
        // debugger
        const res = await giftsRecording(page, pageSize, csId)
        //
        if (res.result.code === ERR_OK) {
          if (res.data.gifts.length === 0) {
            // 如果没有查到更多的记录
            this.none = true
            this.status = false
            return
          }

          this.giftsList = res.data.gifts
          // 将UTC时间 格式化 && 处理用户姓名
          for (const i in this.giftsList) {
            const time = new Date(this.giftsList[i].sendTime) // 将utc时间转换为本地时间
            this.giftsList[i].sendTime = Tools.DateTools.formatDate(time, 'yyyy-MM-dd hh:mm:ss')
            const fName = this.formatName(this.giftsList[i].userName) // 格式化用户名
            this.giftsList[i].name = fName
          }
        }
      },

      loadMore(loaded) {
        this.page++
        const pageSize = 20
        const csId = this.$route.query.csId
        const tip = document.getElementsByClassName('default-text')[0]
        // debugger

        if (this.status === false) return
        giftsRecording(this.page, pageSize, csId)
          .then((res) => {
            if (res.data.gifts.length === 0) {
              this.noMore = true
              this.status = false
              loaded('done')
              tip.style.display = 'none'
              return
            }
            for (const i in res.data.gifts) {
              const time = new Date(res.data.gifts[i].sendTime) // 将utc时间转换为本地时间
              res.data.gifts[i].sendTime = Tools.DateTools.formatDate(time, 'yyyy-MM-dd hh:mm:ss')
              const fName = this.formatName(res.data.gifts[i].userName) // 格式化名字
              res.data.gifts[i].name = fName
            }
            this.giftsList = this.giftsList.concat(res.data.gifts)
            loaded('done')
          })
      },
      stateChange(state) {
        if (state === 'pull' || state === 'trigger') {
          this.iconLink = '#icon-arrow-bottom'
        } else if (state === 'loading') {
          this.iconLink = '#icon-loading'
        } else if (state === 'loaded-done') {
          this.iconLink = '#icon-finish'
        }
      },

      // 格式化userName
      formatName(name) {
        const reg1 = RegExp(/用户/)
        const reg2 = RegExp(/游客/)
        if (name.match(reg1) || name.match(reg2)) {
          return name
        } else {
          const fName = '**' + name.charAt(name.length - 1)
          return fName
        }
      }
    },
    watch: {}
  }
</script>

<style scoped lang="less">
  @import '~@/common/style/theme.less';
  .container {
    /*height: 100%; default-text*/
    font-size: 1.2rem;
    padding: 1rem 1.2rem 0;
    .title {
      position: fixed;
      width: calc(100vw - 5rem);
      top: 0;
      height: 4rem;
      display: flex;
      line-height: 4rem;
      box-sizing: border-box;
      justify-content: space-between;
      border-bottom: 1px solid #FF959C;
      .tit-rig {
        color: #FF959C;
      }
      .btn {
        cursor: pointer;
      }
    }
    .item-container {
      /*height: 87vh;*/
      height: calc(100vh - 10rem);
      margin-top: 5rem;
      box-sizing: border-box;
    }
    .none-gift {
      width: 100%;
      height: 60vh;
      display: flex;
      color: #646464;
      justify-content: center;
      .icon {
        width: 4.8rem;
        height: 4.8rem;
        fill: #646464;
        align-self: center;
        vertical-align: -0.15em;
      }
      span {
        align-self: center;
      }
    }
    .list-item {
      display: flex;
      height: 4rem;
      line-height: 4rem;
      border-top: 1px solid #F2F2F2;
      justify-content: space-between;
      .right {
        display: flex;
        .name{
          max-width: 9rem;
          display: inline-block;
          color: #646464;
          margin-right: .5rem;
          white-space: nowrap; // 强制不换行
          text-overflow: ellipsis; // 超出显示省略号
          overflow: hidden;
        }
        .con{
          color: #909090;
        }
      }
      .left {
        color: #BDBDBD;
      }
    }
    .list-item:first-child {
      border-top: none;
    }
    .bottom-load-wrapper {
      line-height: 50px;
      text-align: center;
    }
  }
</style>
