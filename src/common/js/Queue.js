let Queue = {
    // 成员
    dataStore: [],
    // 初始化
    init: function(arr) {
        this.dataStore = arr
    },
    // 头部入队，就是在数组的头部添加一个元素
    enqueueFront: function(element) {
        this.dataStore.splice(0, 0, element)
    },
    // 尾部入队，就是在数组的末尾添加一个元素
    enqueueBack: function(element) {
        this.dataStore.push(element)
    },
    // 头部出队，就是删除数组的第一个元素
    dequeueFront: function() {
        return this.dataStore.shift()
    },
    // 尾部出队，就是删除数组的最后一个元素
    dequeueBack: function() {
        const a = this.dataStore.splice(this.dataStore.length - 1, 1)
        return a[0]
    },
    // 取出数组的第一个元素
    front: function() {
        return this.dataStore[0]
    },
    // 取出数组的最后一个元素
    back: function() {
        return this.dataStore[this.dataStore.length - 1]
    },
    // 判断数组是否为空
    isEmpty: function() {
        return this.dataStore.length === 0
    },
    // 返回数组中元素的个数
    count: function() {
        return this.dataStore.length
    }
}

export default Queue
