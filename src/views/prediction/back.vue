<template>
    <div class="_back-container">
        <div class="_title">
            <p>
                <a-icon type="icon-arrow-down1" class="" @click="goBack(false)"/>
                {{$t('prediction.setPosition')}}
            </p>
            <span
                :class="[{'up-bg': types==='up'}, {'down-bg': types==='down'}]"
                @click="typeClick">
                <a-icon type="icon-arrow-down1"/>
                {{types.toUpperCase()}}
            </span>
        </div>

        <div class="_coin">
            <span>{{$t('prediction.commit')}}:</span>
            <span>
                <img :src="require(`../../assets/images/icons/${token}.png`)" alt="">
                {{token}}
            </span>
        </div>

        <div class="_input-box">
            <el-input
                class="_back-input"
                v-model="amount"
                :placeholder="minAmount"
                @input.native="$filterNumber"
                @blur="changeVal"/>
            <span @click="maxClick">{{$t('prediction.max')}}</span>
        </div>
        <div class="_balance">
            {{$t('prediction.balance')}}:
            <count-jump :val="$toFixed(balance, 2)" :is-format="true"/>
        </div>
        <div class="_back-slider">
            <el-slider
                class=""
                v-model="slide"
                :marks="marks"
                @input="changeElSlider($event)"
                @change="changeSlider($event)"
                :show-tooltip='showTooltip'/>
        </div>

        <el-button class="_ok-btn"
            :loading="loading"
            :disabled="Number(amount)< minNum && !isApprove"
            @click="userClick">
            {{isApprove ? $t('prediction.approve') : $t('prediction.ok')}}
        </el-button>

        <div class="_tips">
            {{$t('prediction.tips')}}
        </div>
    </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import ChainApi from '../../../static/sdk/ChainApi';
import CountJump from '../../components/countJump/index';

