<template>
  <div class="label-btn-box" :class="{'my-label': labelType === 'notAll'}">
    <swiper v-model="currentPage" @on-index-change="changePage" height="12.5rem"
            v-if="btnList.length > 0" style="" dots-class="custom-bottom" dots-position="center">
      <swiper-item v-for="(pages, index) in btnList" :key="index">
        <!--{{index}} labelType === 'all'   :show-dots="showDots"-->
        <checker v-model="selTags" type="checkbox" default-item-class="tags-default" @on-change="selChanege"
                 selected-item-class="tags-selected">
          <checker-item :disabled="disable"
                        :value="item" v-for="(item, index) in pages.list"
                        :key="index"
                        :text="item.labelName"
                        :likeNum="item.labelCount"
          >{{item.labelName}}&nbsp;{{item.labelCount === undefined ? '' : (item.labelCount > 99 ? '99+' :item.labelCount)}}</checker-item>
        </checker>
      </swiper-item>
    </swiper>

    <!-- 当没有标签的情况 -->
    <div class="label-none" v-if="btnList.length === 0">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-meiyou-copy"></use>
      </svg>
      <span>&nbsp;&nbsp;~~咦,我竟然还没有标签呐~</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import Queue from '@/common/js/Queue'
  import { Checker, CheckerItem, Swiper, SwiperItem } from 'vux'
  import { ERR_OK, viewLabels } from '@/server/index.js'

  export default {
    // name: "label-btn.vue"
    components: {
      Checker,
      CheckerItem,
      Swiper,
      SwiperItem
    },
    props: {
      labelType: {
        type: String
      }
    },
    data() {
      return {
        btnList: [
          // {name: '聪明伶俐', id: 3}
        ],
        allBtnList: [], // 所有评价我的标签
        selTags: [], // 选中的标签
        isDisabled: '', // unused
        disable: true, // 标签不能选，只是做展示功能
        currentPage: 0, // 当前页
        pageList: [1],
        limits: 6 // 每个轮播页显示的标签的个数，评价时引用组件显示 6个/页 标签，个人中心显示 8个/页
      }
    },
    computed: {
      // selTagsModel() {
      //   return this.selTags || []
      // },
      ...mapGetters([
        'csInfo'
      ])
    },
    mounted() {
      this.getLabels()
    },
    methods: {
      // 清空标签
      resetLabelList() {
        this.selTags = []
        this.changePage(0)
      },

      // 切换轮播页
      changePage(index) {
        this.currentPage = index
      },

      // 标签信息查询，获取label列表
      async getLabels() {
        var csId = ''

        // debugger
        if (this.labelType === 'notAll') {
          let page = 0
          let pageSize = -1
          csId = this.$route.query.cusSerId || this.$route.query.csId
          // 评价当前客服的所有标签

          const result = await viewLabels(page, pageSize, csId)
          // debugger
          if (result.result.code === ERR_OK) {
            // debugger
            this.btnList = this.labelPagination(result.data.labels)
            // debugger
          }
        } else {
          // 查询所有标签
          let pages = 0
          let pageSizes = -1
          this.disable = false // 标签可以选
          const res = await viewLabels(pages, pageSizes, csId)
          // debugger
          if (res.result.code === ERR_OK) {
            // debugger
            this.btnList = this.labelPagination(res.data.labels)
            // debugger
          }
        }
      },
      labelPagination(list) {
        let map = []
        if (list.length === 0) {
          return map
        }
        // 初始化 每页的标签个数
        // if (this.labelType === 'notAll') {
        //   this.limits = 8
        // } else {
        //   this.limits = 6
        // }

        // 初始化页数
        const pages = Math.ceil(list.length / this.limits) // 总页数
        for (let i = 0; i < pages; i++) {
          // 初始化单页数据
          let temp = {
            page: i,
            strLen: 0,
            list: []
          }
          const last = Math.min(list.length, (i + 1) * this.limits)
          for (let j = i * this.limits; j < last; j++) {
            temp.list.push(list[j])
          }
          map.push(temp)
          // 封装单页
        }
        return map
      },

      // 选中的标签
      selChanege() {
        // debugger
        this.$emit('seledLabels', this.selTags)
      }
    }
  }
</script>

<style scoped lang="less">
@import '~@/common/style/theme.less';
.label-btn-box {
  /*未选中状态的样式*/
  /*text-align: left;*/
  .tags-default {
    width: 5.7rem;
    color: #FF959C;
    font-size: 1rem;
    padding: .6rem 0.8rem;
    margin: 1rem 0.5rem;
    border-radius: 5px;
    border: 1px solid #FF959C;
    text-align: center;
    white-space: nowrap; // 强制不换行
    text-overflow: ellipsis; // 超出显示省略号
    overflow: hidden;
  }
  /*选中之后的状态*/
  .tags-selected {
    color: #ffffff;
    background: #fe959c;
  }
  .label-none {
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
.my-label {
  text-align: center;
  .tags-default {
    width: 20vw;
    min-width: 5.7rem;
  }
}
</style>
