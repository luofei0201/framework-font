<template>
    <div class="test">
        <router-link :to="{path: `/test/${item.a}`}" v-for="item in getSessionsList" :key="`id_${item.a}`">{{item.a}}</router-link>
        <button @click="sessionList.addSessions({ a: '444', show: false })">添加会话</button>
        <ul>
            <keep-alive>
                <router-view></router-view>
                <!-- <li v-for="(item, index) in getSessionsList" v-show="item.show" :key="index">{{item.a}}</li> -->
            </keep-alive>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            sessionList: null
        }
    },
    computed: {
        getSessionsList() {
            return this.sessionList.list
        }
    },
    created() {
        this.sessionList = this.initSess()
        console.log(this.sessionList)
    },
    mounted() {
        console.log('================================= 初始化 test =================================')

        this.$nextTick(() => {
            document.getElementById('app').style.display = 'block'
            document.getElementById('appLoading').style.display = 'none'
        })
    },
    methods: {
        initSess() {
            class SessionList {
                constructor(list) {
                    this.list = list
                }
                getSessions(idx) {
                    return this.list[idx]
                }
                addSessions(session) {
                    this.list = this.list.concat(session)
                }
            }
            return new SessionList([
                { a: '111', show: false },
                { a: '222', show: true },
                { a: '333', show: false }
            ])
        }
    }
}
</script>

<style lang="less">

</style>
