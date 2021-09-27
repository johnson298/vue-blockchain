<template>
<div class="detail-inner">
    <div class="descRow">
      <span :class="['vCener', labelClassName]">
        <span class="spaceRight">
          {{ $t('swapControl.Minimumreceived') }}
        </span>
        <a-tooltip
            class="item"
            effect="dark"
            :content="$t('swapControl.proTxts.0')"
        >
          <a-icon class="icon" type="icon-wenhao"/>
        </a-tooltip>
      </span>
        <span class="swap-value">
        {{ SwapState.swapInfo | pick('minAmountOut') | toFixed(6) }}
        &nbsp;
        {{ SwapState.toToken | pick('symbol') }}
      </span>
    </div>
    <div class="descRow">
      <span :class="['vCener', labelClassName]">
        <span class="spaceRight">
          {{ $t('swapControl.PriceImpact') }}
        </span>
        <a-tooltip
            class="item"
            effect="dark"
            :content="$t('swapControl.proTxts.1')"
        >
          <a-icon class="icon" type="icon-wenhao"/>
        </a-tooltip>
      </span>
        <span class="swap-value">
        {{
                    $number(
                        SwapState.swapInfo ? SwapState.swapInfo.percent : 0
                    ).multipliedBy(100) | toFixed(6)
                }}
        %
      </span>
    </div>
    <div class="descRow">
      <span :class="['vCener', labelClassName]">
        <span class="spaceRight">
          {{ $t('swapControl.Fee') }}
        </span>
        <a-tooltip
            class="item"
            effect="dark"
            :content="$t('swapControl.proTxts.2')"
        >
          <a-icon class="icon" type="icon-wenhao"/>
        </a-tooltip>
      </span>
        <span class="swap-value">
        {{
                    SwapState.swapInfo &&
                    $number(from)
                        .multipliedBy($swap.$storage.params.feePercent)
                        .toFixed()
                }}&nbsp;
        {{ SwapState.fromToken | pick('symbol') }}
      </span>
    </div>
</div>
</template>
<script>
import {swapHelper} from '../../../store/swap.module';

export default {
    name: 'DetailInner',
    props: {
        labelClassName: '',
        from: ''
    },
    computed: {
        ...swapHelper.mapState(['SwapState']),
    },
};
</script>
<style lang="less" scoped>
    .detail-inner {
        font-size: 16px;
    }

    .spaceRight {
        margin-right: 20px;
        //color: var(--col-label60);

        &.item {
            color: var(--col-main-active);
        }
    }

    .descRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .swap-value {
            font-weight: 700;
        }
    }

    .vCener {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        font-size: 21px;
    }
</style>
