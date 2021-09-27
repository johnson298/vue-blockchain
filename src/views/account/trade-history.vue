<template>
    <div class="trade-history">
        <el-table
            :empty-text="$t('Public.NotData')"
            class="__table"
            :data="list"
            v-loading="loading"
            style="width: 100%"
        >
            <el-table-column :label="$t('FundPool.TradingHours')">
                <template slot-scope="scope">
                    <span>{{ scope.row.date | moment }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('FundPool.Active')">
                <template slot-scope="scope">
                    <span>{{ scope.row.text }}</span>
                </template>
            </el-table-column>
            <el-table-column align="right" :label="$t('FundPool.Hash')">
                <template slot-scope="scope">
          <span class="blue __cursor" @click="etherscanTxClick(scope.row)">{{
                  scope.row.hash | hash
              }}</span>
                </template>
            </el-table-column>
        </el-table>
        <!--        <div class="button-box">-->
        <!--            <el-button-->
        <!--                    :loading="moreLoading"-->
        <!--                    @click="moreClick"-->
        <!--                    class="public-button-light button">-->
        <!--                {{$t('LiquidationPage.LoadMore')}}-->
        <!--            </el-button>-->
        <!--        </div>-->
    </div>
</template>

<script>
import ChainApi from '../../../static/sdk/ChainApi';
import {mapState} from 'vuex';
import BigNumber from 'bignumber.js';

export default {
    name: 'trade-history',
    data() {
        return {
            list: [],
            moreLoading: false,
            loading: false,
            pagination: {
                // 分页的数据
                totalItems: 0,
                pageSize: 10,
                currentPage: 1,
            },
            json: {
                AAAAMINT_MINT: this.$t('Button.Receive'),
                AAAAPOOL_WITHDRAW: this.$t('Button.Extract'),
                AAAAPOOL_BORROW: this.$t('Button.Loan'),
                AAAAPOOL_DEPOSIT: this.$t('Button.Deposit'),
                AAAAPOOL_REPAY: this.$t('Button.Repayment'),
                AAAAPOOL_REINVEST: this.$t('Button.ReInvestment'),
                AAAAPOOL_LIQUIDATION: this.$t('Public.Liquidation'),
                AAAAPOOL_MINTLENDER: this.$t('Public.MintLender'),
                AAAAPOOL_MINTBORROWER: this.$t('Public.MintBorrower'),
                AAAASHARE_PRODUCTIVITYINCREASED: 'Staking' + this.$t('Button.Deposit'),
                AAAASHARE_PRODUCTIVITYDECREASED: 'Staking' + this.$t('Button.Extract'),
                AAAASHARE_MINT: 'Staking' + this.$t('Button.Receive'),
                AAAAREWARD_PRODUCTIVITYINCREASED: `${this.$project} ${this.$t(
                    'Button.Deposit'
                )}`,
                AAAAREWARD_PRODUCTIVITYDECREASED: `${this.$project} ${this.$t(
                    'Button.Extract'
                )}`,
                AAAAREWARD_MINT: `${this.$project} ${this.$t('Button.Receive')}`,
                AAAABALLOT_VOTED: this.$t('Button.Vote'),
                AAAABALLOT_CLAIMED: this.$t('Button.GovernanceAwards'),
                AAAAFACTORY_BALLOTCREATED: this.$t('Button.InitiateAProposal'),
            },
        };
    },
    watch: {},
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            account: 'account',
        }),
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.isConnect) {
                this.queryPoolList();
            } else {
                this.list = [];
            }
        },
        queryPoolList() {
            ChainApi.queryPoolList().then((res) => {
                this.loadTradingLog();
            });
        },
        loadTradingLog() {
            const arr = ChainApi.getTradingList(this.account);
            this.list = arr.map((d) => {
                console.log(d.type);
                return {
                    date: d.time,
                    hash: d.hash,
                    text: ((this.json && this.json[d.type]) || '--') + ' ' + d.content,
                };
            });
        },

        moreClick() {
            this.moreLoading = true;
        },
        etherscanTxClick(data) {
            if (data.hash) {
                window.open(ChainApi.getEtherscanTx(data.hash));
            }
        },
    },
};
</script>

<style lang="less" scoped>
.trade-history {
    padding: 0 30px;

    .button-box {
        display: flex;
        justify-content: center;
        padding-top: 30px;
    }
}

@media (max-width: 960px) {
    .trade-history {
        padding: 0 30px;
    }
}
</style>
