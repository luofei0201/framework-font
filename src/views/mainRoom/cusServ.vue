<template>
  <div class="cus-serv">
    <keep-alive :include="['cs-add']">
      <router-view
        :updateCsItem="deleteCsItem"
        :myCs="myCs"
        @removeCs="removeCs"
        @goToLineUp="showConfirm"
        @clickToLineUp = "showConfirm"
        @showShare="showShare"
        @resetMyCs="resetMyCs"
        @addCs="addCs"
      ></router-view>
    </keep-alive>
    <!--<div v-transfer-dom>  -->
      <!--<confirm v-model='alertTip'>-->
        <!--<p style="text-align:center;">{{tipCon}}</p>-->
      <!--</confirm>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import Tools from '@/common/js/tools'

import { ERR_OK, getCsStatus, queryCsInfo, addCs } from '@/server/index.js'
// import { roomStatus } from '@/common/js/status'

export default {
  name: 'cus-serv',
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      myCs: [], // 我的专属客服
      csSelected: {},
      deleteCsItem: null
    }
  },
  // created() {

  // },
  async activated() {
    this.$vux.loading.show({ text: '请稍后' })
    await this.getCsList()
    this.nextUrl()
    this.$vux.loading.hide()
  },
  mounted() {
    // this.nextUrl()
  },
  methods: {
    showConfirm(cs) {
      this.csSelected = cs
      const self = this
      this.$vux.confirm.show({
        title: '您即将转入视频客服',
        onConfirm() {
          self.goToLineUp()
        }
      })
    },
    resetMyCs(list) {
      this.myCs = list
    },
    // 删除
    removeCs(i) {
      this.myCs = this.myCs.reduce((val = [], item, index) => {
        if (index === i) {
          // this.$refs.csComponents.updateCsList(item)
          this.deleteCsItem = item
          return val
        } else {
          return val.concat(item)
        }
      }, [])
      // this.myCs = this.myCs.filter((item, index) => index !== i)

      this.myCs.length === 0 && this.$router.replace('/room/cusServ/add')
    },
    showShare(csId, csName) {
      this.$emit('showShare', csId, csName)
    },

    // 进入视频客服
    async goToLineUp() {
      // 判断当前是否为工作时间
      const SP_workT = this.userInfo.workTimeInfo.SP
      if (!Tools.DateTools.isWorkTime(SP_workT)) {
        this.$vux.alert.show({
          title: `抱歉，当前为非工作时间，视频客服工作时间为周一至周日${SP_workT.startTime}-${SP_workT.endTime}，请在工作时间内来询，感谢您的关注！`
        })
        return
      }

      // debugger
      const res = await getCsStatus(this.csSelected.id)
      const status = Number(res.data.status || this.csSelected.status)
      // 只有就绪和忙碌可以排队
      switch (true) {
        case status === 1 || status === 7:
          this.$vux.alert.show({
            title: '啊呀，客服暂时还没准备好呢~'
          })
          break
        case status === 3 || status === 5:
          this.$emit('requestVideoServer', {
            csId: this.csSelected.id,
            csName: this.csSelected.nickName,
            csNick: this.csSelected.nickName
          })
          // this.$router.push({path: `/room/line-up?csId=${this.csSelected.id}&csName=${this.csSelected.nickName}`})
          // this.beforeQueue({
          //   mode: roomStatus.videoChat,
          //   content: `尊敬的${+this.userInfo.userGrade <= 3 ? this.userInfo.userGradeName : ''}客户，正在为您转接视频客服，请稍后。`
          // })
          break
        case status === 4:
          this.$vux.alert.show({
            title: '啊呀，客服正在休息呐~'
          })
          break
        case status === 2 || status === -1:
          this.$vux.alert.show({
            title: '啊呀，客服暂时不在呢~'
          })
          break
      }
    },

    // 查询专属客服 change by wnagxj
    async getCsList() {
      const page = 1
      const pageSize = -1
      const userId = this.userInfo.userId // 获取用户的ID
      const listType = '1' // 请求我的专属客服
      const res = await queryCsInfo(page, pageSize, userId, listType)

      if (res.result.code === ERR_OK) {
        // 更新当前的专属客服列表
        this.resetMyCs(res.data.csList)
      } else {
        console.log('error in queryCsInfo' + JSON.stringify(res.result))
      }
    },

    // 判断路由 change by wnagxj
    nextUrl() {
      // debugger
      if (this.$route.query.csType === 'online') { // 进入在线客服的个人中心
        this.$router.push({
          path: '/room/cusServ/serverDetail',
          query: {
            cusSerId: this.$route.query.cusSerId,
            csType: 'online'
          }
        })
        return
      }
      if (this.myCs.length === 0) {
        this.$router.replace('/room/cusServ/add')
      } else {
        this.$router.replace('/room/cusServ/list')
      }
    },

    // 添加为专属客服
    async addCs(csInfo) {
      if (this.myCs.length >= 3) {
        this.$vux.toast.text('最多只能添加三名专属客服呢', 'default')
        return
      }
      const res = await addCs(csInfo)
      if (res.result.code === ERR_OK) {
        // console.log(JSON.stringify(res))
        this.getCsList() // 更新专属客服列表（重新查询）待优化
        this.$vux.toast.text('您已成功添加专属客服', 'default')
      } else {
        console.log('error about add the cS' + JSON.stringify(res.result))
      }
    }
  }
}
</script>

<style lang="less">

</style>
