<template>
<div class="pool-index">
    <div class="ver">
        <global-config/>
        <el-button @click="verClick(1)" type="primary" class="__button active"
            :class="[ver === 1 ? 'swap' : '']">
            V1
        </el-button>
        <el-button @click="verClick('2beta')" type="primary" class="__button active"
            :class="[ver === '2beta' ? 'swap' : '']">
            V2 (beta)
        </el-button>
        <el-button @click="verClick(2)" type="primary" class="__button active"
            :class="[ver === 2 ? 'swap' : '']">
            V2
        </el-button>
    </div>
    <template v-if="ver !== '2beta'">
    <el-button
        class="__button swap"
        type="primary"
        style="width: 100%"
        @click="viewClick"
    >
        {{ $t('AddLiquidityUI.Add') }}
    </el-button>
    </template>
    <div class="label">
        <span class="label-inner"> {{ $t('poolControl.Your') }}</span>
        <a-tooltip :content="$t('poolControl.proTxt1')">
            <a-icon class="icon" type="icon-wenhao"/>
        </a-tooltip>
    </div>
    <div class="list">
        <a-loading :loading="liquidityLoading">
            <template v-if="liquidityList.length">
            <el-collapse style="border: none" v-model="active" accordion>
                <pool-item
                    v-for="item in liquidityList"
                    :active="active === item.address"
                    :item="item"
                    :key="item.address"
                />

            </el-collapse>
            </template>
            <div class="empty" v-else>No liquidity found</div>
        </a-loading>
    </div>
</div>
</template>
<script>
import {swapHelper} from '@/store/swap.module';
import PoolItem from './PoolItem.vue';
import BigNumber from 'bignumber.js';
import GlobalConfig from '../../../components/top/GlobalConfig';
import {SwapInstance} from '@/assets/swap.init';
import {mapState} from "vuex";

export default {
    components: {GlobalConfig, PoolItem},
    name: 'PoolIndex',
    provide() {
        return {
            getApr: this.getApr,
        };
    },
    data() {
        return {
            active: '',
            verFlag: false
        };
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
        }),
        ...swapHelper.mapState(
            [
                'liquidityList', 'claims',
                'ver', 'liquidityLoading'
            ]
        ),
    },
    watch: {
        isConnect() {
            this.getQueryLiquidityList();
        },
    },
    methods: {
        verClick(v) {
            this.$store.commit('swap/setVer', v);
            this.$store.dispatch('swap/fetchTokens', v);
            this.getQueryLiquidityList();
        },
        getApr(item) {
            let profit = item.aprMining ? new BigNumber(item.aprMining).times(100).toFixed(2, 1) : 0;
            let fee = item.aprFee ? new BigNumber(item.aprFee).times(100).toFixed(2, 1) : 0;
            let aprTotal = this.$number(fee).plus(this.$number(profit)).toFixed(2, 1);

            return {
                aprProfit: profit,
                aprFee: fee,
                aprTotal,
            };
        },
        viewClick() {
            this.$store.dispatch('swap/fetchTokens', this.ver);
            this.$emit('view', 'AddLiquidity');
        },
        getQueryLiquidityList() {
            if(!this.isConnect) return
            this.$store.dispatch('swap/queryLiquidityList', (res) => {
                if (!res.length) return;
                Promise.all(
                    this.claims.map((claim) => {
                        return Promise.all([
                            this.$swap.queryPairInfo(
                                this.$swap.$provider.getDGASAddress(),
                                claim.address()
                            ),
                            this.$swap.swapPrecondition(claim.address()),
                        ]);
                    })
                ).then((dd) => {
                    this.$store.commit(
                        'swap/setClaims',
                        this.claims.map((claim, i) => {
                            const [pair, canSwap] = dd[i];
                            return {
                                ...claim,
                                isExist: pair.exist,
                                canSwap,
                            };
                        })
                    );
                });
            });
        }
    },
    mounted() {
        this.$swap.loginStatus().subscribe(isLogin => {
            if (isLogin) {
                // if (SwapInstance.$provider.isBscNet()) {
                    this.getQueryLiquidityList();
                // } else {
                //     this.$aprilDialog.show({
                //         title: this.$t('Base.SwitchChain'),
                //         tip: this.$t('Base.SwitchChainTip')
                //     })
                // }
            }
        });
        // this.verFlag = window.location.host !== 'burgerswap.org';
    },
    beforeDestroy() {
    },
};
</script>
<style lang="less" scoped>
    .pool-index {
        .wrapper {
            position: relative;
            top: 0;
        }

        .ver {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;

            button {
                width: auto;
                display: inline;
                min-width: 40px;
                padding: 0 10px;
                height: 30px;
                font-size: 14px;

                &.active {
                    background: #292D31;
                    color: var(--col-label60);

                    &.swap {
                        color: #1e2226;
                        background: var(--col-main);
                    }
                }
            }
        }
    }

    .label {
        margin-top: 30px;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        align-items: center;
    }

    .label-inner {
        margin-right: 10px;
        color: #ffffff;
    }

    .icon {
        color: #ffffff;
    }

    .list {
        padding-top: 30px;

        .empty,
        .item {
            box-sizing: border-box;
            padding: 14px 20px;
            border-radius: 10px;
            background: var(--col-content);
        }

        .empty {
            font-size: 16px;
            color: var(--col-label60);
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .item {
            font-size: 20px;
        }
    }
</style>
