<template>
    <div class="liquidity-info">
        <div class="title">
            {{ $t('AddLiquidityUI.pricesTitle') }}
        </div>
        <div class="content">
            <div class="item">
                <div class="number">{{ info | pick('APerB') | toFixed(6) }}</div>
                <div class="info">
                    {{ tokenA | pick('symbol') }} per {{ tokenB | pick('symbol') }}
                </div>
            </div>
            <div class="item">
                <div class="number">{{ info | pick('BPerA') | toFixed(6) }}</div>
                <div class="info">
                    {{ tokenB | pick('symbol') }} per {{ tokenA | pick('symbol') }}
                </div>
            </div>
            <div class="item">
                <div class="number">{{ info | pick('percent') | toFixed(6) }} %</div>
                <div class="info" style="text-align: right">
                    {{ $t('AddLiquidityUI.g2_txt3') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LiquidityInfo',
    props: ['info', 'tokenA', 'tokenB'],
};
</script>
<style lang="less" scoped>
.liquidity-info {
    margin-bottom: 30px;
    color: var(--col-main-active);
}

.title {
    padding: 30px 0 20px 0;
    font-size: 16px;
}

.content {
    background: var(--col-content);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 40px;
    margin-bottom: 20px;
}

.item {
    line-height: 20px;
}

.number {
    font-size: 20px;
    margin-bottom: 24px;
}

.info {
    font-size: 16px;
    color: var(--col-label60);
}
</style>
