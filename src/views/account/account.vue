<template>
    <div class="account-page">
        <header>
            <TotalAsset :totalAsset="assetTotalValue"></TotalAsset>
        </header>
        <div class="button-box">
            <el-button
                v-for="item in list"
                :key="item.name"
                class="tab-item"
                @click="switchClick(item)"
                :class="['tab-btn', { active: item.active }]"
            >
                {{ item.name }}
            </el-button>
        </div>
        <a-loading :loading="loading">
            <div class="__container">
                <div class="tab-list">
                    <template v-if="type === 'AssetProfile'">
                        <div v-for="(item, key) in poolsMap" :key="key">
                            <Deposit :list="item" :token="key"/>
                            <Loan :list="item" :token="key"/>
                        </div>
                        <Pledge :list="pledgeList"/>
                    </template>
                    <!--        <MiningRevenue v-if="type === 'MiningRevenue'"></MiningRevenue>-->
                    <template v-else-if="type === 'TransactionHistory'">
                        <TradeHistory></TradeHistory>
                    </template>
                    <template v-else-if="type === 'LiquidationHistory'">
                        <LiquidationHistory></LiquidationHistory>
                    </template>
                </div>
            </div>
        </a-loading>

    </div>
</template>

<script>
import TotalAsset from './total-asset';
import Deposit from './deposit';
import Loan from './loan';
import Pledge from './pledge';
import TradeHistory from './trade-history';
import LiquidationHistory from './liquidation-history';
import MiningRevenue from './mining-revenue';
import {mapGetters, mapState} from 'vuex';
import ChainApi from '../../../static/sdk/ChainApi';

export default {
    name: 'account',
    components: {
        TotalAsset,
        Deposit,
        Loan,
        Pledge,
        TradeHistory,
        LiquidationHistory,
        MiningRevenue,
    },
    data() {
        return {
            list: [
                {name: this.$t('Account.AssetProfile'), active: true, type: 'AssetProfile'},
                // { name: this.$t("Account.MiningRevenue"), active: false, type: 'MiningRevenue' },
                {name: this.$t('Account.TransactionHistory'), active: false, type: 'TransactionHistory'},
                {name: this.$t('Account.LiquidationHistory'), active: false, type: 'LiquidationHistory'},
            ],
            depositValue: '0',
            pledgeList: [],
            lpTokenUSDT: '0',
            borrowsValue: '0',
            type: 'AssetProfile'
        };
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            account: 'account',
            poolList: 'poolList',
            loading: 'loading',
        }),
        ...mapGetters(['poolsMap']),
        assetTotalValue() {
            if (this.isConnect) {
                return this.$number(this.depositValue).plus(this.lpTokenUSDT);
            } else {
                return '--';
            }
        },
    },
    watch: {
        isConnect() {
            this.init();
        },
        poolList: {
            handler(newVal, oldVal) {
                this.init();
            },
            immediate: true,
        },
    },
    methods: {
        init() {
            this.getDeposit();
            this.getLoan();
        },
        getDeposit() {
            Promise.all(
                this.poolList.map((d) => {
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
                arg.forEach((d) => {
                    const {pool, supplys, pledgePrice} = d;
                    const suppy = this.$number(supplys.amountSupply)
                        .shiftedBy(-pool.supplyTokenDecimals)
                        .multipliedBy(pledgePrice)
                        .toNumber();
                    val += Number(suppy);
                });
                this.depositValue = val;
            });
        },

        getLoan() {
            Promise.all(
                this.poolList.map((d) => {
                    return ChainApi.getPrice(d.collateralToken).then((pledgePrice) => {
                        return ChainApi.borrows(d.pair).then((borr) => {
                            return {
                                pool: d,
                                pledgePrice: pledgePrice,
                                borr: borr,
                            };
                        });
                    });
                })
            ).then(([...arg]) => {
                let valUSDT = 0;
                const merge = {};
                arg.forEach((data) => {
                    const {borr, pool, pledgePrice} = data;
                    const pledgeUSDT = this.$number(borr.amountCollateral)
                        .shiftedBy(-pool.collateralTokenDecimals)
                        .multipliedBy(pledgePrice)
                        .toNumber();
                    valUSDT += pledgeUSDT;
                    const key = `${pool.collateralTokenSymbol}-${pool.lpToken0Symbol}-${pool.lpToken1Symbol}`;
                    if (!merge[key]) {
                        merge[key] = {
                            pledgeUSDT,
                            ...pool,
                        };
                    } else {
                        merge[key].pledgeUSDT += pledgeUSDT;
                    }
                });
                this.lpTokenUSDT = valUSDT;
                this.pledgeList = Object.values(merge);
            });
        },

        switchClick(item) {
            this.list.forEach((d) => {
                d.active = false;
            });
            item.active = true;
            this.type = item.type;
        },
    },
};
</script>

<style lang="less" scoped>
.account-page {
    min-height: 100%;
    margin: 0 auto;

    .__container {
        border-radius: 0 0 8px 8px;
    }
}

header {
    box-shadow: none;
    margin-bottom: 20px;
}

.tab-list {
    box-shadow: none;
    padding: 30px 0 30px 0;
}

.tab-item {
    font-size: 14px;
    background: rgba(240, 184, 11, 0.1);
    color: var(--col-main);
    border: none;
    height: 64px;
    padding: 12px 10px;

    &.active {
        color: #1E2226;
        background: var(--col-main);
    }
}

.button-box {
    white-space: nowrap;
    //margin-bottom: 20px;
}

@media (max-width: 960px) {
    header {
        box-shadow: 0 0 20px rgba(21, 11, 112, 0.08);
        border-radius: 10px;
        height: 174px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tab-list {
        box-shadow: 0 0 20px rgba(21, 11, 112, 0.08);
        border-radius: 10px;
    }

    .tab-item {
        font-size: 20px;
    }
}
</style>
