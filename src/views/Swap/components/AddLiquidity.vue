<template>
    <div>
        <back-header
            :title="$t('AddLiquidityUI.Add')"
            @click="$emit('view', 'PoolIndex')"
        >
            <a-tooltip
                class="item"
                effect="dark"
                :content="$t('AddLiquidityUI.proTxt1')"
            >
                <a-icon class="icon-wenhao" type="icon-wenhao"/>
            </a-tooltip>
        </back-header>
        <input-item
            v-model="a"
            :token="tokenA"
            :max="true"
            @change="computeVal($event, 'a')"
            @click="open('tokenA')"
            @max="all('a')"
        />
        <input-item
            label="+"
            v-model="b"
            @click="open('tokenB')"
            :token="tokenB"
            @change="computeVal($event, 'b')"
        />
        <liquidity-info
            v-show="liquidityInfo"
            :info="liquidityInfo"
            :tokenA="tokenA"
            :tokenB="tokenB"
        />

        <el-row :gutter="10">
            <el-col :span="approveCollection.length ? 12 : 0">
                <el-button
                    class="public-button-dark __button"
                    @click="approve(approveCollection[0])"
                >
                    {{ $t('Button.Authorization') }} &nbsp;
                    {{ approveCollection[0] | pick('symbol') }}
                </el-button>
            </el-col>
            <el-col :span="approveCollection.length ? 12 : 24">
                <add-liquidity-button
                    :values="[a, b]"
                    :tokens="[tokenA, tokenB]"
                    :info="liquidityInfo"
                    @success="success"
                >
                    {{ $t(btnText) }}
                </add-liquidity-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {interval, Subject, Subscription} from 'rxjs';
    import {debounceTime} from 'rxjs/operators';
    import {swapHelper} from '@/store/swap.module';
    import InputItem from './InputItem.vue';
    import BackHeader from './BackHeader.vue';
    import ApproveCondiction from './ApproveCondiction.vue';
    import AddLiquidityButton from './AddLiquidityButton';
    import LiquidityInfo from './LiquidityInfo.vue';

    const SWAP_INFO = new Subject();

    const ErrorStatus = {
        insufficient: 'AddLiquidityUI.Insufficient',
        supply: 'AddLiquidityUI.Supply',
    };

    export default {
        components: {
            InputItem,
            BackHeader,
            ApproveCondiction,
            AddLiquidityButton,
            LiquidityInfo,
        },
        inject: ['chooseToken', 'viewToggle'],
        name: 'AddLiquidity',
        props: {
            props: {
                type: Object,
                default() {
                    return {
                        tokenA: null,
                        tokenB: null,
                    };
                },
            },
        },
        data() {
            const {tokenA, tokenB} = this.props;
            return {
                a: '',
                b: '',
                approving: false,
                disabled: true,
                type: 'supply',
                tokenB: tokenB,
                tokenA: tokenA || this.$store.state['swap/baseToken'],
                isExist: false,
                liquidityInfo: null,
                approveCollection: [],
                flag: true,
            };
        },
        watch: {
            baseToken: {
                handler(val) {
                    if (!this.tokenA) {
                        this.tokenA = val;
                    }
                },
            },
            props(val) {
                const {tokenA, tokenB} = val;
                if (tokenA) {
                    this.tokenA = tokenA;
                }
                if (tokenB) {
                    console.error('props--->', tokenB)
                    this.tokenB = tokenB;
                }
            },
            tokenA() {
                this.dealApproveCondiction()
            },
            tokenB() {
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

        computed: {
            ...swapHelper.mapState(['baseToken', 'tokenList']),
            ...swapHelper.mapGetters(['getToken', 'ver']),
            btnText() {
                return ErrorStatus[this.type];
            },
        },
        methods: {
            resetQuery() {
                if (this.$route.path === '/trade/pool' && this.$route.query.from && this.$route.query.to) {
                    this.tokenA = this.$route.query.from;
                    this.tokenB = this.$route.query.to;
                }

                console.log("resetQuery this.tokenList: ", this.tokenList)

                const fromToken = this.tokenList.filter(item => item.address.toLowerCase() === this.$route.query.from.toLowerCase())
                const toToken = this.tokenList.filter(item => item.address.toLowerCase() === this.$route.query.to.toLowerCase())
                const setToken = (key, d) => {
                    this[key] = d;
                    this.clearInfo();
                    this.checkStatus();
                };
                if (fromToken.length > 0) setToken('tokenA', fromToken[0])
                if (toToken.length > 0) setToken('tokenB', toToken[0])
            },
            approve(symbol) {
                if (!this.approving && symbol) {
                    this.approving = true;
                    this.$swap.approveToken(
                        {
                            amount: symbol.totalSupply,
                            token: symbol,
                            spender: this.ver === 1 ? this.$swap.$provider.getPlatformAddress() :
                                this.ver === 2 ? this.$swap.$provider.getDelegateAddress() : this.$swap.$provider.getDelegateBetaAddress()
                        },
                        (code, res) => {
                            if (code !== 0) {
                                this.approving = false;
                            }

                            if (code === 1) {
                                this.allowanceIsGreatZero = true;
                                this.updateToken(symbol)
                            }
                        }
                    );
                }
            },

            dealApproveCondiction() {
                const inputValues = [this.a, this.b];
                this.approveCollection = [this.tokenA, this.tokenB].filter(Boolean).filter((token, i) => {
                    const allowance = this.$number(token.allowance);
                    return allowance.isZero() || this.$comparedTo(allowance.toFixed(), inputValues[i]) === -1
                });
            },
            updateToken(symbol) {
                console.log("updateToken: ", symbol)
                this.$swap.queryNewToken(symbol.address, this.ver).then(res => {
                    if (res.valid) {
                        if (this.tokenA.address && symbol.address === this.tokenA.address) this.tokenA = res
                        else this.tokenB = res
                    }
                })
            },
            all(type) {
                if (type === 'a' && this.tokenA) {
                    // console.log(this.tokenA.balance, 'this.tokenA.balance');
                    this.a = this.$number(this.tokenA.balance).toFixed(this.$swap.fixed, 1);
                }
                this.triggetEvent(type);
            },
            computeVal(val, type) {
                this.dealApproveCondiction()
                this.triggetEvent(type);
            },
            open(key) {
                this.chooseToken(
                    (d) => {
                        this[key] = d;
                        this.clearInfo();
                        this.checkStatus();
                    },
                    [this.tokenA, this.tokenB].filter(Boolean),
                    true
                );
            },
            checkStatus() {
                if (this.tokenA && this.tokenB) {
                    this.$swap
                        .queryPairInfo(this.tokenA.address, this.tokenB.address)
                        .then((res) => {
                            // console.log(res, 'queryPairInfo');
                            const {exist, reserveA, reserveB} = res;
                            this.isExist = exist && reserveA > 0 && reserveB;
                            if (this.isExist && this.a) {
                                this.triggetEvent('a');
                            } else {
                                this.a = this.b = '';
                            }
                        });
                }
            },
            clearInfo() {
                if (this.liquidityInfo) {
                    this.liquidityInfo = null;
                }
            },
            triggetEvent(type) {
                let val = this[type];
                const isValid = [this.tokenA, this.tokenB].every(Boolean);
                if (isValid) {
                    SWAP_INFO.next({
                        type,
                        val,
                    });
                }
            },
            checkBalance(token, amount) {
                return this.$number(token?.balance || 0).isGreaterThanOrEqualTo(amount);
            },
            checkAllBalance() {
                const A_IS_ENOUGH = this.checkBalance(this.tokenA, this.a);
                const B_IS_ENOUGH = this.checkBalance(this.tokenB, this.b);
                this.disabled = !(A_IS_ENOUGH && B_IS_ENOUGH);
                this.type = this.disabled ? 'insufficient' : 'supply';
            },
            updateTokenList() {
                this.$store.dispatch('swap/fetchTokens', this.ver).then((list) => {
                    this.tokenA = this.getToken(this.tokenA.address);
                    this.tokenB = this.getToken(this.tokenB.address);
                });
            },
            success() {
                this.a = this.b = '';
                this.clearInfo();
                if (!this.isExist) this.checkStatus();
                this.updateTokenList();
                this.viewToggle();
            },
        },
        mounted() {
            this.checkStatus();
            this._event = new Subscription();
            this._event.add(
                SWAP_INFO.pipe(debounceTime(400)).subscribe(({type, val}) => {
                    if (!this.isExist) {
                        this.checkAllBalance();
                        if (!this.disabled) {
                            this.liquidityInfo = {
                                BPerA: this.$number(this.b).dividedBy(this.a).toFormat(4),
                                APerB: this.$number(this.a).dividedBy(this.b).toFormat(4),
                                amountB: this.b,
                                percent: 100,
                            };
                        }
                    } else {
                        const isA = type === 'a';
                        const [t1, t2] = isA
                            ? [this.tokenA, this.tokenB]
                            : [this.tokenB, this.tokenA];
                        this.$swap
                            .getAmountLiquidity(t1.address, t2.address, Number(this[type]), this.ver)
                            .then((res) => {
                                res.percent = `${this.$number(res.percent)
                                    .multipliedBy(100)
                                    .toFixed(8)}`;
                                const _d = JSON.parse(JSON.stringify(res))
                                res.APerB = type === 'a' ? _d.APerB : _d.BPerA
                                res.BPerA = type === 'a' ? _d.BPerA : _d.APerB
                                this.liquidityInfo = res;
                                const amountB = this.$number(res.amountB).toFixed(
                                    this.$swap.fixed
                                );
                                if (isA) {
                                    this.b = amountB;
                                } else {
                                    this.a = amountB;
                                }
                                this.checkAllBalance();
                                // console.log(this.liquidityInfo, 'this.liquidityInfo');
                            });
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
    .icon-wenhao {
        color: #fff;
    }
</style>
