<template>
    <ul>
        <li v-for="(data, index) in poolList" :key="index">
            <div class="title">
                <span class="token-name">
                  <LPSymbol :pool="data"/>
                </span>
                <span class="btn-box">
                  <el-button class="btn-deposit" size="small" @click="go(data, '0')">
                    {{ $t('Button.Deposit') }}
                  </el-button>
                  <el-button class="btn-borrow" size="small" @click="go(data, '1')"
                  >{{ $t('Button.Loan') }}
                  </el-button>
                </span>
            </div>

            <el-row class="content">
                <el-col :span="8">
                    <div class="label">{{ $t('FundPool.Table.MarketSize') }}</div>
                    <div class="value">
                        $ {{ data.lockUpValue | toFixed(2) | toFormat }}
                    </div>
                </el-col>
                <el-col class="center" :span="8">
                    <div class="label">{{ $t('Account.AmountLoan') }}</div>
                    <div class="value">
                        {{
                            $shiftedBy(data.totalPledge, -data.collateralTokenDecimals)
                                | toFixed(2)
                                | toFormat
                        }}
                    </div>
                </el-col>
                <el-col class="right" :span="8">
                    <div class="label">{{ $t('Account.AmountDeposits') }}</div>
                    <div class="value">
                        {{
                            $shiftedBy(data.remainSupply, -data.supplyTokenDecimals)
                                | toFixed(2)
                                | toFormat
                        }}
                    </div>
                </el-col>
            </el-row>
            <el-row class="content radius">
                <el-col :span="8">
                    <div class="label">{{ $t('FundPool.Table.AnnualDeposit') }}</div>
                    <div class="value">{{ data.apy | moreLessThan }}%</div>
                </el-col>
                <el-col class="center" :span="8">
                    <div class="label">{{ $t('FundPool.Table.AnnuaLisationLoans') }}</div>
                    <div class="value">{{ data.apr | moreLessThan }}%</div>
                </el-col>
                <el-col class="right" :span="8">
                    <div class="label">{{ $t('FundPool.Table.UtilizationRate') }}</div>
                    <div class="value">{{ $getRate(data) }}%</div>
                </el-col>
            </el-row>
        </li>
    </ul>
</template>

<script>
import LPSymbol from '../../components/LPSymbol';

export default {
    name: 'h5-pool',
    props: ['poolList'],
    components: {
        LPSymbol,
    },
    data() {
        return {
            list: [],
        };
    },
    mounted() {
    },
    methods: {
        go(data, type) {
            this.$emit('linkPool', {data, type});
        },
    },
};
</script>

<style lang="less" scoped>
ul {
    padding-bottom: 40px;
    color: var(--col-font);
}

li {
    //padding: 20px;
    //border: 1px solid var(--col-border);
    border-radius: 6px;
    //font-weight: 500;
    font-size: 28px;

    &:not(:last-child) {
        margin-bottom: 20px;
    }

    .content {
        padding: 20px 20px 20px 20px;
        background: rgba(0, 0, 0, 0.05);
    }

    .radius {
        border-radius: 0 0 6px 6px;
    }

    .title {
        padding: 0 20px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 6px 6px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;

        .btn-box {
            display: flex;
        }
    }

    .label {
        font-size: 20px;
        margin-bottom: 10px;
        color: rgba(#fff, 0.5);
    }

    .value {
        font-size: 24px;
        color: var(--col-label);

        &.yellow {
            color: var(--col-deposit);
            font-weight: bold;
        }

        &.blue {
            color: var(--col-borrow);
            font-weight: bold;
        }
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
}
</style>
