<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('MainView.Swap')" name="first"></el-tab-pane>
            <el-tab-pane :label="$t('MainView.Pool')" name="second"></el-tab-pane>
            <el-tab-pane :label="$t('Nav.Liquidation')" name="third"></el-tab-pane>
            <el-tab-pane label="跨链" name="fourth"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'Tab',
    data() {
        return {
            activeName: 'second',
            list: [

            ]
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>

<style scoped>

</style>
