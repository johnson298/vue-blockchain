<template>
<div class="_end-info">
    <ul>
        <li>
            <div class="_token _mg-tp-20">
                <span>{{$t('Ifo.percentage')}}</span>
                <span><count-jump :val="percentage"/>%</span>
            </div>
        </li>
        <li>
            <div>
                <p>{{$t('Ifo.committed')}}</p>
                <p><count-jump :val="committed"/></p>
            </div>
            <div>
                <p>{{symbol}} {{$t('Ifo.claimable')}}</p>
                <p><count-jump :val="$shiftedBy(claimAmount, -offerDecimals)"/></p>
            </div>
        </li>
        <li>
            <el-button
                class="_n-btn _b-btn"
                :disabled="isDisabled"
                :loading="isLoad"
                @click="claimClick()">
                {{$t('Ifo.claimAll')}}
            </el-button>
        </li>
    </ul>
</div>
</template>


<script>
import ChainApi from '../../../../../static/sdk/ChainApi';
import {mapGetters, mapState} from 'vuex';
import CountJump from '../../../../components/countJump/index';

export default {
    name: 'end-info',
    components: {CountJump},
    props: ['poolAddress', 'walletAddress', 'totalAmount', 'raisingAmount'],
    data() {
        return {
            isLoad: false,
            isDisabled: true,
            commitAmount: 0,
            claimAmount: 0,
            offerDecimals: null,
            claimed: false,
            symbol: '',
            percentage: (Number(this.totalAmount)/Number(this.raisingAmount)*100).toFixed(2),
            committed: 0
        }
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
        }),
    },
    watch: {
        isConnect() {
            this.init();
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getUserInfo()
        },
        getUserInfo() {
            ChainApi.ifoGetUserInfo(this.poolAddress, this.walletAddress).then(res => {
                // console.log('end....', res)
                this.committed = this.$shiftedBy(res.amount, -Number(res.pool.lpTokenDecimals)).toFixed(6);
                this.claimAmount = res.offer;
                this.isDisabled = !res.canHarvest;
                this.offerDecimals = res.pool.offeringTokenDecimals;
                this.symbol = res.pool.offeringTokenSymbol;
                this.claimed = res.claimed;
            })
        },
        claimClick() {
            this.isLoad = true;
            ChainApi.ifoHarvest(this.poolAddress).then(res => {
                this.$store.dispatch('recordCallback', {
                    key: 'Claim',
                    action: 'Ifo',
                    params: {describe: `Claim ${this.symbol}`},
                    code: 0,
                    result: res,
                });
                return ChainApi.awaitTransactionMined(res)
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Claim',
                        action: 'Ifo',
                        params: {describe: `Claim ${this.symbol}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Claim',
                        message: 'Claim Success',
                        type: 'success'
                    });
                    this.getUserInfo();
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Claim',
                        action: 'Ifo',
                        params: {describe: `Claim ${this.symbol}`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Claim',
                        message: 'Claim Error',
                        type: 'error'
                    });
                }
                this.isLoad = false;
                this.isDisabled = true;
            }).catch(e => {
                this.isLoad = false;
            }).finally(f => {
                this.isLoad = false;
            })
        }
    }
}
</script>

<style scoped lang="less">
    ._end-info {
        ul {
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(#ffffff, .1);

            li {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;

                &:nth-last-child(1) {
                    margin-bottom: 0;
                }

                div {
                    &:nth-of-type(2n) {
                        text-align: right;
                    }

                    p {
                        color: #ffffff;
                        font-size: 14px;

                        &:nth-of-type(1) {
                            color: rgba(#ffffff, .6);
                            margin-bottom: 15px;
                        }
                    }
                }
            }
        }

        ._token {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        ._b-btn {
            display: block;
            width: 100%;
            height: 40px;
            font-size: 16px;
            border-radius: 36px;
        }
    }
</style>
