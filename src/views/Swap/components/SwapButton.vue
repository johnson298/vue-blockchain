<template>
<div>
    <el-button
        type="primary"
        :class="['__button', type]"
        :loading="loading"
        :disabled="disabled"
        size="large"
        style="width: 100%"
        @click="swap"
    >
        <slot/>
    </el-button>
    <swap-modal :open.sync="open">
        <template v-slot:header>
        {{ $t('comfirmSwapView.title') }}
        </template>
        <div class="modal-content">
            <div class="header">
                <div class="token">
                    <img
                        class="token-icon"
                        :src="SwapState.fromToken && $icon(SwapState.fromToken)"
                        alt=""
                    />
                    <div>
                        {{ from | toFixed($swap.fixed) }}
                        &nbsp; {{ SwapState.fromToken | pick('symbol') }}
                    </div>
                </div>
                <div class="right-arrow">
                    <a-icon class="direction" type="icon-direct"/>
                </div>

                <div class="token" style="text-align: right">
                    <img
                        class="token-icon"
                        :src="SwapState.toToken && $icon(SwapState.toToken)"
                        alt=""
                    />
                    <div>
                        {{ to | toFixed($swap.fixed) }}
                        &nbsp; {{ SwapState.toToken | pick('symbol') }}
                    </div>
                </div>
            </div>
            <div class="desc">
                {{ $t('comfirmSwapView.Output') }}&nbsp;
                {{ $t('swapControl.Minimumreceived') }}&nbsp;
                {{ SwapState.swapInfo | pick('minAmountOut') }}&nbsp;
                {{ $t('comfirmSwapView.or') }}
            </div>
            <el-divider></el-divider>
            <price-change class="bc"/>
            <detail-inner :from="from"/>
            <el-button
                class="__button swap"
                :loading="loading"
                type="primary"
                @click="action"
            >
                {{ $t('comfirmSwapView.submitBtn') }}
            </el-button>
        </div>
    </swap-modal>
    <status-modal
        ref="statusModal"
        :from="from"
        :to="to"
        :fromToken="SwapState.fromToken | pick('symbol')"
        :toToken="SwapState.toToken | pick('symbol')"
        :address="address"
    />
</div>
</template>
<script>
import {swapHelper} from '@/store/swap.module';
import SwapModal from './SwapModal.vue';
import PriceChange from './PriceChange.vue';
import DetailInner from './DetailInner.vue';
import StatusModal from './StatusModal.vue';

export default {
    components: {SwapModal, PriceChange, DetailInner, StatusModal},
    name: 'SwapButton',
    props: {
        disabled: true,
        from: '',
        to: '',
        type: '',
        d: '1212',
    },
    data() {
        return {
            loading: false,
            open: false,
            address: '',
        };
    },
    computed: {
        ...swapHelper.mapState(['SwapState']),
    },
    methods: {
        swap() {
            this.open = true;
        },
        action() {
            this.loading = true;
            const type = Reflect.has(this.SwapState.swapInfo || {}, 'amountIn')
                ? 'to'
                : 'from';
            const params = {
                fromToken: this.SwapState.fromToken,
                toToken: this.SwapState.toToken,
                type,
                amount: this[type],
                tolerance: this.$store.getters.tolerance,
                time: this.$store.state.minute,
                describe: `Swap ${this.from} ${this.SwapState.fromToken.symbol} for ${this.to} ${this.SwapState.toToken.symbol}`,
            };
            // console.log(params, 'swap params');
            this.$swap.swap(params, (code, res) => {
                const isPending = code === 0;
                this.loading = isPending;
                this.address = res;

                console.log('$swap.swap', code, res)
                if (isPending) {
                    this.open = false;
                    this.$refs.statusModal.toggle();
                }
                if (code === 1) {
                    this.$store.dispatch('swap/fetchTokens');
                    this.$emit('success');
                    this.$refs.statusModal.setStatus();
                    this.$notify({
                        title: 'Swap',
                        message: 'Swap Success',
                        type: 'success'
                    });
                }

                if (code === 2) {
                    this.$notify({
                        title: 'Swap',
                        message: 'Swap Error',
                        type: 'error'
                    });
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
    .modal-content {
        color: #1e2226;
    }

    .header {
        display: flex;
        justify-content: space-between;
        //align-items: center;
        margin-bottom: 20px;

        .token {
            font-weight: 700;
        }

        .token-icon {
            width: 64px;
            margin-bottom: 20px;
        }
    }

    .right-arrow {
        display: flex;
        align-items: center;
        height: 46px;
    }

    .direction {
        color: var(--col-main);
        font-size: 44px;
    }

    .desc {
        margin-bottom: 20px;
    }

    .price {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .desc {
            font-weight: 700;
        }
    }

    .bc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #1e2226;
    }
</style>
