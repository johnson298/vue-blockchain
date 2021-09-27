<template>
    <!-- fill="#2775CA" -->
    <div class="liquidation-page __container __shadow">
        <div class="top">
            <span class="title">{{ $t('LiquidationPage.ClearInformation') }}</span>
            <a-icon
                @click="upData()"
                :class="['refresh', { 'img-active': loading }]"
                type="refresh"
            />
        </div>
        <!--    <div class="table-web">-->
        <!--      <el-table-->
        <!--        :empty-text="$t('Public.NotData')"-->
        <!--        :data="list"-->
        <!--        width="100%"-->
        <!--        type="index"-->
        <!--        class="__table"-->
        <!--      >-->
        <!--        <el-table-column width="200" prop="date" :label="$t('LiquidationPage.AssetText')">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span><LPSymbol :pool="scope.row" /></span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="name"-->
        <!--          :label="-->
        <!--            $t('LiquidationPage.AmountReturned') +-->
        <!--            '/' +-->
        <!--            $t('LiquidationPage.QuantityPledge')-->
        <!--          "-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span-->
        <!--              >{{ scope.row.expectedRepay | toFixed(4) }}&nbsp;/&nbsp;{{-->
        <!--                scope.row.amountCollateral | toFixed(4)-->
        <!--              }}</span-->
        <!--            >-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="billie"-->
        <!--          :label="$t('LiquidationPage.CurrentLoanDeposit')"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span class="blue">{{ scope.row.billie | toFixed(2) }}%</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="liquidationRate"-->
        <!--          :label="$t('LiquidationPage.LiquidationRatio')"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ scope.row.liquidationRate * 100 }}%</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column align="right" :label="$t('LiquidationPage.Operation')">-->
        <!--          <template slot-scope="scope">-->
        <!--              <span style="color: var(&#45;&#45;col-btn-light-ft); cursor: pointer"  v-loading="scope.row.loading" @click="liquidation(scope.row, scope.$index)">-->
        <!--                  {{ $t("Public.Liquidation") }}-->
        <!--              </span>-->
        <!--&lt;!&ndash;            <el-button&ndash;&gt;-->
        <!--&lt;!&ndash;              class="public-button-light __button"&ndash;&gt;-->
        <!--&lt;!&ndash;              size="small"&ndash;&gt;-->
        <!--&lt;!&ndash;              :loading="scope.row.loading"&ndash;&gt;-->
        <!--&lt;!&ndash;              @click="liquidation(scope.row, scope.$index)"&ndash;&gt;-->
        <!--&lt;!&ndash;            >&ndash;&gt;-->
        <!--&lt;!&ndash;              {{ $t("Public.Liquidation") }}&ndash;&gt;-->
        <!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--      </el-table>-->
        <!--    </div>-->
        <!--    <div class="">-->
        <H5Liquidation
            :list="list"
            @clearingData="clearingData($event)"
        ></H5Liquidation>
        <!--    </div>-->
    </div>
</template>

<script>
import {mapState} from 'vuex';
import H5Liquidation from './h5-liquidation';
import LPSymbol from '../../components/LPSymbol';

