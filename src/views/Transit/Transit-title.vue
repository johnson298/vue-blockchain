<template>
    <div class="transit-title">
        <div class="ERC20">
            {{ $t(label) }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Transit-title',
    props: ['label']
};
</script>

<style lang="less" scoped>
.transit-title {
    .ERC20 {
        color: var(--col-main-active);
        font-size: 24px;
        font-weight: bold;
        padding: 30px 0 20px 0;
    }
}
</style>
