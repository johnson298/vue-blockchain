<template>
    <div class="pay-back-record">
        <div :class="['box', {'bg-box': item.active}]" v-for="item in paybackList"
            :key="item.tx_id">
            <div class="left">
                <img :src="bscIcon" alt="" style="z-index: 3"/>
                <div class="iconArrow">
                    <a-icon class="direction" type="icon-direct"/>
                </div>
                <img :src="ethIcon" alt="" style="z-index: 3"/>
            </div>
            <div class="center">
                <div class="margin-space">
                    {{ $shiftedBy(item.amount, -item.decimals).toFixed(6) }}&nbsp;{{ item.symbol }}
                </div>
                <div class="token-address">
                    <span class="copy copy-btn"
                        :data-clipboard-text="item.token"
                        @click="copyClick"
                    >
                        {{ $t('Transit.Copy') }}
                    </span>
                </div>
                <div class="token-account" v-if="account.toLocaleLowerCase() !== (item.from).toLocaleLowerCase() && item.status === 0">
                    {{$t('Transit.placeAccount', {account: addressNumFilter(item.from)})}}
                </div>
            </div>
            <div class="right">
                <div v-if="item.status === 0">
                    <el-button
                        type="text"
                        class="recieve"
                        @click="recieve(item)"
                        :loading="status.idx === item.payback_id"
                        :disabled="status.loading || account.toLocaleLowerCase() !== (item.from).toLocaleLowerCase()"
                    >
                        {{ $t('Transit.Recieve') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Subject} from 'rxjs';
import {bscIcon, ethIcon} from './images/index';
import {map, switchMap} from 'rxjs/operators';
import * as Clipboard from 'clipboard';
import {mapGetters, mapState} from 'vuex';

export default {
    name: 'PayBackRecord',
    props: ['data'],
    data() {
        return {
            ethIcon: ethIcon,
            bscIcon: bscIcon,
            paybackList: [
                // {
                //     amount: '123',
                //     createBlock: 9,
                //     from: '',
                //     id: 2,
                //     payback_id: 'daf',
                //     symbol: 'ETH',
                //     decimals: 7,
                //     sign: '',
                //     status: 0,
                //     token: 'ETH',
                //     withdrawBlock: 2,
                // }
            ],
            status: {
                idx: '',
                loading: false,
            },
        };
    },
    watch: {
        data: {
            handler(val) {
                if (val) {
                    val.active = true;
                    let list = [];
                    list.push(val);
                    this.getAddList(list).subscribe(res => {
                        if (res.constructor === Array) {
                            this.paybackList.unshift(res[0])
                        }
                    })
                }
            },
            deep: true
        },
    },
    mounted() {
        this.init();
    },
    computed: {
        ...mapState({
            account: 'account',
        }),
    },
    methods: {
        init() {
            this._sub = this.getList().subscribe(data => {
                console.log('paybackList data....', data)
                if (data.constructor === Array) {
                    this.paybackList = data;
                }
                // console.log(this.paybackList, 'getPaybackList');
            });
        },
        getList() {
            return this.$swap.getPaybackList().pipe(switchMap(data => {
                    // console.log('data:map', data);
                    console.log('data:map', data)
                    return this.$swap.queryTokens(data.map((d) => d.token)).pipe(
                        map(tokens => {
                            console.log('tokens map....', tokens);
                            return tokens.map((token, i) => {
                                const [symbol, name, decimals] = token;
                                return {
                                    ...data[i],
                                    symbol,
                                    name,
                                    decimals,
                                };
                            });
                        }),
                    );
                }),
            );
        },
        getAddList(data) {
            return this.$swap.queryTokens(data.map((d) => d.token)).pipe(
                map(tokens => {
                    console.log('tokens map....', tokens);
                    return tokens.map((token, i) => {
                        const [symbol, name, decimals] = token;
                        return {
                            ...data[i],
                            symbol,
                            name,
                            decimals,
                        };
                    });
                }),
            );
        },
        copyClick() {
            const clipboard = new Clipboard('.copy-btn');
            this.$message({
                message: this.$t('AccountInfoUI.copySuccess'),
                showClose: true,
                type: 'success',
            });
        },
        recieve(d) {
            this.status = {
                idx: d.payback_id,
                loading: true,
            };
            SwapInstance.ETHWithdrawFromBSC(d, async (code, res) => {
                this.$store.dispatch('recordCallback', {
                    key: 'Recieve',
                    action: 'Recieve',
                    params: {describe: `Recieve ${d.symbol}`},
                    code,
                    result: res,
                });
                if (code !== 0 && code !== 1) {
                    this.status = {
                        idx: '',
                        loading: false,
                    };
                }
                console.log(code, res);
                if (code === 1) {
                    await this.$swap.setEthWithdraw(res)
                    this.getList().subscribe(data => {
                        this.paybackList = data;
                        this.status = {
                            idx: '',
                            loading: false,
                        };
                    });

                    this.$notify({
                        title: 'Recieve',
                        message: 'Recieve Success',
                        type: 'success'
                    });
                }

                if (code === 2) {
                    this.$notify({
                        title: 'Recieve',
                        message: 'Recieve Error',
                        type: 'error'
                    });
                }
            });
        },
    },
    destroyed() {
        this._sub && this._sub.unsubscribe();
    },
};
</script>

<style lang="less" scoped>
    .pay-back-record {
        .box {
            width: 640px;
            height: 108px;
            background: #292D31;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            padding: 0 30px;
            margin-bottom: 20px;
        }

        .bg-box {
            border: 1px solid #f0b80b;
        }

        .left {
            display: flex;
            align-items: center;

            .iconArrow {
                padding: 0 10px;
                color: var(--col-main);
                font-size: 24px;
            }

            img {
                height: 60px;
            }
        }

        .center {
            flex: 1;
            padding-left: 42px;

            .margin-space {
                color: rgba(255, 255, 255, 0.5);
            }

            .token-address {
                padding-top: 5px;
                color: var(--col-label60);
                cursor: pointer;
            }

            .token-account {
                color: #f0b80b;
                margin-top: 10px;
            }
        }

        .right {

        }

        .recieve {
            color: var(--col-main);
            &:disabled {
                color: #C0C4CC;
            }
        }
    }
</style>
