<template>
<div :class="['price', className]">
    <span class="space label">
        {{ $t('swapControl.PriceText') }}
    </span>
    <div class="desc">
          <span class="space">
                {{ price }} {{ tokens[0] && tokens[0].symbol }} &nbsp;{{          $t('swapControl.per')}}&nbsp;
                {{ tokens[1] && tokens[1].symbol }}
          </span>
        <a-icon class="icon" type="icon-transfer" @click="directChange"/>
    </div>
</div>
</template>
<script>
import {swapHelper} from '@/store/swap.module';

export default {
    name: 'PriceChange',
    props: {
        className: '',
    },
    computed: {
        ...swapHelper.mapState(['SwapState']),
        price() {
            return this.SwapState.swapInfo
                ? this.$number(
                    this.SwapState.direct
                        ? this.SwapState.swapInfo?.BPerA
                        : this.SwapState.swapInfo?.APerB
                ).toFixed(SwapInstance.fixed)
                : '0.0';
        },
        tokens() {
            const price = this.SwapState.swapInfo
                ? this.$number(
                    this.SwapState.direct
                        ? this.SwapState.swapInfo?.BPerA
                        : this.SwapState.swapInfo?.APerB
                ).toFixed(SwapInstance.fixed)
                : '0.0';
            return !this.SwapState.direct
                ? [this.SwapState.fromToken, this.SwapState.toToken]
                : [this.SwapState.toToken, this.SwapState.fromToken];
        },
    },
    methods: {
        directChange() {
            if (this.SwapState.swapInfo) {
                this.$store.commit('swap/setDirect', !this.SwapState.direct);
            }
        },
    },
};
</script>
<style lang="less" scoped>
    .price {
        display: flex;
        font-size: 16px;
        // font-weight: 700;
        align-items: center;
        margin-bottom: 20px;
        color: var(--col-main);

        .desc {
            display: flex;
            align-items: center;
        }

        .space {
            margin-right: 15px;
        }

        .icon {
            cursor: pointer;
            color: var(--col-main);
            font-size: 20px;
        }
    }
</style>
