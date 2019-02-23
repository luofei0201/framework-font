import {
  TIME_3_MIN,
  msgStatus,
  msgTypes,
  sessionStatus
} from '@/common/js/status'
import {
  Right,
  Left
} from '@/common/js/container/either'

const _ = require('ramda')

const DateTools = {
  minutes2Timestamp: function(m) {
    return +m * 60 * 1000
  },

  hours2Timestamp: function(h) {
    return +h * 60 * 60 * 1000
  },

  formatDate: function(date, format) {
    if (format === undefined) {
      format = date
      date = new Date()
    }
    var map = {
      'M': date.getMonth() + 1, // 月份
      'd': date.getDate(), // 日
      'h': date.getHours(), // 小时
      'm': date.getMinutes(), // 分
      's': date.getSeconds(), // 秒
      'q': Math.floor((date.getMonth() + 3) / 3) // 季度
    }
    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
      var v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      } else if (t === 'S') {
        const ms = `00${date.getMilliseconds()}`
        return ms.substr(ms.length - 3)
      }
      return all
    })
    return format
  },

  isTimeDiffLongEnough: function(cache, next) {
    if (typeof cache === 'string') {
      cache.replace(/-/g, '/')
    }
    if (typeof next === 'string') {
      next.replace(/-/g, '/')
    }
    const cacheT = new Date(cache)
    const nextT = new Date(next)
    return nextT - cacheT >= TIME_3_MIN
  },

  isCacheValid: function(cacheT, quality) {
    const now = new Date()
    const cache = new Date(cacheT)
    // 缓存时间为当天，且当前时间小于系统配置缓存过期时刻
    return (cache.getDate() === now.getDate()) && (now.getHours() < +quality)
  },

  isWorkTime: function({
    startTime,
    endTime
  }) {
    const strb = startTime.split(':')
    if (strb.length !== 2) {
      return false
    }

    const stre = endTime.split(':')
    if (stre.length !== 2) {
      return false
    }

    let b = new Date()
    let e = new Date()
    let n = new Date()

    b.setHours(strb[0])
    b.setMinutes(strb[1])
    e.setHours(stre[0])
    e.setMinutes(stre[1])

    return n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0
  },

  isSendTipMsgTime: (function() {
    let tipMsgTimeCache = new Date()
    return function(nextT) {
      if (!nextT) {
        return false
      }
      const res = this.isTimeDiffLongEnough(tipMsgTimeCache, nextT)
      res && (tipMsgTimeCache = nextT)
      return res
    }
  })()
}

const AsyncTools = {
  // fastClickTimer: function() {
  //   let timer = null
  //   return (function() {
  //     debugger
  //     if (timer) {
  //       const err = '请勿重复点击'
  //       return { state: false, err }
  //     } else {
  //       timer = setTimeout(() => {
  //         clearTimeout(timer)
  //         timer = null
  //       }, 10000)
  //       return { state: true }
  //     }
  //   })()
  // },

  debounce: function(func, time) {
    let timer

    return function(...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
        clearTimeout(timer)
      }, time)
    }
  },

  sleep: function(time) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve()
      }, time)
    })
  },

  sleepByAnimation: function(time) {
    return new Promise((resolve, reject) => {
      var start = null
      const step = function(timestamp) {
        if (!start) start = timestamp
        const progress = timestamp - start
        if (progress < time) {
          window.requestAnimationFrame(step)
        } else {
          resolve()
        }
      }
      window.requestAnimationFrame(step)
    })
  }
}

const CharTools = {
  // 正则判断一个字符的结尾是否是emoji
  isLastStrEmoji: function(str) {
    // 最后两位字符
    const lastTwoCharacter = str.substring(str.length - 2, str.length)
    // 转码
    const transcode = this.utf16toEntities(lastTwoCharacter)
    return /&#(.*);/g.test(transcode)
  },

  // 带emoji字符转编码
  utf16toEntities: function(str) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
    str = str.replace(patt, function(char) {
      var H, L, code
      if (char.length === 2) {
        H = char.charCodeAt(0) // 取出高位
        L = char.charCodeAt(1) // 取出低位
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00 // 转换算法
        return `&#${code};`
      } else {
        return char
      }
    })
    return str
  }
}

