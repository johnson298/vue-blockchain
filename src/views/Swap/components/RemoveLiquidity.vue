<template>
<div class="remove-liquidity">
    <back-header
        :title="$t('RemoLiquidity.title')"
        @click="$emit('view', 'PoolIndex')"
    >
        <a-tooltip
            class="item"
            effect="dark"
            :content="$t('RemoLiquidity.proTxt1')"
        >
            <a-icon type="icon-wenhao"/>
        </a-tooltip>
    </back-header>
    <div class="slide-box">
        <el-slider
            class="__slider"
            v-model="sliderVal"
            :marks="marks"
            :show-tooltip="true"
            :tooltip-class="'__tooltip_warp'"
            :format-tooltip="format"
        />
    </div>

    <div class="btn-group">
        <el-button
            type="primary"
            class="percentage"
            v-for="val in this.steps"
            :key="val"
            @click="sliderVal = val"
            round
        >
            {{ val }}%
        </el-button>
    </div>
    <div class="info">
        <el-row type="flex">
            <el-col class="item">
                <img class="img" :src="$icon(tokenA)"/>
                <div>
                    <div class="text">{{ tokenA | pick('symbol') }}</div>
                    <div class="price">
                        {{ result | pick('amountA') }}
                    </div>
                </div>
            </el-col>
            <el-col class="item">
                <img class="img" :src="$icon(tokenB)"/>
                <div>
                    <div class="text">{{ tokenB | pick('symbol') }}</div>
                    <div class="price">
                        {{ result | pick('amountB') }}
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="rate" type="flex" justify="between">
            <el-col :span="8" style="font-weight: 700">
                <span class="rate-text">{{ $t('swapControl.PriceText') }}</span>
            </el-col>
            <el-col class="rate-inner">
                1 {{ tokenA | pick('symbol') }} = {{ result | pick('priceB') }}
                {{ tokenB | pick('symbol') }}
            </el-col>
            <el-col class="rate-inner">
                1 {{ tokenB | pick('symbol') }} = {{ result | pick('priceA') }}
                {{ tokenA | pick('symbol') }}
            </el-col>
        </el-row>
    </div>
    <el-alert
        v-show="isFire"
        class="tip"
        :title="$t('RemoLiquidity.RemoveFirePairTip')"
        type="warning"
    />
    <el-button
        type="primary"
        class="__button swap"
        @click="remove"
        :loading="disabled"
        :disabled="result.amountA <= 0 || result.amountB <= 0"
    >
        {{ $t('RemoLiquidity.Remove') }}
    </el-button>
</div>
</template>
<script>
import {interval, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {swapHelper} from '@/store/swap.module';
import BackHeader from './BackHeader.vue';

const FIRES_TOKEN = '0x393B312C01048b3ed2720bF1B090084C09e408A1';
const BNB_TOKEN = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

export default {
    components: {
        BackHeader,
    },
    inject: ['viewToggle'],
    name: 'RemoveLiquidity',
    props: {
        props: {
            type: Object,
            default() {
                return {
                    tokenA: null,
                    tokenB: null,
                    pair: null,
                };
            },
        },
    },
    data() {
        const {tokenA, tokenB, pair} = this.props;
        return {
            sliderVal: 0,
            steps: [0, 25, 50, 75, 100],
            disabled: false,
            tokenB: tokenB,
            tokenA: tokenA,
            pair: pair,
        };
    },
    computed: {
        percent() {
            return this.sliderVal / 100;
        },
        marks() {
            return this.steps.reduce((obj, v) => {
                obj[v] = '';
                return obj;
            }, {});
        },
        isFire() {
            return this.pair
                ? [this.pair.token0, this.pair.token1].every((address) => {
                    return (
                        this.$swap.$provider.isWethAddress(address) ||
                        FIRES_TOKEN.toLowerCase() === address.toLowerCase()
                    );
                })
                : false;
        },
        result() {
            let result = null;
            if (this.pair) {
                const bigPercent = this.$number(this.pair.percent);
                const amountA = bigPercent.multipliedBy(this.pair.reserve0);
                const amountB = bigPercent.multipliedBy(this.pair.reserve1);
                const priceA = amountA.dividedBy(amountB).toFormat(6);
                const priceB = amountB.dividedBy(amountA).toFormat(6);
                result = {
                    amountA: amountA.multipliedBy(this.percent).toFormat(6),
                    amountB: amountB.multipliedBy(this.percent).toFormat(6),
                    priceA,
                    priceB,
                };
            }
            return result;
        },
        ...swapHelper.mapGetters({
            'ver': 'ver'
        })
    },
    methods: {
        remove() {
            if (this.result) {
                const {amountA, amountB} = this.result;
                this.disabled = true;

                this.$swap.removeLiquidity(
                    {
                        address: this.pair.address,
                        percent: this.sliderVal / 100,
                        slip: this.$store.getters.tolerance,
                        transfer_time: this.$store.state.minute,
                        describe: `Remove ${amountA} ${this.tokenA.symbol} and ${amountB} ${this.tokenB.symbol}`,
                        ver: this.ver
                    },
                    (code, res) => {
                        const isPending = code === 0;
                        if (!isPending) {
                            this.viewToggle();
                            this.disabled = false;
                        }
                        if (code === 1) {
                            this.$store.dispatch('swap/fetchTokens', this.ver);
                            this.$store.dispatch('swap/queryLiquidityList');
                            this.$notify({
                                title: 'Remove',
                                message: 'Remove Success',
                                type: 'success'
                            });
                        }
                        if (code === 2) {
                            this.$notify({
                                title: 'Remove',
                                message: 'Remove Error',
                                type: 'error'
                            });
                        }
                    }
                );
            }
        },
        format(val) {
            return val + '%';
        },
    },
};
</script>
<style lang="less" scoped>
    .remove-liquidity {
        color: var(--col-main-active);
    }

    .btn-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 40px 0;

        .percentage {
            color: var(--col-main);
            width: 80px;
            cursor: pointer;
            height: 40px;
            background: rgba(240, 184, 11, 0.05);
            border-radius: 30px;
            border: none;

            &:hover {
                color: #1E2226;
                background-color: var(--col-main);
            }
        }
    }

    .tip {
        margin-bottom: 30px;
    }

    .info {
        background: var(--col-content);
        border-radius: 10px;
        padding: 20px 30px;
        font-size: 20px;
        margin-bottom: 30px;

        .item {
            display: flex;
            align-items: center;

            img {
                width: 64px;
                height: 64px;
                margin-right: 20px;
            }

            .text {
                font-weight: 700;
                margin-bottom: 20px;
            }
        }

        .rate {
            font-size: 20px;
            margin-top: 30px;
            color: var(--col-main);

            .rate-inner {
                font-size: 16px;
                line-height: 20px;
                color: var(--col-label60);
            }
        }
    }
</style>
