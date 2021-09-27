<template>
    <div class="survey-page">
        <Asset
            color="#f0b80b"
            :total="depositValue"
            :token="token"
            :type="'deposit'"
        >
            <el-table
                :empty-text="$t('Public.NotData')"
                class="__table"
                :data="depositList"
                style="width: 100%"
            >
                <el-table-column :label="$t('Account.FundPool')" width="220">
                    <template slot-scope="scope">
                        <LPSymbol :imgHide="true" :pool="scope.row"/>
                    </template>
                </el-table-column>
                <el-table-column
                    align="right"
                    :label="`${$t('Account.AmountDeposits')}(${token})`"
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
                    :label="`${$t('Account.NetAssetValue')} USDT)`"
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
    name: 'deposit',
    data() {
        return {
            depositList: [],
            depositValue: 0,
        };
    },
    computed: {},
    watch: {
        list: {
            handler(val) {
                Promise.all(
                    val.map((d) => {
                        return ChainApi.getPrice(d.supplyToken).then((pledgePrice) => {
                            return ChainApi.supplys(d.pair).then((supply) => {
                                return {
                                    pool: d,
                                    supplys: supply,
                                    pledgePrice: pledgePrice,
                                };
                            });
                        });
                    })
                ).then(([...arg]) => {
                    let val = 0;
                    this.depositList = arg.map((d) => {
                        const {pool, supplys, pledgePrice} = d;
                        const total = this.$number(pool.totalBorrow)
                            .plus(pool.remainSupply)
                            .shiftedBy(-pool.supplyTokenDecimals);
                        const suppy = this.$number(supplys.amountSupply).shiftedBy(
                            -pool.supplyTokenDecimals
                        );
                        const worth = suppy.multipliedBy(pledgePrice).toNumber();
                        // console.log('total:', total)
                        val += worth;
                        return {
                            amountSupply: suppy,
                            billie: total == 0 ? 0 : suppy.dividedBy(total).multipliedBy(100),
                            netWorth: worth,
                            ...pool,
                        };
                    });
                    this.depositValue = val;
                });
            },
            immediate: true,
        },
    },
    methods: {},
    mounted() {
    },
};
</script>

<style lang="less" scoped>
.survey-page {
    margin-top: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(21, 11, 112, 0.08);
    border-radius: 10px;
}
</style>
