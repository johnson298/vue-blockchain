<template>
<div>
    <el-button
        type="primary"
        class="__button swap"
        :disabled="disabled"
        size="large"
        style="width: 100%"
        @click="swap"
    >
        <slot/>
    </el-button>
    <swap-modal :open.sync="open">
        <template v-slot:header>
        {{ $t('confirmSupplyView.You') }}
        </template>
        <div class="modal-content">
            <h3 class="message">
                {{ $t('confirmSupplyView.msg') }}
            </h3>
            <div class="row">
                <div class="left">
                    {{ tokens[0] | pick('symbol') }}
                    {{ $t('confirmSupplyView.Desposite') }}:
                </div>
                <div class="right">{{ values[0] }}</div>
            </div>

            <div class="row">
                <div class="left">
                    {{ tokens[1] | pick('symbol') }}
                    {{ $t('confirmSupplyView.Desposite') }}:
                </div>
                <div class="right">{{ values[1] }}</div>
            </div>

            <div class="row">
                <div class="left">{{ $t('confirmSupplyView.Rates') }}:</div>
                <div class="right">
                    <div>
                        1 {{ tokens[0] | pick('symbol') }} =
                        {{ info | pick('BPerA') | toFixed(6) }}
                        {{ tokens[1] | pick('symbol') }}
                    </div>
                    <div>
                        1 {{ tokens[1] | pick('symbol') }} =
                        {{ info | pick('APerB') | toFixed(6) }}
                        {{ tokens[0] | pick('symbol') }}
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="left">
                    {{ $t('confirmSupplyView.Share') }}
                </div>
                <div class="right">{{ info | pick('percent') }} %</div>
            </div>
            <el-button
                class="__button swap"
                type="primary"
                @click="action"
            >
                {{ $t('confirmSupplyView.submitBtn') }}
            </el-button>
        </div>
    </swap-modal>
</div>
</template>
<script>
import {mapState, mapGetters} from 'vuex';
import SwapModal from './SwapModal.vue';
import PriceChange from './PriceChange.vue';
import DetailInner from './DetailInner.vue';
import StatusModal from './StatusModal.vue';
import {swapHelper} from '@/store/swap.module';

export default {
    components: {SwapModal, PriceChange, DetailInner, StatusModal},
    name: 'AddLiquidityButton',
    props: {
        disabled: true,
        values: {
            type: Array,
            default() {
                return ['', ''];
            },
        },
        tokens: {
            type: Array,
            default() {
                return [null, null];
            },
        },
        info: null,
        from: '',
        to: '',
    },
    data() {
        return {
            loading: false,
            open: false,
            address: '',
        };
    },
    computed: {
        ...mapState(['minute']),
        ...mapGetters(['tolerance']),
        ...swapHelper.mapGetters({
            'ver': 'ver'
        })
    },
    methods: {
        swap() {
            this.open = true;
        },
        action() {
            this.loading = true;
            const [tokenA, tokenB] = this.tokens;
            const [a, b] = this.values;
            const fromAddr = tokenA?.address;
            const symbol0 = tokenA?.symbol;
            const toAddr = tokenB?.address;
            const symbol1 = tokenB?.symbol;
            const amountA = Number(a);
            const amountB = Number(b);
            const describe = `Add ${amountA.toFixed(
                8
            )} ${symbol0} and ${amountB.toFixed(8)} ${symbol1}`;

            console.log("addLiquidity fromAddr:", fromAddr)
            console.log("addLiquidity toAddr:", toAddr)
            console.log("addLiquidity amountA:", amountA)
            console.log("addLiquidity amountB:", amountB)
            console.log("addLiquidity this.tolerance:", this.tolerance)

            this.$swap.addLiquidity(
                {
                    A: fromAddr,
                    B: toAddr,
                    amountA: amountA,
                    amountB: amountB,
                    slip: this.tolerance,
                    transfer_time: this.minute,
                    describe: describe,
                    ver: this.ver
                },
                (code, res) => {
                    console.log("addLiquidity code:", code)
                    console.log("addLiquidity res:", res)

                    const isPending = code === 0;
                    if (isPending) {
                        // todo something
                        this.loading = false;
                    }
                    if (!isPending) {
                        this.loading = false;
                    }
                    if (code === 0) {
                        this.$notify({
                            title: 'Add',
                            message: 'Add Success',
                            type: 'success'
                        });
                        this.open = false;
                        this.$emit('success');
                    }

                    if (code === 2) {
                        this.$notify({
                            title: 'Add',
                            message: 'Add Error',
                            type: 'error'
                        });
                    }
                }
            );
        },
    },
};
</script>
<style lang="less" scoped>
    .modal-content {
        color: #1e2226;
    }

    .message {
        color: var(--col-main);
        font-size: 16px;
        line-height: 26px;
        padding-bottom: 40px;
        border-bottom: 1px dashed #000;
        margin-bottom: 30px;
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 20px;
    }

    .right {
        font-weight: bold;
        text-align: right;
    }
</style>
