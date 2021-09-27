<template>
    <div class="loan-page">
        <Asset color="#5EA6EE" :token="token" :total="borrowsValue" :type="'loan'">
            <el-table
                :empty-text="$t('Public.NotData')"
                class="__table"
                :data="borrowList"
                style="width: 100%"
            >
                <el-table-column width="220" :label="$t('Account.FundPool')">
                    <template slot-scope="scope">
            <span>
              <LPSymbol :imgHide="true" :pool="scope.row"/>
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="right"
                    :label="`${$t('Account.AmountLoan')} (${token})`"
                >
                    <template slot-scope="scope">
            <span>
              {{ scope.row.amountSupply | toFixed(2) | toFormat }}
            </span>
                    </template>
                </el-table-column>
                <el-table-column align="right" :label="$t('Account.ProportionPool')">
                    <template slot-scope="scope">
                        <span> {{ scope.row.billie | toFixed(2) }}% </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="right"
                    :label="`${$t('Account.NetAssetValue')}(USDT)`"
                >
                    <template slot-scope="scope">
            <span>
              {{ scope.row.netWorth | toFixed(2) | toFormat }}
            </span>
                    </template>
                </el-table-column>
            </el-table>
            <!--      <el-divider />-->
        </Asset>
    </div>
</template>

<script>
import Asset from './asset';
import LPSymbol from '../../components/LPSymbol';
import ChainApi from '../../../static/sdk/ChainApi';

export default {
    components: {
        Asset,
        LPSymbol,
    },
    props: ['list', 'token'],
    name: 'loan',
    data() {
        return {
            borrowList: [],
            borrowsValue: 0,
        };
    },

    watch: {
        list: {
            handler(val) {
                Promise.all(
                    val.map((d) => {
                        return ChainApi.getPrice(d.collateralToken).then((pledgePrice) => {
                            return ChainApi.borrows(d.pair).then((borr) => {
                                return {
                                    pool: d,
                                    borr: borr,
                                    pledgePrice: pledgePrice,
                                };
                            });
                        });
                    })
                ).then(([...arg]) => {
                    let val = 0;
                    this.borrowList = arg.map((data, i) => {
                        const {borr, pool, pledgePrice} = data;
                        const total = this.$number(pool.totalBorrow)
                            .plus(pool.remainSupply)
                            .shiftedBy(-pool.supplyTokenDecimals);
                        const borrow = this.$number(borr.amountBorrow)
                            .shiftedBy(-pool.supplyTokenDecimals)
                            .toNumber();
                        const worth = this.$number(borrow)
                            .multipliedBy(pledgePrice)
                            .toNumber();
                        val += worth;
                        return {
                            amountSupply: borrow,
                            billie:
                                total == 0
                                    ? 0
                                    : this.$number(borrow).dividedBy(total).multipliedBy(100),
                            netWorth: worth,
                            ...pool,
                        };
                    });
                    this.borrowsValue = val;
                });
            },
            immediate: true,
        },
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.loan-page {
    margin-top: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 20px rgba(21, 11, 112, 0.08);
    border-radius: 10px;
}
</style>