export default {
    name: 'Liquidation',
    components: {
        H5Liquidation,
        LPSymbol,
    },
    data() {
        return {
            list: [],
            pagination: {
                // 分页的数据
                totalItems: 0,
                pageSize: 1,
                currentPage: 0,
            },
            liquidationRate: '0',
            meroLoading: false,
            pairInfo: {},
            pairList: [],
            index: 0,
            price: {},
            countObj: {},

            len: 10,
            start: 0,
            end: 0,
            recordCount: 0,
            loading: false,
        };
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            account: 'account',
            poolList: 'poolList',
        }),
    },
    watch: {
        isConnect() {
            this.init();
        },
        poolList() {
            this.init();
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.isConnect) {
                this.$api.getAccounts().then((acc) => {
                    this.queryPoolList();
                });
            } else {
                this.list = [];
            }
        },
        upData() {
            this.list = [];
            this.len = 10;
            this.start = 0;
            this.end = 0;
            this.index = 0;
            this.list = [];
            this.meroClick();
        },
        queryPoolList() {
            this.poolList.forEach((d, index) => {
                this.countBorrow(d, index);
            });
        },
        getPairConf(d, index) {
            this.$api.getPairConf(d.pair).then((res) => {
                this.pairInfo[index] = {
                    liquidationRate: this.$number(res.liquidationRate).shiftedBy(-18),
                };
                if (index === 0) {
                    this.meroClick();
                }
            });
        },

        meroClick() {
            this.meroLoading = true;
            if (this.index >= this.poolList.length) {
                this.meroLoading = false;
                return;
            }
            this.recordCount = 0;

            this.loadData();
        },
        loadData() {
            if (!this.isConnect) {
                this.meroLoading = false;
                return;
            }
            if (this.index >= this.poolList.length) return;
            let total = Number(this.countObj[this.index].count);
            if (this.start >= total) {
                this.start = 0;
                this.end = this.start + this.len;
                this.index += 1;
                if (this.index >= this.poolList.length) return;
                total = Number(this.countObj[this.index].count);
                this.end = this.len > total ? total : this.len;
            } else {
                this.start = this.end;
                this.end = this.start + this.len;
                this.end = this.end > total ? total : this.end;
            }

            if (this.index >= this.poolList.length) {
                this.meroLoading = false;
                return;
            } else if (
                this.index == this.poolList.length - 1 &&
                this.start >= this.end
            ) {
                this.meroLoading = false;
                return;
            }

            this.iterateLiquidationInfo(this.index);
        },
        /**8
         * amountCollateral  质押
         * expectedRepay 借贷
         * @param index
         */
        iterateLiquidationInfo(index) {
            let pair = this.$api.poolsMapWithIndex[index];
            this.loading = true;
            this.$api
                .iterateLiquidationInfo(index, this.start, this.end)
                .then((res) => {
                    this.recordCount += res.length;
                    // console.log('res::', res);
                    this.list = this.list.concat(
                        res.map((d) => {
                            const info = this.$api.pairsToken[d.pool.toLowerCase()];
                            const expectedRepay = this.$number(d.expectedRepay).shiftedBy(
                                -info?.supplyToken.decimals
                            );
                            const amountCollateral = this.$number(
                                d.amountCollateral
                            ).shiftedBy(-info.collateralToken.decimals);
                            return {
                                amountCollateral: amountCollateral,
                                expectedRepay: expectedRepay,
                                collateralToken: info.collateralToken,
                                supplyToken: info.supplyToken,
                                liquidationRate: this.pairInfo[index].liquidationRate,
                                billie: this.$number(expectedRepay)
                                    .dividedBy(this.price[index].price)
                                    .dividedBy(amountCollateral)
                                    .multipliedBy(100),
                                supplyTokenAddress: this.poolList[index].supplyToken,
                                collateralTokenAddress: this.poolList[index].collateralToken,
                                loading: false,
                                user: d.user,
                                ...this.poolList[index],
                            };
                        })
                    );

                    if (this.recordCount < this.len) {
                        this.loadData();
                    }
                })
                .finally(() => {
                    this.meroLoading = false;
                    this.loading = false;
                });
        },

        countBorrow(d, index) {
            this.$api.countBorrow(d.pair).then((res) => {
                this.countObj[index] = {
                    count: res,
                };
                this.pledgePrice(d, index);
                this.getPairConf(d, index);
            });
        },

        pledgePrice(d, index) {
            this.$api.getPrice(d.collateralToken).then((res) => {
                this.price[index] = {
                    price: res,
                };
            });
        },
        liquidation(data, index) {
            data.loading = true;
            this.$api
                .liquidation(
                    data.supplyTokenAddress,
                    data.collateralTokenAddress,
                    data.user
                )
                .then((hash) => {
                    return this.$api.awaitTransactionMined(hash);
                })
                .then((receipt) => {
                    this.list.splice(index, 1);
                    this.msg();
                    this.$api.elogLiquidation(receipt);
                })
                .finally(() => {
                    data.loading = false;
                });
        },
        msg() {
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },
        clearingData($event) {
            this.liquidation($event.data, $event.index);
        },
    },
};
</script>

<style lang="less" scoped>
.liquidation-page {
    height: 100%;
    padding: 20px;
    min-height: 300px;
    margin: 0 auto;

    .top {
        padding-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .img-active {
            animation: turn 1.5s linear infinite;
        }
    }

    .title {
        color: var(--col-main-active);
        font-size: 20px;
    }

    .refresh {
        font-size: 24px;
        color: var(--col-main);
        cursor: pointer;
    }

    .table-web {
        display: block;
    }

    .table-h5 {
        display: none;
    }
}

@media (max-width: 960px) {
    .liquidation-page {
        padding: 0 30px;

        .top {
            padding: 28px 0;
        }

        .title {
            padding-left: 10px;
            font-size: 24px;
        }

        .refresh {
            font-size: 48px;
        }

        .table-web {
            display: none;
        }

        .table-h5 {
            display: block;
        }
    }
}

@keyframes turn {
    0% {
        -webkit-transform: rotate(0deg);
    }
    25% {
        -webkit-transform: rotate(90deg);
    }
    50% {
        -webkit-transform: rotate(180deg);
    }
    75% {
        -webkit-transform: rotate(270deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
</style>
