<template>
  <div class="cs-list">
    <my-cs-card
      v-for="(item, index) in myCs"
      :key="index"
      :currentCs="item"
      :csIndex="index"
      @clickToLineUp="clickToLineUp"
      @removeCs="removeCs"
    ></my-cs-card>
    <p class="tips">您还可以添加 <span>{{3 - myCs.length}}</span> 名专属客服</p>
    <x-button :gradients="['#FF8C6A', '#FF80A0']" @click.native="addCs"
              style="width: 15rem;height: 4rem;line-height: 4rem;font-size: 1.6rem;margin-top: 2rem;">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-jiahao"></use>
      </svg>
      {{ myCs.length === 3 ? '查看更多': '添加客服' }}
    </x-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import { XButton, TransferDomDirective as TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  // import { ERR_OK, queryCsInfo } from '@/server/index.js'

export default {
  components: {
    XButton,
    'myCsCard': () => import('@/views/mainRoom/components/service/my-cs-card')
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  directives: {
    TransferDom
  },
  props: {
    myCs: {
      type: Array
    }
  },
  data() {
    return {
      myCsList: [],
      quota: 3,
      status: '',
      alertTip: false,
      tipCon: ''
    }
  },
  created() {
    // this.getCsList()
  },
  methods: {
    // 获取专属客服列表
    async getCsList() {
      // // console.log('获取用户信息=>' + this.userInfo.userId)
      // const page = 1
      // const pageSize = -1
      // const userId = this.userInfo.userId // 获取用户的ID
      // const listType = '1'
      // const res = await queryCsInfo(page, pageSize, userId, listType)
      // // debugger
      // if (res.result.code === ERR_OK) {
      //   console.log('========================= 我现在来请求 专属客服 辣 ========================')
      //   // this.myCsList = res.data.csList
      //   this.$emit('resetMyCs', res.data.csList)
      //   res.data.csList.length === 0 && this.$router.replace('/room/cusServ/add')
      // } else {
      //   console.log('error in queryCsInfo' + JSON.stringify(res))
      // }
    },

    // 进入客服列表页
    addCs() {
      this.$router.push({path: '/room/cusServ/add'})
    },

    // 删除客服
    removeCs(index) {
      this.$emit('removeCs', index)
    },

    // 接收子组件传值
    clickToLineUp(cs) {
      this.$emit('goToLineUp', cs)
    }
  }
}
</script>

<style lang="less">
  .cs-list {
    min-height: 100%;
    padding: 2.5rem 0;
    background: #f4f4f4;
    box-sizing: border-box;
    .icon {
      width: 1.2rem;
      height: 1.2rem;
      fill: #ffffff;
    }
    .tips {
      color: #909090;
      font-size: 1.2rem;
      text-align: center;
      span {
        color: #FE9AA0;
      }
    }
  }
</style>