const CopyTools = {
  // 浅拷贝
  objShallowClone: function(obj) {
    let newObj = {}
    for (let key in obj) {
      newObj[key] = obj[key]
    }
    return newObj
  },

  // 深拷贝
  objDeepClone: function(obj) {
    // return JSON.parse(JSON.stringify(obj))
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        var newArr = []
        for (var i = 0; i < obj.length; i++) newArr.push(obj[i])
        return newArr
      } else {
        var newObj = {}
        for (var key in obj) {
          newObj[key] = this.objDeepClone(obj[key])
        }
        return newObj
      }
    } else {
      return obj
    }
  },

  // 深拷贝自定义对象
  objWithTypeDeepClone: function(obj) {
    // return JSON.parse(JSON.stringify(obj))
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        var newArr = []
        for (var i = 0; i < obj.length; i++) newArr.push(obj[i])
        return newArr
      } else {
        var newObj = Object.create(obj)
        for (var key in obj) {
          const self = this
          Object.defineProperty(newObj, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: self.objWithTypeDeepClone(obj[key])
          })
        }
        return newObj
      }
    } else {
      return obj
    }
  },

  // 数组拷贝
  arrShallowClone: function(arr) {
    return arr.slice(0)
  }
}

const RectTools = {
  // 获取dom基于offsetParent的位置
  getRect: function(el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    }
  },

  // 获取dom基于屏幕的位置
  getRectLimitDoc: function(e) {
    const Rect = e.targetTouches[0]
    return {
      top: Math.round(Rect.clientY),
      left: Math.round(Rect.clientX),
      width: e.target.offsetWidth,
      height: e.target.offsetHeight
    }
  }
}

const MsgsFilterTools = {
  // 机器人答案过滤 a 标签
  // transA2Button: function(answer) {
  //   const regA = /<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/g
  //   if (!answer.match(regA)) {
  //     return answer
  //   }
  //   const regHref = /href="(.*?)"/g
  //   // eslint-disable-next-line
  //   const regUrl = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g
  //   return answer.replace(regHref, `href="javascript:;" onclick="return false;"`)
  //   // return answer.replace(regHref, `href="javascript:;"`) answer.match(regUrl)[0] store.commit('SET_ASSESS_VIEW', true)
  // },

  // 机器人答案链接统一为https
  // transHttp2Https: function(url) {
  //   return url.match(/https/) ? url : url.replace(/http/, 'https')
  // },

  // 机器人消息解析器
  botAnswerfilter: function(data) {
    let msg = {
      content: '',
      nickName: data.botName,
      isSelfSend: false,
      time: data.time,
      timestamp: new Date().getTime() + 500,
      msgStatus: msgStatus.msg,
      chatType: sessionStatus.robot
    }
    if (data.info.length === 1) {
      if (data.info[0].question === '如何转人工') {
        // 转人工
        msg.msgType = msgTypes.msg_no_idea
      } else {
        // normal
        // msg.content = this.transA2Button(data.info[0].answer)
        msg.content = data.info[0].answer
        msg.msgType = msgTypes.msg_normal
      }
    } else if (data.info.length === 3) {
      // 猜问题
      msg.msgType = msgTypes.msg_guess
      msg.msgExtend = [{
          question: data.info[0].question,
          answer: data.info[0].answer
          // answer: this.transA2Button(data.info[0].answer)
        },
        {
          question: data.info[1].question,
          answer: data.info[1].answer
          // answer: this.transA2Button(data.info[1].answer)
        },
        {
          question: data.info[2].question,
          answer: data.info[2].answer
          // answer: this.transA2Button(data.info[2].answer)
        }
      ]
    }
    return msg
  },

  // IM消息解析
  parseMsg: function(newMsg) {
    var msgItem = newMsg.getElems()[0]
    var type = msgItem.getType()
    if (type === 'TIMCustomElem') {
      var content = msgItem.getContent() // 获取元素对象
      var desc = JSON.parse(content.getDesc())
      var msgType = desc.msgType
      var msgStatus = desc.msgStatus
      var time = desc.time
      var nickName = desc.nickName
      var avatar = desc.avatar
      var chatType = desc.chatType
      var ext = JSON.parse(content.getExt())
      if (ext.imgData) {
        var imgData = ext.imgData
      }
      if (ext.proxyInfo) {
        var proxyInfo = ext.proxyInfo
      }
      if (ext.giftInfo) {
        var giftInfo = ext.giftInfo
      }
    }
    return {
      nickName,
      avatar,
      imgData,
      proxyInfo,
      giftInfo,
      content: newMsg.toHtml(),
      isSelfSend: newMsg.getIsSend(),
      isSystem: newMsg.getFromAccount() === '@TIM#SYSTEM' || false,
      msgType,
      msgStatus,
      chatType,
      time
    }
  }
}

