<template>
    <div class="testT">
        {{$route.params.id}}
    </div>
</template>

<script>
export default {
    mounted() {
        const id = this.$route.params.id
        console.log('数据变化辣 ！！  ', id)
    }
}
</script>

<style lang="less">

</style>
