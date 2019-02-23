<template>
  <div class="input-bar border-1px-before border-1px-after">
    <!-- <div class="input-bar-item left-item" v-if="status">
      <svg class="icon extend-click" aria-hidden="true">
        <use xlink:href="#icon-wode"></use>
      </svg>
    </div> -->
    <div class="input-bar-item input-box">
      <section class="input-wrapper">
        <div class="input-wrapper-item input-content needsclick"
          autofocus
          contenteditable="true"
          placeholder="有问题，找小华"
          id="input-content-hook"
          ref="inputContent"
          type="text"
          @click="chatFocus($event)"
          @keyup="chatInput($event)"
        ></div>
        <button class="input-wrapper-item input-inline-btn" @click="$emit('requestGiftSectionOpen')" :disabled="isRobotChat">
          <svg class="icon extend-click" aria-hidden="true">
            <use :xlink:href="isRobotChat ? '#icon-liwuzhihui' : '#icon-liwu'"></use>
            <!-- <use xlink:href="#icon-liwu"></use> -->
          </svg>
        </button>
        <button class="input-wrapper-item input-inline-btn" @click="$emit('requestExpressSectionOpen')">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-xiaolian"></use>
          </svg>
        </button>
      </section>
      <!-- <input v-model="inputText" type="text" ref="invisibleInput" v-show="false"> -->
    </div>
    <div class="input-bar-item right-item">
      <!-- <transition
        @enter="sendBtnEnter"
        @leave="sendBtnLeave">
        <button id="sendBtn" class="sendBtn" v-if="isSendBtnShow" @click="chatCommit">发送</button>
      </transition> -->
      <transition name="send-plus" mode="out-in">
        <button class="input-bar-item-btn" v-if="isSendBtnShow" @click="chatCommit">
          <svg class="icon extend-click" aria-hidden="true">
            <use xlink:href="#icon-shangchuan"></use>
          </svg>
        </button>
      </transition>
      <transition name="send-plus" mode="out-in">
        <button class="input-bar-item-btn" v-if="!isSendBtnShow" @click="toggleExtend">
          <svg class="icon extend-click" aria-hidden="true" :class="{'extend-Bar-Open': extendBarOpen}">
            <use xlink:href="#icon-jiahao"></use>
          </svg>
        </button>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import { roomStatus } from '@/common/js/status'
// import anime from 'animejs'
import Tools from '@/common/js/tools'
// import { XTextarea, Group } from 'vux'

