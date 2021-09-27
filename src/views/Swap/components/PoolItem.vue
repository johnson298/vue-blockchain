<template>
    <el-collapse-item class="pool-item" :name="item.address">
        <template slot="title">
            <div class="pool-item-title">
                <div class="left">
                    <img class="icon" :src="$icon(tokens[0])"/>
                    <img class="icon" :src="$icon(tokens[1])"/>
                    <span class="desc">
            {{ tokens[0] | pick('symbol') }} /
            {{ tokens[1] | pick('symbol') }}
          </span>
                     <span class="desc"> (APR: {{ apr.aprTotal }} %) </span>
                </div>
                <div class="right" v-show="!active">
                    {{ `${$project}: ` }}
                    <count-jump :val="$number(item.reward).plus(amount).toFormat(6)" />
                    <a-icon style="margin-left: 20px;" class="arrow-down" type="arrow-down"/>

                </div>
            </div>
        </template>
        <div class="collapse-content">
            <el-row type="flex" class="row">
                <el-col class="label">
                    {{ $t('AddLiquidityUI.Pooled') }} {{ tokens[0] | pick('symbol') }}
                </el-col>
                <el-col class="text-right">
                    {{ computeVal(item.reserve0) }}
                </el-col>
            </el-row>
            <el-row type="flex" class="row">
                <el-col class="label">
                    {{ $t('AddLiquidityUI.Pooled') }} {{ tokens[1] | pick('symbol') }}
                </el-col>
                <el-col class="text-right">
                    {{ computeVal(item.reserve1) }}
                </el-col>
            </el-row>
            <el-row type="flex" class="row">
                <el-col class="label">
                    {{ $t(ver === 1 ? 'AddLiquidityUI.Liquidity_mining' : 'AddLiquidityUI.Liquidity_total_mining') }}
                    <!-- (APR: {{ apr.aprProfit }} %) -->
                </el-col>
                <el-col class="text-right">
                    {{ $number(item.reward).toFormat(6) }}
                    <el-button
                        class="mr-space"
                        type="text"
                        :loading="disabled"
                        size="small"
                        @click="handleMint"
                    >

                        {{ $t('AddLiquidityUI.mintReward_btn') }}

                    </el-button>
                </el-col>
            </el-row>
            <el-row type="flex" class="row" v-if="ver === 1">
                <el-col class="label">
                    {{ $t('AddLiquidityUI.Pool_fees') }}
                    <!-- (APR: {{ apr.aprFee }} % ) -->
                </el-col>
                <el-col class="text-right">
                    <el-dropdown
                        trigger="click"
                        class="__dropdown"
                        @command="command"
                        @visible-change="visibleChange"
                    >
                        <div class="claim">
                            <div class="claim-content">
                                <img :src="$icon(current)" alt=""/>
                                <!--                                <span class="claim-label">{{ current.symbol }}</span>-->
                                <span class="claim-value">{{ current.amount }}</span>
                            </div>
                            <a-icon class="arrow-down" type="arrow-down"/>
                        </div>
                        <el-dropdown-menu class="__dropdown-menu" slot="dropdown">
                            <el-dropdown-item

                                v-for="(item, index) in claimsList"
                                :disabled="!(item.isExist || item.canSwap)"
                                :key="index"
                                :command="index"
                            >
                                <div class="claim">
                                    <div class="claim-content">
                                        <img :src="$icon(item)" alt=""/>
                                        <span class="claim-label">{{ item.symbol }}</span>
                                        <span class="claim-value">{{ item.amount }}</span>
                                    </div>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button
                        class="mr-space"
                        :loading="disabledFee"
                        :disabled="claimDisabled"
                        type="text"
                        size="small"
                        @click="handleFee"
                    >
                        {{ $t('AddLiquidityUI.mintReward_btn') }}
                    </el-button>
                </el-col>
            </el-row>
            <el-row type="flex" class="row" v-if="ver === 2">
                <el-col class="label">{{ $t('AddLiquidityUI.LpAmount') }}</el-col>
                <el-col class="text-right">
                    <a
                        class="liquidity"
                        target="_blank"
                        :href="$swap.getBscscanTrade(item.address)"
                    >{{ item.liquidityShow | moreLessThan }}</a
                    >
                </el-col>
            </el-row>
            <el-row type="flex" class="row">
                <el-col class="label">
                    {{ $t('AddLiquidityUI.share') }}
                </el-col>
                <el-col class="text-right">
                    {{ $number(item.percent).multipliedBy(100).toFormat(2) }} %
                </el-col>
            </el-row>
            <el-row type="flex" :gutter="20">
                <el-col>
                    <el-button type="primary" class="__button swap" @click="handleAdd">
                        {{ $t('AddLiquidityUI.add_btn') }}
                    </el-button>
                </el-col>
                <el-col>
                    <el-button
                        :disabled="!(item && item.canRemove)"
                        @click="handleRemoveStep"
                        type="primary" class="__button swap"
                    >
                        {{ $t('AddLiquidityUI.remove_btn') }}
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-collapse-item>
</template>
<script>
import {swapHelper} from '../../../store/swap.module';
import CountJump from "../../../components/countJump/index";

