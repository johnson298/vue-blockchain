<template>
<div class="group">
    <div :class="[mask ? 'disabled' : '']">
        <div class="mask">{{ $t(title) }}</div>

        <TransitTitle :label="label"/>
        <input-item
            v-model="from"
            :token="tokenObj"
            :max="true"
            @click="openView()"
            @max="all()"
            @change="iptChange"
        />


        <h1 style="color: #fff"></h1>
        <div class="button-box">
            <el-button
                type="primary"
                class="__button swap"
                size="large"
                style="width: 100%"
                @click="approveClick"
                :loading="approveLoading"
                :disabled="!izGreateZero"
            >
                {{$t('Button.Authorization')}}
            </el-button>

            <el-button
                type="primary"
                class="__button swap"
                size="large"
                style="width: 100%"
                :disabled="true"
                :loading="creteLoading"
                v-if="izGreateZero && this.tokenObj.address"
            >
                {{ ( this.tokenObj.address && $comparedTo(from, this.tokenObj.balance) === 1) ?
                $t('swapControl.Insufficient') : $t(button) }}
            </el-button>
            <el-button
                v-else-if="this.tokenObj.address"
                type="primary"
                class="__button swap"
                size="large"
                style="width: 100%"
                :disabled="(izGreateZero === false && this.tokenObj.address && !from ) || ($comparedTo(from, this.tokenObj.balance) === 1)"
                @click="createClick"
                :loading="creteLoading"
            >
                {{ $t(button) }}
            </el-button>
            <el-button
                type="primary"
                class="__button swap"
                size="large"
                style="width: 100%"
                :disabled="true"
                :loading="creteLoading"
                v-else
            >
                {{ $t(button) }}
            </el-button>
        </div>

        <slot></slot>

        <DialogTokens
            :tokensList="tokensList"
            :open.sync="open"
            :ETH="ETH"
            :spender="spender"
            @close="close"
            :title="$t('coinSelectView.selectTitle')"
        >
        </DialogTokens>
        <ETH2BSC :open.sync="ETH2BSC" :type="transitETH2BSC"></ETH2BSC>
    </div>
</div>

</template>

<script>
import ETH2BSC from './ETH2-BSC';
import {ETHConfig} from '@/assets/js/tokenMap';
import {interval, Subscription} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import InputItem from '../Swap/components/InputItem.vue';
import DialogTokens from '@/views/Transit/DialogTokens';
import TransitTitle from '@/views/Transit/Transit-title';
import {mapState} from 'vuex';