export default {
  components: {
    // XTextarea,
    // Group
  },
  props: {
    isFocus: {
      type: Boolean
    },
    expressBarShow: {
      type: Boolean
    }
  },
  computed: {
    isRobotChat() {
      return this.roomMode === roomStatus.AIChat
    },
    isSendBtnShow() {
      return this.inputBarOpen || this.expressBarShow
    },
    ...mapGetters([
      'roomMode',
      'extendBarOpen',
      'inputBarOpen'
    ])
  },
  data() {
    return {
      status: false,
      inputText: ''
    }
  },
  methods: {
    toggleExtend() {
      this.$emit('toggleExtend')
    },
    closeKeyBoard() {
      this.setInputBar(false)
    },
    chatFocus(event) {
      this.$emit('targetInputBuffer')
    },
    chatInput(event) {
      const e = event || window.event
      this.inputText = e.currentTarget.textContent
      this.$emit('chatInputChange', this.inputText)
    },
    chatCommit() {
      const str = Tools.CharTools.utf16toEntities(this.$refs.inputContent.innerText)
      // 存发送过的表情
      this.storageEmoji(str)
      // 提交发送
      this.$emit('chatInputCommit', str)
    },
    storageEmoji(str) {
      // 存发送过的表情
      let emojiArr = str.match(/&#\d{6};/g)
      if (emojiArr) {
        const localStorage = window.localStorage
        // 取出缓存中的发送过的表情，拼接新的缓存
        let temp = JSON.parse(localStorage.getItem('emoji_cache'))
        if (temp) {
          emojiArr = emojiArr.concat(temp)
        }
        // 新的emoji缓存去重
        emojiArr = Array.from(new Set(emojiArr))
        // 判断长度，移除超出24个的部分
        if (emojiArr.length > 24) {
          emojiArr = emojiArr.splice(0, 24)
        }
        localStorage.setItem('emoji_cache', JSON.stringify(emojiArr))
      }
    },
    getInputText() {
      return this.$refs.inputContent.innerText
    },
    setInputText(text) {
      this.$refs.inputContent.innerHTML = text
    },
    getInputEditState() {
      return this.$refs.inputContent.getAttribute('contentEditable')
    },
    removeInputEditState() {
      this.$refs.inputContent.removeAttribute('contentEditable')
    },
    setInputEditState(tag) {
      this.$refs.inputContent.setAttribute('contentEditable', tag)
    },
    getCursortPosition(element) {
      let caretOffset = 0
      const doc = element.ownerDocument || element.document
      const win = doc.defaultView || doc.parentWindow
      const sel = win.getSelection()
      if (sel.rangeCount > 0) { // 中的区域
        const range = sel.getRangeAt(0)
        const preCaretRange = range.cloneRange() // 克隆一个选中区域
        preCaretRange.selectNodeContents(element) // 设置选中区域的节点内容为当前节点
        preCaretRange.setEnd(range.endContainer, range.endOffset) // 重置选中区域的结束位置
        caretOffset = preCaretRange.toString().length
      }
      return caretOffset
    },
    ...mapMutations({
      setInputBar: 'SET_INPUT_BAR'
    })
    // sendBtnEnter() {
    //   const extendBarKeyframes = anime.timeline()
    //   extendBarKeyframes.add({
    //     targets: '#sendBtn',
    //     translateX: [
    //       { value: [-46, 0], duration: 500, delay: 300, easing: 'easeInOutQuart' }
    //     ],
    //     translateY: [
    //       { value: [10, 0], duration: 200, delay: 300, easing: 'easeInOutQuart' }
    //     ],
    //     scaleX: [
    //       { value: [0.1, 1], duration: 200, delay: 300, easing: 'linear' }
    //     ],
    //     scaleY: [
    //       { value: [0.2, 1], duration: 100, delay: 300, easing: 'linear' }
    //     ],
    //     borderRadius: [
    //       { value: [50, 5], duration: 200, delay: 400, easing: 'easeInOutQuart' }
    //     ],
    //     opacity: [
    //       { value: [0, 1], duration: 300, delay: 300, easing: 'easeInOutQuart' }
    //     ],
    //     color: [
    //       { value: '#fff', duration: 500, delay: 400, easing: 'easeInOutQuart' }
    //     ]
    //   })
    // },
    // sendBtnLeave() {
    //
    // }
  }
}
</script>

<style lang="less">
@import '~@/common/style/theme.less';
@import '~@/common/style/mixin.less';

.input-bar {
  .border-1px-after(@label-line-normal);
  .border-1px-before(@label-line-normal);
  // position: relative;
  // left: 0;
  // bottom: 0;
  width: 100%;
  height: auto;
  min-height: 5.2rem;
  // padding: 0 0.8rem;
  // box-sizing: border-box;
  background-color: @bg-light;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  &.visible-padding-left {
    padding-left: 0;
  }
  .input-bar-item {
    // box-sizing: border-box;
    align-self: flex-end;
    &.left-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5.6rem;
      height: 4.6rem;
    }
    &.input-box {
      // min-width: calc(~'100% - 9rem');
      height: 100%;
      padding: 0.7rem 0 0.7rem 1.6rem;
      flex: 1;
      box-sizing: border-box;
      .input-wrapper {
        display: flex;
        align-items: flex-end;
        border-radius: 1.9rem;
        border: 0.05rem solid @text-lighter-a;
        background-color: rgba(250, 248, 249, 1);
        padding: 0.5rem 0 0.5rem 1.2rem;
        box-sizing: border-box;
        .input-wrapper-item {
          margin-right: 0.6rem;
        }
        .input-content {
          width: calc(~'100% - 3.4rem');
          line-height: 2.8rem;
          min-height: 2.8rem;
          max-height: 12rem;
          outline: 0;
          word-wrap: break-word;
          word-break: break-all;
          overflow-x: hidden;
          overflow-y: auto;
          font-size: 1.4rem;
          color: @text-normal;
          background-color: unset;
          transition: all .5s cubic-bezier(0.11, 0.62, 0.23, 1);
          -webkit-overflow-scrolling: touch;
          -webkit-user-select: text;
          &:empty:before {
            content: attr(placeholder);
            color: @text-lighter-a;
            font-size: 1.4rem;
          }
          &:focus {
            content: none;
          }
        }
        .input-inline-btn {
          // position: absolute;
          // bottom: 0;
          // right: 0;
          width: 2.4rem;
          height: 2.4rem;
          // flex-basis: 4.6rem;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
          border: 0;
          padding: 0;
          background-color: unset;
          // border-radius: 50%;
          .icon {
            margin: 0 auto;
            width: 100%;
            height: 100%;
            transition: all 0.4s ease-in-out;
            background-color: unset;
            border-radius: 0;
            fill: unset;
            // transition-delay: 0.65s;
          }
        }
      }
    }
    &.right-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      min-width: 4.6rem;
      height: 5.2rem;
      flex-grow: 0;
      .send-plus-enter-active, .send-plus-leave-active {
        transition: all .5s ease;
        transition-delay: .3s;
      }
      .send-plus-enter, .send-plus-leave-to {
        opacity: 0;
        transform: translateX(4.6rem);
      }
      .input-bar-item-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 2.4rem;
        height: 2.4rem;
        // flex-basis: 4.6rem;
        margin: 1.4rem 1.1rem;
        flex-shrink: 0;
        border: 0;
        padding: 0;
        background-color: @text-special;
        border-radius: 50%;
        .icon {
          margin: 0 auto;
          width: 1.4rem;
          height: 1.4rem;
          transition: all 0.4s ease-in-out;
          fill: @text-lighter;
          // transition-delay: 0.65s;
          &.extend-Bar-Open {
            transform: rotate(135deg);
            // fill: @text-normal;
          }
        }
      }
      .sendBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 6.4rem;
        height: 3.2rem;
        background: rgba(33,150,243,1);
        border-radius: 50%;
        color: rgba(33,150,243,1);
        font-size: 1.6rem;
        border: 0;
        padding: 0;
        margin: 0.7rem 0.8rem;
        flex-shrink: 0;
        // transform: translate(-46px, 32px) scaleX(0.1) scaleY(0.2);
        // opacity: 0;
      }
    }
    .icon {
      display: block;
      width: 2.2rem;
      height: 2.2rem;
      // padding: 0 1.2rem;
      fill: @label-line-normal;
      background-color: transparent;
      border-radius: 50%;
    }
  }

}
</style>
