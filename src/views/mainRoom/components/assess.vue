<!-- 用户给客服评论的组件 -->
<template>
  <div class="assess-model" v-transfer-dom>
    <popup v-model="showAssessFlag" is-transparent>
      <div class="popup-main" style="">
       <div class="avatar">
         <img v-lazy="avatarImgSrc">
       </div>
        <x-icon type="ios-close" @click.native="$emit('handleToCancelAssess')" size="30"></x-icon>
        <div class="eva-part">
          <p>请对{{this.assessTask.csInfo.csNick}}本次的服务进行评价</p>
          <!-- fill:#bfbfbf; 未评价时星星的颜色； #FEC656,评价点亮后星星的颜色 -->
          <rater v-model="stars"
                 star="<svg class='icon' style='width:2rem;height:2rem;' aria-hidden='true'>
                 <use xlink:href='#icon-xingxing'></use></svg>" :margin="8">
          </rater>
        </div>
        <!-- <div class="eva-more" v-if="stars > 0"> -->
        <div class="eva-more" v-show="stars > 0">
          <!--<swiper height="9.5rem" style="background: #F1F1F1;margin-top: 1.5rem;" dots-class="custom-bottom" dots-position="center">-->
            <!--<swiper-item><div class="btn-box"></div></swiper-item>-->
            <!--<swiper-item><h2 class="fadeInUp animated">test2</h2></swiper-item>-->
            <!--<swiper-item v-for="(item, index) in btnBoxList" :key="index">-->
            <!--</swiper-item>-->
          <!--</swiper>-->
          <label-btn v-show="showAssessFlag" ref="labelBar" :labelType="labelType" @seledLabels="selLabels"></label-btn>
          <x-button :gradients="['#FF8C6A', '#ff80a0']" @click.native="handleToSaveAssess"
                    style="width: 11rem;margin: 2rem auto 0;">
            提交评价
          </x-button>
        </div>
      </div>
    </popup>
    <!-- <toast v-model="showFalseTips" type="text" :time="800" width="15rem" is-show-mask :position="position">{{failText}}</toast>
    <toast v-model="showSucTips" type="text" :time="800" width="15rem" is-show-mask text="评论成功" :position="position"></toast> -->
  </div>
</template>

<script>
  import { TransferDom, Popup, Rater, XButton } from 'vux'
  import IM from '@/server/im'
  import { ERR_OK, getCsAvatar, saveAssess } from '@/server/index.js'
  import { msgStatus, msgTypes } from '@/common/js/status'
  import { mapGetters } from 'vuex'
  import Tools from '@/common/js/tools'
  import LabelBtn from '@/views/mainRoom/components/label-btn'

  // const btnList = [
  //   '']
  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Rater,
      XButton,
      LabelBtn
      // 'LabelBtn': () => import('@/views/mainRoom/components/label-btn')
    },
    props: {
      showAssess: {
        type: Boolean
      }
    },
    data() {
      return {
        // showAssess: true,
        stars: 0,
        next: true,
       // btnBoxList: btnList,
        labels: [], // 用户选中的标签
        showFalseTips: false,
        failText: '啊呀出错啦！',
        showSucTips: false,
        position: 'default',
        labelType: 'all'
      }
    },
    computed: {
      ...mapGetters([
        // 'sessionId',
        'chatGuid',
        'userInfo',
        // 'csInfo',
        'sendType',
        'assessTask'
      ]),
      showAssessFlag: {
        get() {
          return this.showAssess
        },
        set() {}
      },
      avatarImgSrc() {
        return this.assessTask.csInfo.csId && getCsAvatar(this.assessTask.csInfo.csId)
      }
    },
    methods: {

      // 接受子组件传的值
      selLabels(selTags) {
        // debugger
        this.labels = selTags
      },

      // 保存评论的信息
      async handleToSaveAssess() {
        // if (this.labels.length === 0) {
        //   this.$vux.toast.text('啊呀，给个评价呗~', 'default')
        //   return
        // }

        const data = {
          sessionId: this.assessTask.sessionId,
          userId: this.userInfo.userId,
          userName: this.userInfo.userName,
          csId: this.assessTask.csInfo.csId,
          csName: this.assessTask.csInfo.csName,
          evaluateLevel: this.stars,
          labels: this.labels
        }
        // const data = Tools.CopyTools.objDeepClone({
        //   'sessionId': this.sessionId,
        //   'userId': this.userInfo.userId,
        //   'userName': this.userInfo.userName,
        //   'csId': this.csInfo.csId,
        //   'csName': this.csInfo.csName,
        //   'evaluateLevel': this.stars,
        //   'labels': this.labels
        // })

        // 发送评价消息，告诉坐席
        IM.sendNormalMsg(
          this.userInfo.userId,
          data.csId,
          // '123456789',
          {
            sessionId: this.assessTask.sessionId,
            chatGuid: this.assessTask.chatGuid,
            toUserName: data.csName,
            msg: `${this.userInfo.userName}评价了你`,
            time: Tools.DateTools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            nickName: this.userInfo.userName,
            avatar: data.csId,
            identifier: this.userInfo.userId,
            msgStatus: msgStatus.msg,
            msgType: msgTypes.msg_assess,
            chatType: this.sendType,
            assessInfo: data,
            MsgLifeTime: 0
          })

        this.$emit('assessSuccess', this.assessTask.mode)
        // 调用评价接口，告诉服务
        const res = await saveAssess(data)
        let text = ''
        if (res.result.code === ERR_OK) {
          text = '评价成功'
        } else {
          text = '评价失败'
        }
        this.$vux.toast.text(text, 'default')

        // 清空数据
        this.$refs.labelBar.resetLabelList()
        this.stars = 0
      }
    }
  }
</script>

<style scoped lang="less">
.assess-model {
  .vux-popup-dialog {
    display: flex;
    height: 100vh!important;
    .vux-x-icon {
      fill: #FF959C;
      position: relative;
      right: -11.2rem;
    }
    .popup-main {
      position: relative;
      width: 27rem;
      opacity: .85;
      margin: 0 auto;
      align-self: center;
      padding: 10px 0 2.5rem;
      background: #fff;
      text-align: center;
      border-radius: 1rem;
      .avatar {
        width: 7.5rem;
        height: 7.5rem;
        position: absolute;
        top: -4rem;
        left: 50%;
        margin-left: -4rem;
        padding: 0.4rem;
        box-sizing: border-box;
        border-radius: 50%;
        background: linear-gradient(to right, #FF8C6A, #FF80A0);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          // margin-top: .4rem;
          vertical-align: middle;
          object-fit: cover;
        }
      }
      .eva-part {
        font-size: 1.2rem;
        padding: 1.5rem 0 0;
        .vux-rater {
          padding: 2rem 0 1rem;
        }
      }
    }
  }
}
</style>
