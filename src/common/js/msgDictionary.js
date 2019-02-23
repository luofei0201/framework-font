import { getCsAvatar } from '@/server'
import { msgTypes } from '@/common/js/status'

const status = {
    getTypeMap: function() {
        return typeMap[this.status]
    }
}

const statusMap = {
    '0': Object.assign(Object.create(status), {
        status: 'tip',
        template: function(h, { msg, slot }) {
            return (<div class="tips-item"> { slot } </div>)
        }
    }),
    '1': Object.assign(Object.create(status), {
        status: 'msg',
        template: function(h, { msg, slot }) {
            return (
                <div class={{ 'msgs-item': true, 'item-padding-left': msg.isSelfSend, 'item-padding-right': !msg.isSelfSend }}>
                    {
                        !msg.isSelfSend
                        ? <div class="avatar" on-click={ () => this.enterSerCenter(msg) }>
                            {
                                this.theme['avatar']['decorate'] && <img class="avatar-decorate"
                                    src={ this.theme['avatar']['decorate'] }
                                ></img>
                            }
                              <div class="bot-avatar bg-image">
                                  <img style={{ width: '100%', height: '100%' }}
                                    src={ !msg.chatType || msg.chatType === '1' ? this.theme['avatar']['bot'] : getCsAvatar(msg.avatar) }>
                                  </img>
                              </div>
                          </div>
                        : ''
                    }

                    <div class={{'content-box': true, 'right-content-box': msg.isSelfSend, 'left-content-box': !msg.isSelfSend}}>
                        {
                            !msg.isSelfSend
                            ? <p class="name">{ msg.nickName }</p>
                            : ''
                        }
                        <div class={{
                            'content': true,
                            'chat-content-shadow': true,
                            'right-content-style': msg.isSelfSend,
                            'left-content-style': !msg.isSelfSend,
                            'padding-for-img': msg.msgType === msgDictionary.getTypeCode('msg', 'msg_img'),
                            'padding-for-HX': msg.msgType === msgDictionary.getTypeCode('msg', 'msg_XH_express')
                            }}
                            style={ msg.isSelfSend ? this.theme['msg-content']['background']['right'] : this.theme['msg-content']['background']['left'] }>

                            {
                                msg.isSelfSend &&
                                <div class="msg-status">
                                    { msg.status === 'pending' && <inline-loading></inline-loading>}
                                    {
                                        msg.status === 'failed' &&
                                        <div class="failed" onClick={() => this.$emit('resendMsgs', msg)}>
                                            <svg class="icon extend-click" aria-hidden="true">
                                                <use xlinkHref="#icon-gantanhao"></use>
                                            </svg>
                                        </div>
                                    }
                                </div>
                            }

                            { slot }

                            {
                                this.theme['msg-content']['decorate'] &&
                                (msg.msgType !== msgTypes.msg_XH_express) &&
                                (msg.msgType !== msgTypes.msg_gift) &&
                                (msg.msgType !== msgTypes.msg_img) &&
                                <section class={{'decorate-section': true, 'trans-direct': msg.isSelfSend}}>
                                    <span class={{ decorate: true, top: true }} style={ this.theme['msg-content']['decorate']['top'] }></span>
                                    <span class={{ decorate: true, bottom: true, 'trans-direct': msg.isSelfSend }} style={ this.theme['msg-content']['decorate']['bottom'] }></span>
                                </section>
                            }
                        </div>
                        {
                            msg.msgType === msgDictionary.getTypeCode('msg', 'msg_guess') &&
                            <div class="content chat-content-shadow left-content-style content-extend"
                                style={ this.theme['msg-content']['background']['left'] }>
                                <span class="text">
                                    {
                                        msg.msgExtend.map((item, index) => {
                                            return <span class="text-extend button" style={ this.theme['button'] } key={index} on-click={() => this.clickHotQues(item.question)}>{ item.question }</span>
                                        })
                                    }
                                </span>
                            </div>
                        }
                    </div>
                </div>
            )
        }
    }),
    '2': Object.assign(Object.create(status), {
        status: 'dialog',
        template: function(h, { msg, slot }) {
            return (<div class="dialog-item"> { slot } </div>)
        }
    }),
    '3': Object.assign(Object.create(status), {
        status: 'card',
        template: function(h, { msg, slot }) {
            return (<div class="card-item"> { slot } </div>)
        }
    })
}

