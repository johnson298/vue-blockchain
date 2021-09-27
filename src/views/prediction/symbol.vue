<template>
    <el-dialog
        width="480px"
        :append-to-body="true"
        class="_symbol-modal"
        :visible="symbolVisible"
        :close-on-click-modal="false"
        @close="cancel"
    >
        <div class="_symbol-list"
            v-for="(item, index) of symbolList"
            :key="index"
            @click="cancel(item)">
            <img src="../../assets/images/icons/BTCB.png" alt="">
            <span>{{item.name}}</span>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'symbol',
    props: ['symbolVisible', 'symbolList'],
    methods: {
        cancel(item) {
            this.$emit('close', item)
        }
    }
}
</script>

<style scoped lang="less">

</style>
