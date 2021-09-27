<template>
    <div class="_relative">
        <global-config/>

        <input-item
            v-model="from"
            :token="SwapState.fromToken"
            :label="$t('swapControl.From')"
            :max="true"
            @change="computeVal($event, 'from')"
            @click="open('fromToken')"
            @max="all('from')"
        />
        <input-item
            v-model="to"
            :token="SwapState.toToken"
            :label="$t('swapControl.To')"
            @change="computeVal($event, 'to')"
            @click="open('toToken')"
        >
            <template v-slot:append>
				<span style="display: flex">
					<a-icon
                        style="cursor: pointer;"
                        type="icon-exchange"
                        class="icon-exchange"
                        @click="exchange"
                    />
				</span>
            </template>
        </input-item>
        <price-change/>
        <approve-condiction ref="approveCondiction" :symbol="SwapState.fromToken"
            @success="updateToken">
            <swap-button
                :from="from"
                :to="to"
                slot-scope="slotProps"
                :disabled="disabled || slotProps.disabled"
                @success="success"
                :type="type"
            >
                {{ $t(btnText) }}
            </swap-button>
        </approve-condiction>
        <swap-detail :from="from"/>
    </div>
</template>
<script>
import InputItem from './components/InputItem.vue';
import PriceChange from './components/PriceChange.vue';
import SwapDetail from './components/SwapDetail.vue';
import {swapHelper} from '@/store/swap.module';
import {interval, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import ApproveCondiction from './components/ApproveCondiction.vue';
import SwapButton from './components/SwapButton.vue';
import GlobalConfig from '../../components/top/GlobalConfig';

const ErrorStatus = {
    balance: 'swapControl.Insufficient',
    liquidity: 'swapControl.ErrorPair',
    swap: 'swapControl.Swap',
};

const SWAP_INFO = new Subject();

export default {
    name: 'SwapIndex',
    inject: ['chooseToken'],
    components: {
        GlobalConfig,
        InputItem,
        PriceChange,
        SwapDetail,
        ApproveCondiction,
        SwapButton,
    },
    data() {
        return {
            from: '',
            to: '',
            disabled: true,
            type: 'swap',
            flag: true,
        };
    },
    computed: {
        ...swapHelper.mapState(['SwapState', 'ver', 'tokenList']),
        btnText() {
            return ErrorStatus[this.type];
        },
        fromToken() {
            return this.SwapState.fromToken
        }
    },
    watch: {
        fromToken() {
            this.dealApproveCondiction()
        },
        tokenList: {
            handler(val) {
                if (val.length > 0) {
                    this.flag = val.every(item => Object.keys(item).indexOf('balance') == -1);
                }
            },
            immediate: true,
        },
        flag: {
            handler() {
               this.resetQuery();
            }
        }
    },
    methods: {
        resetQuery() {
            if (this.$route.path === '/trade/swap' && this.$route.query.from && this.$route.query.to) {
                this.$store.commit('swap/setSwapState', {
                    fromToken: this.$route.query.from,
                    toToken: this.$route.query.to,
                });
                const fromToken = this.tokenList.filter(item => item.address.toLowerCase() === this.$route.query.from.toLowerCase())
                const toToken = this.tokenList.filter(item => item.address.toLowerCase() === this.$route.query.to.toLowerCase())
                const setToken = (key, d) => {
                    this.clearSwapInfo();
                    this.$store.commit('swap/setSwapState', {
                        [key]: d,
                    });
                    this.checkStatus();
                }
                if (fromToken.length > 0) setToken('fromToken', fromToken[0])
                if (toToken.length > 0) setToken('toToken', toToken[0])
            }
        },
        dealApproveCondiction() {
            if (!this.fromToken) return this.$refs.approveCondiction.notApproved = false
            const allowance = this.$number(this.fromToken.allowance);

            console.log('allowance---->', allowance.toFixed())
            if (allowance.isZero() || this.$comparedTo(allowance.toFixed(), this.from) === -1) this.$refs.approveCondiction.notApproved = true
            else this.$refs.approveCondiction.notApproved = false
            console.log('dealApproveCondiction: ', this.$refs.approveCondiction)

        },
        exchange() {
            const {fromToken, toToken} = this.SwapState;
            [this.from, this.to] = [this.to, this.from];
            this.$store.commit('swap/setSwapState', {
                fromToken: toToken,
                toToken: fromToken,
            });
            this.triggetEvent('from');

            this.dealApproveCondiction()
        },
        all(type) {
            if (type === 'from') {
                const dd = this.$number(this.SwapState.fromToken.balance);
                if (!dd.isZero()) {
                    this.from = this.$number(this.SwapState.fromToken.balance).toFixed(
                        this.$swap.fixed, 1
                    );
                }
                this.triggetEvent('type');
            }
        },
        computeVal(val, type) {
            if (type === 'from') this.dealApproveCondiction()
            this.triggetEvent(type);
        },
        open(key) {
            console.log("open SwapState: ", key)

            this.chooseToken((d) => {
                this.clearSwapInfo();
                this.$store.commit('swap/setSwapState', {
                    [key]: d,
                });
                this.checkStatus();
            }, [this.SwapState.fromToken, this.SwapState.toToken].filter(Boolean));
        },
        checkStatus() {
            console.log("checkStatus SwapState: ", this.SwapState)
            const {fromToken, toToken} = this.SwapState;
            if (fromToken && toToken) {
                if (!this.from) {
                    this.from = '1';
                }
                this.to = '';
                this.$swap
                    .checkCondition(fromToken.address, toToken.address)
                    .then((res) => {
                        if (+res !== 0) {
                            this.type = 'liquidity';
                            this.disabled = true;
                        } else {
                            this.type = 'swap';
                        }
                        this.triggetEvent('from');
                    });
            }
        },
        clearSwapInfo() {
            if (this.SwapState.swapInfo) {
                this.$store.commit('swap/setSwapState', {
                    swapInfo: undefined,
                });
            }
        },
        triggetEvent(type) {
            const {fromToken, toToken} = this.SwapState;
            let val = this[type];
            const isZero = this.$number(val || 0).isZero();

            if (isZero) {
                if (type === 'from') {
                    this.to = '';
                } else {
                    this.from = '';
                }
                this.disabled = true;
                this.clearSwapInfo();
                return;
            }
            const isValid = [fromToken, toToken].every(Boolean);
            if (isValid) {
                SWAP_INFO.next({
                    type,
                    val,
                });
            }


        },
        updateToken() {
            console.log("this.$swap.queryNewToken: ", this.fromToken.address)
                console.log("this.$swap.queryNewToken: ", this.ver)

            this.$swap.queryNewToken(this.fromToken.address, this.ver).then(res => {
                if (res.valid) {
                    this.$store.commit('swap/setSwapState', {fromToken: res})
                }
            })
        },
        success() {
            this.from = this.to = '';
            this.clearSwapInfo();
        },
    },
    mounted() {
        this.$store.commit('swap/setVer', 1);
        this._event = new Subscription();
        this._event.add(
            interval(8000).subscribe(() => {
                this.triggetEvent('from');
            })
        );
        this._event.add(
            SWAP_INFO.pipe(debounceTime(400)).subscribe(async ({type, val}) => {
                const {fromToken, toToken} = this.SwapState;
                const tokenA = fromToken?.address;
                const tokenB = toToken?.address;
                // init canSwap
                const notEnoughBalance = this.$number(
                    fromToken?.balance || 0
                ).isLessThan(val);

                console.log('from: ', tokenA);
                console.log('to: ', tokenB);
                console.log('framountom: ', val);
                console.log('tolerance: ', String(this.$store.getters.tolerance));
                console.log('type: ', type);

                const info = await this.$swap.getSwapInfo({
                    from: tokenA,
                    to: tokenB,
                    amount: val,
                    tolerance: String(this.$store.getters.tolerance),
                    type,
                });
                console.log('noInfo', info);
                console.log('this.type: ', this.type);
                const noInfo = !info || info.canSwap === 0;
                // console.log(noInfo, 'noInfo', info);
                if (noInfo) {
                    this.type = 'liquidity';
                    return;
                }

                if (notEnoughBalance) {
                    this.type = 'balance';
                } else {
                    this.type = 'swap';
                }
                // console.error('this._event.add', type, val, info)
                // button can click
                this.disabled = notEnoughBalance;
                this.$store.commit('swap/setSwapState', {swapInfo: info});
                if (type === 'from') {
                    this.to = this.$number(info.amountOut).toFixed(8);
                } else if (type === 'to') {
                    this.from = this.$number(info.amountIn).toFixed(8);
                }
            })
        );
    },
    beforeDestroy() {
        this._event && this._event.unsubscribe();
    },
};
</script>
<style lang="less" scoped>
    .icon-exchange {
        font-size: 20px;
    }

    ._relative {
        position: relative;
    }
</style>
