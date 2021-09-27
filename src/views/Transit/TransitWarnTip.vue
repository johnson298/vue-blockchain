<template>
    <div class="tip">
        {{ isETH ? $t('Transit.Tip.2') : $t('Transit.Tip.3') }}
    </div>
</template>

<script>
export default {
    name: 'TransitWarnTip',
    props: [
        'isETH'
    ]
};
</script>

<style lang="less" scoped>
.tip {
    border-radius: 10px;
    margin: 50px 0 10px 0;
    background-color: #292D31;

    color: rgba(255, 255, 255, 0.5);
    padding: 20px 30px;
    font-size: 14px;
}
</style>
