<template>
    <div class="liquidation-history">
        <el-table
            :empty-text="$t('Public.NotData')"
            class="__table"
            :data="list"
            style="width: 100%"
        >
            <el-table-column :label="$t('LiquidationPage.LiquidationTime')">
                <template slot-scope="scope">
                    <span>{{ scope.row.timestamp | moment }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('LiquidationPage.LiquidationQuantity')">
                <template slot-scope="scope">
                    <span>{{ scope.row.liquidationAmount | toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="right"
                :label="$t('LiquidationPage.QuantityCollateral')"
            >
                <template slot-scope="scope">
          <span class="blue">{{
                  scope.row.amountCollateral | toFixed(4)
              }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="button-box">
            <el-button
                v-if="list.length > 0"
                :loading="moreLoading"
                @click="moreClick"
                type="text"
                class="button"
            >
                {{ $t('LiquidationPage.LoadMore') }}
            </el-button>
        </div>
    </div>
</template>

<script>
import ChainApi from '../../../static/sdk/ChainApi';
import {mapState} from 'vuex';
import BigNumber from 'bignumber.js';

export default {
    name: 'liquidation-history',
    data() {
        return {
            list: [],
            moreLoading: false,
            index: 0,
        };
    },
    watch: {
        isConnect() {
            this.init();
        },
        poolList() {
            this.init();
        },
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            account: 'account',
            poolList: 'poolList',
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
            if (this.poolList.length) {
                this.queryUserLiquidationList(0);
            }
        },
        moreClick() {
            if (!this.isConnect) {
                return;
            }
            this.index += 1;
            this.moreLoading = true;
            if (this.index >= this.poolList.length) {
                this.moreLoading = false;
                return this.list;
            }
            this.queryUserLiquidationList(this.index);
        },
        queryUserLiquidationList(index) {
            let pair = ChainApi.poolsMapWithIndex[index];
            ChainApi.queryUserLiquidationList(pair)
                .then((res) => {
                    this.list = this.list.concat(
                        res.map((d) => {
                            return {
                                amountCollateral: new BigNumber(
                                    d['amountCollateral']
                                ).shiftedBy(-18),
                                liquidationAmount: new BigNumber(
                                    d['liquidationAmount']
                                ).shiftedBy(-18),
                                timestamp: d['timestamp'] * 1000,
                            };
                        })
                    );
                })
                .finally(() => {
                    this.moreLoading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.liquidation-history {
    padding: 0 30px;

    .button-box {
        display: flex;
        justify-content: center;
        margin-top: 30px;

        .button {
            color: var(--col-main);
        }
    }
}

@media (max-width: 960px) {
    .liquidation-history {
        padding: 0 30px;
    }
}
</style>
