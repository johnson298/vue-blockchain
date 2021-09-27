<template>
    <div class="transit-cords">
        <div :class="['box', {'bg-box': item.active}]" v-for="item in transitList"
            :key="item.transit_id">
            <div class="left">
                <img :src="ethIcon" alt="" style="z-index: 3"/>
                <div class="iconArrow">
                    <a-icon class="direction" type="icon-direct"/>
                </div>
                <img :src="bscIcon" alt="" style="z-index: 3"/>
            </div>
            <div class="center">
                <div class="margin-space">
                    {{$shiftedBy(item.amount, -item.decimals) | toFixed(6)}}&nbsp;{{ item.symbol }}
                </div>
                <div class="token-address">
                    <span class="copy copy-btn"
                        :data-clipboard-text="item.token"
                        @click="copyClick(item.token)"
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
                        :loading="status.idx === item.transit_id"
                        :disabled="status.loading"
                    >
                        {{ $t('Transit.Recieve') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {SwapInstance} from '@/assets/swap.init';
import {bscIcon, ethIcon} from '@/views/Transit/images';
import * as Clipboard from 'clipboard';
import {mapState} from 'vuex';
// import copy from 'copy-to-clipboard';

export default {
    name: 'Transitrecords',
    props: ['update', 'data'],
    data() {
        return {
            ethIcon: ethIcon,
            bscIcon: bscIcon,
            transitList: [],
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
                    this.transitList.unshift(val)
                }
            },
            deep: true
        },
    },
    computed: {
        ...mapState({
            account: 'account',
        }),
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$swap.loginStatus().subscribe((res) => {
                if (res) {
                    this.$store.dispatch('transit/getTransitList').then(res => {
                        if (res.constructor === Array) {
                            this.transitList = res;
                        }
                    });
                }
            });

            // this._sub = this.$swap.getTransitList().subscribe(data => {
            //     this.transitList = data;
            //     console.log('data', data);
            // });
        },
        recieve(d) {
            this.status = {
                idx: d.transit_id,
                loading: true,
            };
            this.$swap.BSCWithdrawTransitToken(d, async (code, res) => {
                // console.log(code, res);
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
                if (code === 1) {
                    await this.$swap.setBscWithdraw(res)
                    this.$swap.getTransitList().subscribe(data => {
                        this.transitList = data;
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
        copyClick(token) {
            if (this.$swap.$storage.isETH(token)) {
                this.$message.warning(this.$t('AccountInfoUI.noReceive'))
            } else {
                SwapInstance.pairTo(token).subscribe(toAddress => {
                    // console.log('copyClick', token, toAddress);
                    new Clipboard('.copy-btn', {
                        text: function () {
                            return toAddress;
                        }
                    });
                    this.$message({
                        message: this.$t('AccountInfoUI.copySuccess'),
                        showClose: true,
                        type: 'success',
                    });
                }, console.log);
            }
        },
    },
    destroyed() {
        this._sub && this._sub.unsubscribe();
    },
};
</script>

<style lang="less" scoped>
    .transit-cords {
        .box {
            /*width: 640px;*/
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
                /*color: rgba(255, 255, 255, 0.5);*/
                color: var(--col-label60);
            }

            .token-address {
                padding-top: 5px;
                color: var(--col-label60);

                span {
                    cursor: pointer;
                }
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
        }
    }
</style>