const CacheTools = {
  // 从localStorage取对应字段的缓存
  getCacheData: function({
    key,
    check,
    quality
  }) {
    const cache = window.localStorage.getItem(key)
    const cacheObj = cache ? JSON.parse(cache) : ''
    if (!cache) {
      // 缓存为null
      return null
    }
    // if (quality && !DateTools.isCacheValid(cacheObj.timestamp, quality)) {
    if (quality && !quality.compare(cacheObj.timestamp)) {
      // 缓存过期
      return undefined
    }
    if (cacheObj.check !== check) {
      // 缓存校验不通过
      return false
    }
    return cacheObj.data
  },

  // 存localStorage
  setCacheData: function({
    key,
    check,
    data
  }) {
    window.localStorage.setItem(key, JSON.stringify({
      timestamp: new Date().getTime(),
      check,
      data
    }))
  },

  // 跟新当前服务缓存消息
  updateCacheData: function({
    key,
    msgs,
    timestamp
  }) {
    let cache = window.localStorage.getItem(key)
    if (!cache) {
      // 当前无对应key值的缓存，
      return
    }
    cache = cache.parseJSON()
    msgs && (cache.data.msgs = msgs)
    timestamp && (cache.timestamp = timestamp)
    window.localStorage.setItem(key, JSON.stringify(cache))
  },

  // 清空本地localstorage
  removeCacheData: function(key) {
    window.localStorage.removeItem(key)
  }
}

let Tools = Object.assign({}, {
  DateTools: Object.create(DateTools),
  AsyncTools: Object.create(AsyncTools),
  CharTools: Object.create(CharTools),
  CopyTools: Object.create(CopyTools),
  RectTools: Object.create(RectTools),
  MsgsFilterTools: Object.create(MsgsFilterTools),
  CacheTools: Object.create(CacheTools),
  compose: _.compose,
  curry: _.curry,
  map: _.map,
  reduce: _.reduce,
  equals: _.equals,
  // trace :: a -> b -> b
  trace: _.curry(function(tag, x) {
    console.log(tag, x)
    return x
  }),
  // paging :: (a -> b) -> c -> [a] -> [b]
  paging: _.curry(function(f, pageSize, arr) {
    const totalPage = Math.ceil(arr.length / pageSize) // 页数
    return new Array(totalPage).fill(0).map(f)
  }),
  // strWithLink :: String -> String
  strWithLink: _.curry(function(str, style) {
    // eslint-disable-next-line
    const regUrl = /(<(a|\/a).*?>|((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#]))/gi
    const regA = /<(a|\/a).*?>/g
    // 数组是否为空，或者为null
    const isEmpty = (arr) => arr && arr.length === 0
    // 字符串是否为node节点a
    const notANode = _.compose(isEmpty, _.match(regA))
    const getStrWithLink = _.replace(regUrl, item => notANode(item) ? `<a href="${item}" target="_blank">${item}</a>` : item)
    return getStrWithLink(str)
  }),
  // over -> Number -> Number -> Bool
  over: _.curry(function(limit, data) {
    return data >= limit
  }),
  // getState :: Function -> Number -> Either(Number, Number)
  getState: _.curry(function(f, data) {
    return f(data) ? Right.of(data) : Left.of(data)
  }),
  // 取一定范围内的随机数
  randomMin2Max: _.curry(function(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }),
  // 获取路径中的所有query
  getRealQuery: function(url) {
    // if (!url.match(/#/)) url = `${url}#`
    const toPairs = _.compose(_.map(_.split('=')), _.split('&'))
    const queryArr = _.compose(toPairs, _.last, _.split('?'))
    const arr2Obj = (old, cur) => {
      old[cur[0]] = cur[1].replace(/(\/|#)/g, '')
      return old
    }
    const getQueryObj = _.compose(_.reduce(arr2Obj, {}), queryArr)
    return getQueryObj(url)
  },
  // 生成会话id
  getRamSessionId: function() {
    const date = this.DateTools.formatDate('yyyy-MM-dd-hh-mm-ss-SSS').split(/-/g).join('')
    const ram = this.randomMin2Max(100000)(999999)
    return `${sessionStatus.robot}${date}${ram}`
  },
  // 尾递归合并两个深度为2，且含有相同 key 的对象
  merge: function(obj1, obj2) {
    function merger(inital, curKey, ...restKey) {
      // warn: 会更改 inital 对象
      // 当前需要合并的对象
      const mergeObj = obj2[curKey]
      // 合并
      mergeObj && Object.assign(inital[curKey], mergeObj)

      return restKey.length
        ? merger(inital, ...restKey)
        : inital
    }
    // deepCopy obj1
    let target = JSON.parse(JSON.stringify(obj1))

    return merger(target, ...Object.keys(target))
  }
})

export default Tools
