<template>
    <div class="h5-liquidation">
        <ul>
            <li v-for="(data, index) in list" :key="index">
                <div class="title">
          <span class="token-name">
            <LPSymbol :pool="data"/>
          </span>
                </div>
                <el-row class="content">
                    <el-col :span="8">
                        <div class="label">
                            {{
                                $t('LiquidationPage.AmountReturned') +
                                '/' +
                                $t('LiquidationPage.QuantityPledge')
                            }}
                        </div>
                        <div class="value">
                            {{ data.expectedRepay | toFixed(4) }}&nbsp;/&nbsp;{{
                                data.amountCollateral | toFixed(4)
                            }}
                        </div>
                    </el-col>
                    <el-col class="center" style="flex: 1" :span="8">
                        <div class="label">
                            {{ $t('LiquidationPage.CurrentLoanDeposit') }}
                        </div>
                        <div class="value">{{ data.billie | toFixed(2) }}%</div>
                    </el-col>
                    <el-col class="right" :span="8">
                        <div class="label">
                            {{ $t('LiquidationPage.LiquidationRatio') }}
                        </div>
                        <div class="value">{{ data.liquidationRate * 100 | toFixed(2) }}%</div>
                    </el-col>
                </el-row>
                <el-row class="btn-group" type="flex" :gutter="10">
                    <el-col>
                        <el-button
                            class="__button swap"
                            size="small"
                            :loading="data.loading"
                            @click="liquidationClick(data, index)"
                        >
                            {{ $t('Public.Liquidation') }}
                        </el-button>
                    </el-col>
                </el-row>
            </li>
            <li class="no-data" v-if="!list.length">{{ $t('Public.NotData') }}</li>
        </ul>
    </div>
</template>

<script>
import LPSymbol from '../../components/LPSymbol';

export default {
    name: 'h5-liquidation',
    props: ['list'],
    components: {
        LPSymbol,
    },
    methods: {
        liquidationClick(data, index) {
            this.$emit('clearingData', {data, index});
        },
    },
};
</script>

<style lang="less" scoped>
.h5-liquidation {
    ul {
        padding-bottom: 40px;
        color: var(--col-main-active);
    }

    li {
        padding: 20px;
        border: 1px solid var(--col-border);
        border-radius: 6px;
        font-weight: 500;
        font-size: 28px;

        &:not(:last-child) {
            margin-bottom: 40px;
        }

        .content {
            padding: 30px 0 15px;
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .title {
            line-height: 1;
            padding: 10px 0 20px;
            border-bottom: 1px solid var(--col-border);
        }

        .label {
            font-size: 20px;
            color: var(--col-label60);
            margin-bottom: 10px;
        }

        .value {
            font-size: 24px;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .btn-group {
            margin-top: 20px;
        }

        &.no-data {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            padding: 40px 0;
        }
    }
}
</style>