export default {
    name: 'TransitGroup',
    components: {
        TransitTitle,
        InputItem,
        DialogTokens,
        ETH2BSC,
    },
    props: [
        'tokensList', 'mask', 'spender', 'title', 'label', 'button', 'ETH'
    ],
    computed: {
        ...mapState(['chainId']),
    },
    data() {
        return {
            tokenObj: {
                address: '',
                allowance: '',
                balance: '',
                chainId: '',
                decimals: '',
                icon: '',
                name: '',
                symbol: '',
                totalSupply: '',
            },
            open: false,
            from: '0',
            izGreateZero: false,
            approveLoading: false,
            creteLoading: false,
            transitETH2BSC: '',
            ETH2BSC: false
        };
    },
    mounted() {
        this.iptChange(0);
    },
    methods: {
        init() {

        },
        openView() {
            this.open = true;
        },
        close($event) {
            if ($event) {
                this.tokenObj = $event;
                this.iptChange(this.from);
            }
        },
        all() {
            this.from = this.tokenObj.balance || '0';
            this.iptChange(this.tokenObj.balance || 0);
        },
        iptChange($event) {
            const d = this.$number(this.tokenObj.allowance);
            const a = this.$number($event);
            this.from = $event;
            if (d.isZero() || (a.isGreaterThan(d) && a.isLessThan(this.tokenObj.totalSupply))) {
                this.izGreateZero = true;
            } else {
                this.izGreateZero = false;
            }
        },
        upData() {
            // console.log('upData', this.tokenObj.address === ETHConfig.address);
            if (this.tokenObj.address === ETHConfig.address) {
                this.$store.dispatch('transit/getBalance').then(res => {
                    this.tokenObj.balance = res;
                });
            } else {
                this.$store.dispatch('transit/getTokenInfo', {
                    token: this.tokenObj.address,
                    spender: this.spender
                }).then(res => {
                    this.tokenObj = {
                        ...this.tokenObj,
                        ...res
                    };
                });
            }
        },
        approveClick() {
            this.approveLoading = true;
            console.error('token;;;', this.tokenObj)
            this.$swap.approveToken(
                {
                    amount: this.tokenObj.totalSupply,
                    token: this.tokenObj,
                    spender: this.spender ||
                        (this.mask ?
                                this.$swap.$provider.getETHBurgerTransitAddress() :
                                this.$swap.$provider.getBscBurgerTransitAddress()
                        ),
                },
                (code, tx) => {
                    this.$store.dispatch('recordCallback', {
                        key: 'Approve',
                        action: 'Approve',
                        params: {describe: `Approve ${this.tokenObj.symbol} `},
                        code,
                        result: tx,
                    });
                    if (code !== 0) {
                        this.approveLoading = false;
                    }

                    if (code === 1) {
                        this.tokenObj.allowance = this.tokenObj.totalSupply;
                        this.izGreateZero = false;
                        this.$notify({
                            title: 'Approve',
                            message: 'Approve Success',
                            type: 'success'
                        });
                    }

                    if (code === 2) {
                        this.$notify({
                            title: 'Approve',
                            message: 'Approve Error',
                            type: 'error'
                        });
                    }
                },);
        },
        createClick() {
            this.creteLoading = true;
            const [transitRequest, getList] = this.ETH ?
                [
                    this.$swap.transitForBSC,
                    this.$swap.getTransitList,
                ]
                : [
                    this.$swap.bscPaybackTransit,
                    this.$swap.getPaybackList,
                ];
            const params = {
                amount: this.from,
                token: this.tokenObj.address,
                decimals: this.tokenObj.decimals,
                isETH: ETHConfig.address === this.tokenObj?.address,
            };
            transitRequest(params, (code, res) => {
                this.$store.dispatch('recordCallback', {
                    key: 'bToken Bridge',
                    action: 'bToken Bridge',
                    params: {describe: `bToken Bridge ${params.amount} ${this.tokenObj.symbol}`},
                    code,
                    result: res,
                });

                if (code !== 0) {
                    this.creteLoading = false;
                }

                if (code === 1) {
                    this.saveTransit(res)
                    this.upData();
                    this.from = '';
                    this.transitETH2BSC = this.ETH ? 'ETHBSC' : 'BSCETH';
                    this.ETH2BSC = true;
                    getList().subscribe((data) => {
                        if (data.some(d => d.status === 0)) {
                            this.transitETH2BSC = this.ETH ? 'ETHBSC' : 'BSCETH';
                            this.ETH2BSC = true;
                        }
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Success',
                        type: 'success'
                    });
                }
            });

        },
        saveTransit(tx) {
            if (this.ETH) this.$swap.setEthTransit(tx)
            else this.$swap.setBscPayback(tx)
        }
    }
};
</script>

<style lang="less" scoped>
    .button-box {
        display: flex;
    }

    .group {
        position: relative;
    }

    .mask {
        font-size: 18px;
        top: 0;
        left: 0;
        width: 100%;
        height: 234px;
        position: absolute;
        display: none;
        background-color: rgba(30, 34, 38, 0.8);
    }

    .disabled .mask {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--col-main);
        width: 100%;
        z-index: 2;
        position: absolute;
        cursor: not-allowed;
        height: 100%;
    }
</style>