const typeMap = {
    'tip': {
        '0': {
            type: 'tip_time',
            template: function(h, msg) {
                return (<span class="item-span">{ this.timeFilter(msg.content) }</span>)
            }
        },
        '1': {
            type: 'tip_normal',
            template: function(h, msg) {
                return (<span class="item-span">{ msg.content }</span>)
            }
        },
        '2': {
            type: 'tip_success',
            template: function(h, msg) {
                return (
                    <span class="item-span">
                        <svg class="icon icon-success" aria-hidden="true">
                            <use xlinkHref="#icon-chenggong"></use>
                        </svg>
                        { msg.content }
                    </span>
                )
            }
        },
        '3': {
            type: 'tip_fail',
            template: function(h, msg) {
                return (
                    <span class="item-span">
                        <svg class="icon icon-fail" aria-hidden="true">
                            <use xlinkHref="#icon-zhuanjiemang"></use>
                        </svg>
                        客服转接失败，请稍后重试~
                    </span>
                )
            }
        },
        '4': {
            type: 'tip_line_up',
            template: function(h, msg) {
                return (
                    <span class="item-span">
                        当前排队{ msg.queueNum }人，请耐心等待
                        <span class="button extend-click" on-click={() => this.$emit('onLineCancelQueue')}>取消排队</span>
                    </span>
                )
            }
        }
    },
    'card': {
        '0': {
            type: 'bot_card',
            template: function(h, msg) {
                return (
                    <div class="card-container">
                        <div class="card" style={ this.theme['card-bg'] }>
                            <div class="avatar">
                                {
                                    this.theme['avatar']['decorate'] && <img class="avatar-decorate"
                                        src={ this.theme['avatar']['decorate'] }
                                    ></img>
                                }
                                <img style={{ width: '100%', height: '100%' }} src={ this.theme['avatar']['bot'] }></img>
                            </div>
                            <div class="text" style={ this.theme['text'] }>
                                <span class="name" style={ this.theme['button'] }>{ msg.cardInfo.nickName }</span>
                                &nbsp;智能客服
                            </div>
                        </div>
                        { /* <!-- <div class="label">${msg.cardInfo.nickName}进入会话竭诚为您服务~</div> --> */ }
                    </div>
                )
            }
        }
    },
    'dialog': {
        '0': {
            type: 'dialog_disconnect',
            template: function(h, msg) {
                return (
                    <div class="cell fail-container">
                        <div class="fail-con">
                            <img src="/video/static/img/chat/connect-fail@2x.png"
                                srcset="/video/static/img/chat/connect-fail.png 1x,
                                    /video/static/img/chat/connect-fail@2x.png 2x,
                                    /video/static/img/chat/connect-fail@3x.png 3x"></img>
                            <div class="fail-con-left">
                                <p class="tit">连接已中断</p>
                                <p class="text">您已经有{ msg.dialogInfo.disconnectTime }分钟没有回复信息，聊天自动中断！</p>
                            </div>
                        </div>
                        <div class="fail-bottom border-1px-before">
                            <a on-click={() => this.reConnect()}>点击重新连接</a>
                        </div>
                    </div>
                )
            }
        },
        '1': {
            type: 'dialog_success',
            template: function(h, msg) {
                return (
                    <div class="cell suc-con">
                        <div class="avatar">
                            <img src="/video/static/img/avatar@2x.png"></img>
                            <p class="name">{ msg.dialogInfo.csName }</p>
                        </div>
                        <div class="suc-con-left">
                            <p class="tit" style="padding: .8rem 0 1rem 0">尊贵的{ msg.dialogInfo.rank }客户</p>
                            <div style="display: flex">
                                <p class="text">人工客服切换成功！祝您沟通愉快！</p>
                                <div class="diamond">
                                    <img src="/video/static/img/chat/diamond.png"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    },
    'msg': {
        '0': {
            type: 'msg_normal', // 基础文本会话
            template: function(h, msg) {
                return (<span class="text" id={ msg.timestamp } on-click={() => this.$emit('targetLink', this.$event)} domPropsInnerHTML={ msg.content }></span>)
            }
        },
        '1': {
            type: 'msg_hot', // 热点问题(机器人)
            template: function(h, msg) {
                return (
                    <span class="text">
                        { msg.content }
                        <span class="line" style={ this.theme['msg-content']['line'] }></span>
                        <span class="text-extend-hot">
                            <span class="text-extend" style={ this.theme['text'] }>您可能想问：</span>
                            {
                                msg.msgExtend.map((item, index) => {
                                    return <span
                                        style={ this.theme['button'] }
                                        class="text-extend button"
                                        key={index}
                                        on-click={() => this.clickHotQues(item.question)}>
                                        { item.question }
                                    </span>
                                })
                            }
                        </span>
                    </span>
                )
            }
        },
        '2': {
            type: 'msg_guess', // 猜问题(机器人)
            template: function(h, msg) {
                return (<span class="text">我猜您想知道这些问题</span>)
            }
        },
        '3': {
            type: 'msg_leave', // 请留言(机器人)
            template: function(h, msg) {
                return (<span class="text">{ msg.content }，请<span class="button" on-click={() => this.leaveMsg()}>点击留言</span>~</span>)
            }
        },
        '4': {
            type: 'msg_no_idea', // 直接转人工(机器人)
            template: function(h, msg) {
                return (
                    <span class="text">
                        小华好像听不太懂您的问题呢，可转
                        <span class="button" style={ this.theme['button'] } on-click={() => this.enterOnLineLineUp()}>人工客服</span>
                    </span>
                )
            }
        },
        '5': {
            type: 'msg_img', // 图片消息
            template: function(h, msg) {
                return (
                    <span class={{text: true, 'text-img': true}}>
                        <img class={{'text-img-cell': true, 'right-img-style': msg.isSelfSend, 'left-img-style': !msg.isSelfSend}}
                            style={{ height: '100%' }}
                            id={ msg.timestamp }
                            src={ msg.imgData.small }
                            on-click={() => this.clickImgMsg(msg.timestamp)}></img>
                    </span>
                )
            }
        },
        '6': {
            type: 'msg_gift', // 礼物消息
            template: function(h, msg) {
                return (
                    <span class="text gift-item">
                        我送给{ this.csInfo.csNick || '客服' }一个{ msg.giftInfo.giftName } !
                        <img class="text-gift" src={`/video/static/img/gift/${msg.giftInfo.giftId}.png`}></img>
                    </span>
                )
            }
        },
        '7': {
            type: 'msg_liked', // 点赞消息
            template: function(h, msg) {
                return (<span class="text">我给你点赞</span>)
            }
        },
        '8': {
            type: 'msg_card', // 名片消息
            template: function(h, msg) {
                return (
                    <span class="text">
                        <div class="text-card">
                            <div class="card-left">
                                <span class="name"> { msg.proxyInfo.agentName } </span>
                                { /* <!-- <span class="sex">{{msg.proxyInfo.agentSex}}</span> --> */ }
                                <span class="sex">
                                <svg class="icon extend-click" aria-hidden="true">
                                    <use xlinkHref="#icon-nan"></use>
                                </svg>
                                </span>
                            </div>
                            <div class="card-right">
                                <ul>
                                    <li class="infoList">
                                        <span class="title">工号：</span>
                                        <span class="val"> {msg.proxyInfo.agentId }</span>
                                    </li>
                                    <li class="infoList">
                                        <span class="title">所属渠道：</span>
                                        <span class="val">个险</span>
                                    </li>
                                    <li class="infoList">
                                        <span class="title">电话：</span>
                                        <span class="val phone" on-click={() => this.callPhone(this.$event)}>{ msg.proxyInfo.agentPhone }</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </span>
                )
            }
        },
        '10': {
            type: 'msg_XH_express', // 小华表情消息
            template: function(h, msg) {
                return (
                    <span class="text">
                        <img class="text-XH" style={{ height: '100%' }} src={ msg.imgData.small }></img>
                    </span>
                )
            }
        },
        '11': {
            type: 'msg_bot_thanks', // 小华感谢消息
            template: function(h, msg) {
                return (<span class="text">小华感谢您的认可</span>)
            }
        },
        '13': {
            type: 'msg_timeout' // 超时结束会话
        },
        '14': {
            type: 'msg_video_blur' // 坐席暂离，设置模糊及静音
        },
        '15': {
            type: 'msg_video_muted' // 坐席静音
        },
        '24': {
            type: 'msg_hand_up' // 结束会话（在线）
        }
    }
}

const msgDictionary = {
    getStatusCode: function(status) {
        return Object.keys(statusMap).find(key => statusMap[key].status === status)
    },
    getTypeCode: function(status, type) {
        const TMap = typeMap[status]
        return Object.keys(TMap).find(key => TMap[key].type === type)
    },
    getTemplate: function(msg) {
        // 当前 this 为消息队列组件
        // debugger
        // 获取当前组件的 $createElement 方法，供jsx语法调用，需在生成模板的函数里作为第一个参数传递
        const $h = this.$createElement
        // 获取消息类型分组
        const statusItem = statusMap[msg.msgStatus]
        // 根据类型分组获取对应的消息状态分组
        const typeMap = statusItem.getTypeMap()
        // 获取对应消息的子模板
        const typeTemplate = typeMap[msg.msgType].template.call(this, $h, msg)
        // 获取对应消息的全部模板，提供给 render 函数动态渲染
        return statusItem.template.call(this, $h, { msg, slot: typeTemplate })
    }
}

export default msgDictionary
