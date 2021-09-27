<template>
    <div class="gas-station">
        <div class="top" @click="open = !open">
            <span class="left">
                {{ $t(open ? 'Transit.Close' : 'Transit.Station') }}
            </span>
            <a-tooltip
                v-if="!open"
                class="item"
                effect="dark"
                :content="$t('Transit.ConvertTip')"
            >
                <a-icon class="icon" type="icon-wenhao"/>
            </a-tooltip>
        </div>
        <div v-show="open" class="select">
            <input-item
                v-model="from"
                :token="data"
                :max="false"
                :BNB="true"
                :BNBNumber="BNB"
                @click="openView()"
                @change="iptChange"
            />
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
                    :disabled="izGreateZero || !data || disabled"
                    @click="createClick"
                    :loading="creteLoading"
                >
                    {{ $t('Transit.Convert') }}
                </el-button>
            </div>
        </div>
        <DialogTokens
            :tokensList="list"
            :open.sync="view"
            :spender="convertAddress"
            @close="rowClick"
            :showSearch="false"
            :title="$t('coinSelectView.selectTitle')"
        >
        </DialogTokens>
        <ETH2BSC :open.sync="ETH2BSC" :type="'ConvertETH2BSC'"></ETH2BSC>
    </div>
</template>

<script>
import ETH2BSC from './ETH2-BSC';
import InputItem from '../Swap/components/InputItem.vue';
import DialogTokens from '@/views/Transit/DialogTokens';
import {Subject, Subscription} from 'rxjs';
import {ETHConfig} from '@/assets/js/tokenMap';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {mapState} from 'vuex';

const inputOb = new Subject();
export default {
    name: 'GasStation',
    components: {
        InputItem,
        DialogTokens,
        ETH2BSC,
    },
    props: [
        'spender', 'mask'
    ],
    watch: {
        chainId: {
            handler(chainID) {

            },
            immediate: true,
        },
    },
    data() {
        return {
            open: false,
            from: '',
            convertAddress: '',
            approveLoading: false,
            izGreateZero: false,
            creteLoading: false,
            view: false,
            list: [],
            disabled: false,
            data: undefined,
            value: '',
            loading: false,
            BNB: '',
            isETHRef: null,
            limitRef: null,
            rate: '',
            ETH2BSC: false,
        };
    },
    mounted() {
        let a = '123123';

        this.init();
    },
    methods: {
        init() {
            console.log('GasStation init...');
            this.$swap.loginStatus().subscribe((res) => {
                if (res) {
                    this._sub = this.useLoginStatus();
                    this.convertAddress = this.$swap.$provider.getConvertAddress();
                }
            });
        },
        openView() {
            this.view = true;
        },
        iptChange($event) {
            console.log('iptChange:', $event);
            this.BNB = $event ? this.$number(this.rate).multipliedBy($event).toFixed(6) : '';
            const d = this.$number(this.data.allowance);
            const a = this.$number($event);
            this.from = [-1].includes(this.$comparedTo( $event, this.data.balance)) ? $event : this.data.balance;
            if (d.isZero() || (a.isGreaterThan(d) && a.isLessThan(this.tokenObj.totalSupply))) {
                this.izGreateZero = true;
            } else {
                this.izGreateZero = false;
            }
        },
        approveClick() {
            this.approveLoading = true;
            this.$swap.approveToken(
                {
                    amount: this.data.totalSupply,
                    token: this.data,
                    spender: this.convertAddress,
                }, (code, res) => {
                    if (code !== 0) {
                        this.approveLoading = false;
                    }

                    if (code === 1) {
                        this.data.allowance = this.data.totalSupply;
                        // this.show = false;
                    }
                },
            );
        },
        createClick() {
            if (this.data) {
                const transitRequest = this.isETHRef
                    ? SwapInstance.convertETHForBNB
                    : SwapInstance.convertTokenForBNB;

                if (this.creteLoading) return;

                this.creteLoading = true;

                const params = {
                    amount: this.from,
                    address: this.data.address,
                    decimals: this.data.decimals,
                };

                transitRequest(params, (code, res) => {
                    if (code !== 0) {
                        this.creteLoading = false;
                    }
                    if (code === 1) {
                        this.update(this.list.map(d => d.address));
                        this.from = '';
                        this.ETH2BSC = true;

                    }
                });
            }

        },
        update(res) {
            console.log('update:', res);
            const requests = res.filter((d) => d !== ETHConfig.address).map((d) => {
                return this.$swap.getTokenInfo({
                    token: d,
                    wallet: this.$swap.$provider.currentAccount,
                    spender: this.convertAddress,
                }).then((data) => {
                    data.address = d;
                    return data;
                });
            });

            const hasETH = res.includes(ETHConfig.address);

            if (hasETH) {
                requests.unshift(
                    this.$swap.$provider.getBalance().then(balance => {
                        return {
                            ...ETHConfig,
                            balance: balance,
                        };
                    }),
                );
            }

            Promise.all(
                requests.map(p => {
                    return p.then(data => {
                        console.log('getTokenInfo res:', data);
                        return this.$swap.tokenLimits(data).then(res => {
                            return {
                                ...data,
                                limit: res,
                            };
                        });
                    });
                }),
            ).then(([...info]) => {
                this.list = info;
                console.log('tokenLimits:-------->', info);
                const BNB = this.list.find(d => d.symbol === 'BNB');
                if (BNB && !this.data) {
                    this.rowClick(BNB);
                }
            });
        },
        rowClick(d) {
            if (!d) {
                return;
            }
            console.log('rowClick:', d);
            this.data = d;
            this.isETHRef = d.address === ETHConfig.address;
            this.limitRef = this.$number(d.limit);
            this.from = '';
            this.BNB = '';
            this.disabled = true;
            this.$store.dispatch('transit/symbolPrice', this.data.symbol).then(res => {
                this.rate = res;
                this.disabled = false;
            });
        },
        useLoginStatus() {
            const _sub = new Subscription();
            _sub.add(
                this.$swap.chainId().subscribe(chainID => {
                    console.log('useLoginStatus:', chainID, this.$swap.$provider.isEthNet())
                    this.data = undefined;
                    this.from = '';
                    if (this.$swap.$provider.isEthNet() === false) {
                        this.view = false;
                    } else {
                        _sub.add(this.$swap.validTokens().subscribe(this.update));
                    }
                })
            );
            return _sub;
        }
    },
    destroyed() {
        this._sub && this._sub.unsubscribe();
    },
    computed: {
        ...mapState(['chainId']),
    },
};
</script>

<style lang="less" scoped>
.gas-station {
    .top {
        display: flex;
        font-size: 16px;
        align-items: center;
        font-weight: 700;
        margin-bottom: 30px;
        justify-content: center;
        margin-top: 40px;
        cursor: pointer;

        .left {
            color: var(--col-main);
            margin-right: 10px;
        }
    }

    .select {
        height: 234px;
        width: 100%;
        /*background: red;*/
    }
}

.button-box {
    display: flex;
}
</style>
