<template>
    <div class="total-asset">
        <div class="asset">{{ $t('Account.TotalAssets') }}</div>
        <div class="total">$&nbsp;{{ totalAsset | toFixed(2) | toFormat }}</div>
    </div>
</template>

<script>
export default {
    props: ['totalAsset'],
    name: 'total-asset',
};
</script>

<style lang="less" scoped>
.total-asset {
    display: flex;

    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 30px 20px;
    background: rgba(240, 184, 11, 0.05);
    border-radius: 10px;

    .asset {
        color: var(--col-main);
        font-size: 24px;
    }

    .total {
        color: var(--col-main-active);
        font-size: 24px;
        font-weight: bold;
        padding-top: 20px;
    }
}

@media (max-width: 960px) {
    .total-asset {
        flex-direction: column;
        justify-content: center;
        background: transparent;

        width: 100%;

        padding: 0;

        .asset {
            font-size: 24px;
            margin-bottom: 30px;
        }

        .total {
            font-size: 40px;
        }
    }
}
</style>