export default {
    name: 'back',
    components: {CountJump},
    props: ['data', 'type', 'info', 'isRotate'],
    data() {
        return {
            amount: '',
            slide: 0,
            showTooltip: false,
            marks: {
                0: '',
                25: '',
                50: '',
                75: '',
                100: '',
            },
            isApprove: true,
            loading: false,
            balance: 0,
            token: 'USDT',
            types: 'up',
            minAmount: '',
            minNum: 0
        }
    },
    watch: {
        amount() {
            this.slide = ((this.amount || 0) / this.balance) * 100
        },
        type: {
            handler(val) {
                this.types = val
            }
        },
        data: {
            handler(val) {
                if (val) {
                    this.getUserBalance();
                    this.getApprove();
                }
            },
            deep: true
        },
        info: {
            handler(val) {
                if (val) {
                    this.token = this.info.tokenSymbol
                }
            },
            deep: true
        },
        isRotate: {
            handler(val) {
                if (!val) {
                    this.amount = '';
                }
            },
            deep: true
        }
    },
    mounted() {
        if (this.data.address) {
            this.getUserBalance();
            this.getApprove();
            this.getMinAmount(this.info.tokenDecimals)
        }
    },
    methods: {
        getUserBalance() {
            ChainApi.DemaxPricePrediction(this.data.address).balance().then(res => {
                this.balance = res;
            });
        },
        getApprove() {
            ChainApi.DemaxPricePrediction(this.data.address).allowance().then(res => {
                this.isApprove = res == 0;
            });
        },
        typeClick() {
            this.types = this.types === 'up' ? 'down' : this.types === 'down' ? 'up' : 'up';
        },
        goBack(update) {
            this.$emit('goBack', update)
        },
        changeVal() {
            this.amount = this.$comparedTo(this.amount, this.balance) === 1 ? 10 : this.amount;
        },
        changeSlider(val) {
            this.amount = new BigNumber(this.balance).multipliedBy(val) / 100
        },
        changeElSlider(val) {
            // val.stopPropagation();
            console.log('slide===>', val)
            let dom = this.$el.querySelectorAll('.el-slider')[0];
            if (val > 0) dom.className = 'el-slider active-0';
            if (val > 25) dom.className = 'el-slider active-0 active-25';
            if (val > 50) dom.className = 'el-slider active-0 active-25 active-50';
            if (val > 75) dom.className = 'el-slider active-0 active-25 active-50 active-75';
            if (val < 75) dom.className = 'el-slider active-0 active-25 active-50';
            if (val < 50) dom.className = 'el-slider active-0 active-25';
            if (val < 25) dom.className = 'el-slider active-0';
            if (val == 0) dom.className = 'el-slider';
        },
        maxClick() {
            this.amount = this.balance
        },
        userClick() {
            this.loading = true;
            if (this.isApprove) this.approve();
            else this.stake()
        },
        approve() {
            ChainApi.DemaxPricePrediction(this.data.address).approve().then(hash => {
                this.$store.dispatch('recordCallback', {
                    key: 'Prediction',
                    action: 'Prediction',
                    params: {describe: `Approve ${this.token}`},
                    code: 0,
                    result: hash,
                });
                return ChainApi.awaitTransactionMined(hash);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Approve ${this.token}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Approve',
                        message: 'Approve Success',
                        type: 'success'
                    });
                    this.isApprove = false;
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Approve ${this.token}`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Approve',
                        message: 'Approve Error',
                        type: 'error'
                    });
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        stake() {
            if (this.types === 'up') this.bull();
            if (this.types === 'down') this.bear();
        },
        subscribeUpdate() {
            this.$emit('subscribeUpdate')
        },
        bull() {
            ChainApi.DemaxPricePrediction(this.data.address).betBull(this.amount).then(hash => {
                this.$store.dispatch('recordCallback', {
                    key: 'Prediction',
                    action: 'Prediction betBull',
                    params: {describe: `Prediction betBull ${this.amount} ${this.token}`},
                    code: 0,
                    result: hash,
                });
                return ChainApi.awaitTransactionMined(hash);
            }).then(receipt => {
                if (receipt.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction Bull',
                        params: {describe: `Prediction betBull ${this.amount} ${this.token}`},
                        code: 1,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'betBull',
                        message: 'betBull Success',
                        type: 'success'
                    });
                    this.subscribeUpdate();
                    this.getUserBalance();
                    this.goBack(true);
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction Bull',
                        params: {describe: `Prediction betBull ${this.amount} ${this.token}`},
                        code: 2,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'betBull',
                        message: 'betBull Error',
                        type: 'error'
                    });
                }
            }).finally(() => {
                this.loading = false;
                this.amount = '';
            });
        },
        bear() {
            ChainApi.DemaxPricePrediction(this.data.address).betBear(this.amount).then(hash => {
                this.$store.dispatch('recordCallback', {
                    key: 'Prediction',
                    action: 'Prediction betBear',
                    params: {describe: `Prediction betBear ${this.amount} ${this.token}`},
                    code: 0,
                    result: hash,
                });
                return ChainApi.awaitTransactionMined(hash);
            }).then(receipt => {
                if (receipt.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction betBear',
                        params: {describe: `Prediction betBear ${this.amount} ${this.token}`},
                        code: 1,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'betBear',
                        message: 'betBear Success',
                        type: 'success'
                    });
                    this.subscribeUpdate();
                    this.getUserBalance();
                    this.goBack(true);
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction betBear',
                        params: {describe: `Prediction betBear ${this.amount} ${this.token}`},
                        code: 2,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'betBear',
                        message: 'betBear Error',
                        type: 'error'
                    });
                }
            }).finally(() => {
                this.loading = false;
                this.amount = '';
            });
        },
        getMinAmount(decimals) {
            ChainApi.DemaxPricePrediction(this.data.address).getMinBetAmount().then(res => {
                if (res) {
                    this.minNum = this.$shiftedBy(res, -decimals);
                    this.minAmount = this.$t('prediction.minAmount', {amount: this.$shiftedBy(res, -decimals)});
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
    ._back-container {
        width: 100%;
        padding: 18px 20px 0;

        ._title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            margin-bottom: 20px;

            p {
                display: flex;
                align-items: center;

                .a-icon {
                    transform: rotate(90deg);
                    padding: 0;
                    margin-right: 5px;
                    cursor: pointer;

                    ::v-deep svg {
                        font-size: 20px;
                    }
                }
            }

            & > span {
                display: flex;
                align-items: center;
                padding: 0 6px;
                height: 26px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;

                .a-icon {
                    margin-right: 5px;

                    ::v-deep svg {
                        font-weight: bold;
                        font-size: 18px;
                    }
                }

                &.up-bg {
                    .a-icon {
                        transform: rotate(180deg);
                    }
                }
            }
        }

        .up-bg {
            background-color: #309049;
        }

        .down-bg {
            background-color: #BC533F;
        }

        ._coin {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            span {
                font-weight: 600;
                font-size: 14px;
                color: #ABACAE;
                display: flex;
                align-items: center;

                &:nth-of-type(2) {
                    color: #ffffff;
                }

                img {
                    width: 24px;
                    margin-right: 8px;
                }
            }
        }

        ._input-box {
            position: relative;

            span {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                color: #F0B80B;
            }
        }

        ._balance {
            text-align: right;
            font-weight: 500;
            font-size: 12px;
            color: #ABACAE;
            margin-top: 7px;
        }

        ._ok-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            width: 100%;
            height: 35px;
            background: linear-gradient(180deg, #F0B90B 0%, #F8D12F 100%);
            box-shadow: 1px 2px 0px #ECBA00, inset 0px -1px 6px rgba(91, 193, 160, 0.2);
            border-radius: 36px;
            border: 0;
            font-weight: 500;
            font-size: 14px;
            color: #212833;

            &:disabled {
                color: #AAAAAA;
                background: linear-gradient(360deg, #DDDDDD 0%, #F3F2EE 100%);
                box-shadow: none;
            }
        }

        ._tips {
            font-weight: 500;
            font-size: 12px;
            line-height: 14px;
            color: rgba(#C4C4C4, .3);
            margin-top: 10px;
        }
    }

    @media (max-width: 768px) {
        ._back-container {
            padding: 10px 10px 0;

            ._title {
                font-size: 10px;
            }

            ._coin {
                span {
                    font-size: 10px;
                }
            }

            ._input-box {
                span {
                    font-size: 10px;
                }
            }

            ._balance {
                font-size: 8px;
            }

            ._tips {
                font-size: 8px;
            }
        }
    }
</style>