export default {
    name: 'PoolItem',
    components: {CountJump},
    inject: ['getApr', 'viewToggle'],
    props: ['item', 'active'],
    data() {
        return {
            disabledFee: false,
            disabled: false,
            claimIdx: 0,
            amount: '',
            claimsExtra: [],
        };
    },
    computed: {
        ...swapHelper.mapGetters(['getToken', 'ver']),
        ...swapHelper.mapState(['claims']),
        tokens() {
            const {token0, token1} = this.item;
            return [this.getToken(token0), this.getToken(token1)];
        },
        apr() {
            return this.getApr(this.item);
        },
        claimsList() {
            const baseToken = {
                symbol: this.$project,
                amount: this.amount,
                address: this.$swap.$provider.getDGASAddress(),
                isExist: true,
                canSwap: true,
            };
            return [baseToken].concat(this.claimsExtra);
        },
        current() {
            return this.claimsList[this.claimIdx];
        },
        claimDisabled() {
            return !(this.current.isExist || this.current.canSwap);
        },
    },
    watch: {
        claims: {
            handler() {
                this.fetchClaimInfo();
            },
        },
        item: {
            handler(val) {
                if (val) {
                    this.queryReward();
                }
            },
            immediate: true,
        },
    },
    methods: {
        command(cmd) {
            this.claimIdx = cmd;
            // console.log(cmd, 'cmd');
        },
        fetchClaimInfo() {
            Promise.all(
                this.claims.map((claim) => {
                    return this.$swap.getAmountLiquidity(
                        this.claimsList[0].address,
                        claim.address(),
                        Number(this.amount),
                        this.ver
                    );
                })
            ).then((data) => {
                this.claimsExtra = this.claims.map((d, i) => {
                    const {address, ...other} = d;
                    const amd = this.$number(data[i].amountB);
                    return {
                        ...other,
                        address: address(),
                        amount: amd.isNaN() ? '--' : amd.toFixed(6),
                    };
                });
            });
        },
        visibleChange(status) {
            if (status && !this.claimsExtra.length) {
                this.fetchClaimInfo();
            }
        },
        queryReward() {
            this.$swap.queryFeeReward(this.item.pair).then((data) => {
                this.amount = this.$number(data)
                    .dividedBy(Math.pow(10, 18))
                    .toFormat(6);
            });
        },
        computeVal(reserve) {
            return this.$number(this.item.percent).multipliedBy(reserve).toFormat(6);
        },
        handleFee() {
            this.disabledFee = true;
            const describe = `Claim ${this.current.amount} ${this.current.symbol}`;
            // console.log('handleFee:', this.item);
            this.$swap.claimReward(
                this.item.pair,
                this.current.address,
                describe,
                (code, res) => {
                    if (code !== 0) {
                        this.disabledFee = false;
                    }
                    // console.log(res, code, 'claimReward');
                    if (code === 1) {
                        this.$notify({
                            title: 'Claim',
                            message: 'Claim Success',
                            type: 'success'
                        });
                        this.$store.dispatch('swap/queryLiquidityList');
                    }

                    if (code === 2) {
                        this.$notify({
                            title: 'Claim',
                            message: 'Claim Error',
                            type: 'error'
                        });
                    }
                },
            );
        },
        handleMint() {
            this.disabled = true;
            const amount = this.$number(this.item.reward).toFormat(6);
            const describe = `Collecte ${amount} ${this.$project} from liquidity`;

            this.$swap.mintReward(this.item.address, describe, this.ver, (code, res) => {
                const isPending = code === 0;
                if (!isPending) {
                    this.disabled = false;
                }
                if (code === 1) {
                    this.$store.dispatch('swap/queryLiquidityList');
                }
            });
        },
        handleAdd() {
            const [tokenA, tokenB] = this.tokens;
            this.viewToggle('AddLiquidity', {
                tokenA,
                tokenB,
            });
        },
        handleRemoveStep() {
            const [tokenA, tokenB] = this.tokens;
            this.viewToggle('RemoveLiquidity', {
                tokenA,
                tokenB,
                pair: this.item,
            });
        },
    },
};
</script>
<style lang="less">
.pool-item {
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;

    .el-collapse-item__wrap,
    .el-collapse-item__header {
        padding: 0 20px;
        background: var(--col-content);
        border-bottom: none;
    }

    .el-collapse-item__header {
        height: auto;
        line-height: initial;
    }
}
</style>
<style lang="less" scoped>
.collapse-content {
    padding-top: 20px;
}

.liquidity {
    text-decoration: underline;
    color: var(--col-main);
}

.pool-item-title {
    padding: 20px 0;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #0a2360;
    font-size: 20px;

    .icon {
        width: 32px;
        height: 32px;
    }

    .left {
        display: flex;
        align-items: center;
    }

    .right {
        display: flex;
        font-size: 16px;
        color: var(--col-main-active);
    }

    .desc {
        padding-left: 20px;
        color: var(--col-main-active);
    }
}

.row {
    font-size: 16px;
    line-height: 36px;
    color: var(--col-main-active);
    margin-bottom: 20px;

    & > div {
        display: flex;
        align-items: center;
    }
}

.mr-space {
    margin-left: 10px;
    color: var(--col-main);
    font-weight: 700;
    font-size: 16px;
}

.claim {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    cursor: pointer;

    .claim-content {
        display: flex;
        align-items: center;
        color: var(--col-main-active);

        img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }

        .claim-label {
            font-weight: 700;

        }

        .claim-value {
            margin-left: 20px;
            opacity: 0.5;
            color: var(--col-label60);
        }
    }

    .arrow-down {
        margin-left: 20px;
    }
}

.label {
    color: var(--col-label60);
    font-size: 20px;
    font-weight: 400;
}

.text-right {
    justify-content: flex-end;
}
</style>
