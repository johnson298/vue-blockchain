<template>
    <div class="calc-bnb">
        ≈  {{BNBNumber}}  BNB
    </div>
</template>

<script>
export default {
    name: 'Calc-BNB',
    props: ['BNBNumber']
};
</script>

<style lang="less" scoped>
.calc-bnb {
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--col-main-active);
    font-size: 16px;
}
</style>
