<template>
    <div>
        <header class="solo-list-head" @click="setActiveRoot(index)">
            <img class="solo-list-head-icon" :src="imgSrc" alt="">
            <img class="direction" :class="{'direction-down': activeRoot === index }" src="~img/down.svg" alt="">

            <div class="solo-list-head-symbol">
                <p class="solo-list-head-symbol-name">{{data.tokenSymbol}}</p>
                <p class="solo-list-head-symbol-tip">{{$t('Solo.Symbol')}}</p>
            </div>

            <div class="solo-list-head-right">
                <div class="info">
                    <p class="info-name">{{$t('Solo.Symbol')}}</p>
                    <p class="info-tip info-tip-symbol">{{data.tokenSymbol}}</p>
                </div>

                <div class="info">
                    <div class="info-name">{{$t('Solo.Annualized')}}
                        <div class="info-name-wenhao" @mouseenter="showDoubt(index)" @mouseleave="showDoubt(-1)">
                            <div class="info-name-wenhao-top">
                                <img class="info-name-wenhao-img" src="~img/wenhao.svg" alt="" @click.stop="showDoubt(index)">
                                <img class="info-name-wenhao-down" src="~img/down.svg" alt="" v-if="doubtShowIndex === index">
                            </div>
                            <transition name="fadeIn">
                                <div class="info-name-wenhao-annualized" v-if="doubtShowIndex === index">
                                    <p>{{$t('Solo.TotalApy')}}(USDT): <span>{{isNaN(data.earnApr) ? 0 : $toFixed(Number(data.earnApr) + Number(data.earnApy) + Number(data.rewardApy),2)}}%</span></p>
                                    <p>{{$t('Solo.FarmApy')}}(USDT): <span>{{isNaN(data.earnApr) ? 0 : $toFixed(Number(data.earnApr) + Number(data.earnApy),2)}}%</span></p>
                                    <p>{{$t('Solo.FarmApr')}}(USDT): <span>{{data.earnApr}}%</span></p>
<!--                                    <p>{{$t('Solo.AddApr')}}(USDT): <span>{{data.earnApy}}%</span></p>-->
                                    <p>{{$t('Solo.XburgerApr')}}: <span>{{data.rewardApy}}%</span></p>
                                    <p class="info-name-wenhao-annualized-tip">{{$t('Solo.ApyTip')}}</p>
                                    <p>{{$t('Solo.ApyTips')}}</p>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <p class="info-tip">
                        <count-jump :val="isNaN(data.earnApr) ? 0 : $toFixed(Number(data.earnApr) + Number(data.earnApy) + Number(data.rewardApy), 2)" />
                        %</p>
                </div>
                <div class="info">
                    <p class="info-name">{{$t('Solo.Use')}}({{data.tokenSymbol}})</p>
                    <p class="info-tip">
                        <count-jump :val="isNaN(data.depositCap - data.accShare) ? '--' : (data.depositCap - data.accShare) == 0 ? 0 : $toFixed(data.depositCap - data.accShare, 2)" :is-format=true />
                    </p>
                </div>
                <div class="info">
                    <p class="info-name">{{$t('Solo.Lock')}}({{data.tokenSymbol}})</p>
                    <p class="info-tip"><count-jump :val="$toFixed(data.totalStake,2)" :is-format=true /></p>
                </div>
<!--                <div class="info">-->
<!--                    <p class="info-name"><span>{{$t('Solo.Use')}}（</span>{{isNaN(data.accShare / data.depositCap) ? 100 : $toFixed((1 - (data.accShare / data.depositCap)) * 100, 2)}}%<span>）</span></p>-->
<!--                    <div class="info-tip info-progress">-->
<!--                        <el-progress class="progress" color="#F0B80B" :percentage="isNaN(data.accShare / data.depositCap) ? 0 : (data.accShare / data.depositCap).toFixed(4) * 100"-->
<!--                                     :format="format" />-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </header>
        <april-transition :show="activeRoot === index">
            <section>
                <div class="sell">
                    <div class="sell-head">
                        <span class="sell-head-name">{{$t('Solo.ExtractableUse')}}</span>
                        <span class="sell-head-count">
                            <count-jump :val="$toFixed(data.userBalance,6)" />
                        </span>
                    </div>
                    <div class="sell-section">
                        <div class="sell-section-input">
                            <el-input class="sell-section-input-elinput" v-model="depositNumber"
                                      :placeholder="$t('Solo.Placeholder')" @input.native="$filterNumber" @blur="changeVal('deposit')" />
                            <span @click="setMaxAmount('deposit')">MAX</span>
                        </div>
                        <div class="sell-section-slide">
                            <el-slider v-model="depositSlide" :marks="marks" @input="changeElSlider($event, 'deposit')" @change="changeSlider($event, 'deposit')" :show-tooltip='showTooltip' />
                        </div>
                    </div>
                    <el-button class="btn" v-if="data.tokenSymbol === 'BNB' || Number(data.userAllowance) > 0 || approveFlag" :loading="depositLoad" :disabled="!depositNumber || Number(depositNumber) == 0" @click="deposit()">{{$t('Solo.Deposit')}}</el-button>
                    <el-button class="btn" v-else :loading="approveLoad" @click="approve(data.address, data.tokenSymbol)">{{$t('Solo.Approve')}}</el-button>
                </div>

                <div class="sell">
                    <div class="sell-head">
                        <span class="sell-head-name">{{$t('Solo.Balance')}}:</span>
                        <span class="sell-head-count">
                            <count-jump :val="$toFixed(data.userAmount,6)" />
                        </span>
                    </div>
                    <div class="sell-section">
                        <div class="sell-section-input">
                            <el-input class="sell-section-input-elinput" v-model="withdrawNumber"
                                      :placeholder="$t('Solo.Placeholder')" @input.native="$filterNumber" @blur="changeVal('withdraw')" />
                            <span @click="setMaxAmount('withdraw')">MAX</span>
                        </div>
                        <div class="sell-section-slide">
                            <el-slider v-model="withdrawSlide" :marks="marks" @input="changeElSlider($event, 'withdraw')" @change="changeSlider($event, 'withdraw')" :show-tooltip='showTooltip' />
                        </div>
                    </div>
                    <el-button class="btn" :loading="withdrawLoad" :disabled="!withdrawNumber || Number(withdrawNumber) == 0" @click="withdraw()">{{$t('Solo.Withdrawal')}}</el-button>
                </div>

                <div class="sell">
                    <div class="sell-head">
                        <span class="sell-head-name">{{$t('Solo.Income')}}</span>
                    </div>
                    <div class="sell-income">
                        <p :name="data.userEarn">{{$t('Solo.Receive')}}({{data.earnSymbol}})  <span>
                            {{$toFixed(data.userEarn, 6) == 0 && data.userEarn > 0 ? '>' : ''}}
                            <count-jump :val="$toFixed(data.userEarn, 6)" />
                        </span></p>
                        <p>{{$t('Solo.Receive')}}({{data.rewardSymbol}})  <span>
                            {{$toFixed(data.userReward, 6) == 0 && data.userReward > 0 ? '>' : ''}}
                            <count-jump :val="$toFixed(data.userReward, 6)" />
                        </span></p>
                    </div>
                    <el-button class="btn" :loading="claimLoad" :disabled="Number(data.userReward) == 0 && Number(data.userEarn) == 0" @click="harvest">{{$t('Solo.Extraction')}}</el-button>
                </div>
            </section>
        </april-transition>
    </div>
</template>

<script>
    import ChainApi from '../../../../static/sdk/ChainApi';
    import BigNumber from "bignumber.js";

    export default {
        name: "ShackList",
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            doubtShowIndex: {
                type: Number,
                default: -1
            },
            activeRoot: {
                default: ''
            },
            index: {
                default: ''
            },
        },
        watch: {
            withdrawNumber(){
                this.withdrawSlide = ((this.withdrawNumber || 0) / this.data.userAmount) * 100
            },
            depositNumber(){
                this.depositSlide = ((this.depositNumber || 0) / this.data.userBalance) * 100
            }
        },
        computed: {
            imgSrc: {
                get: function(){
                    let src = ''
                    try{
                        src = require(`../../../assets/images/solo/${this.data.tokenSymbol}.svg`)
                    }catch (e) {
                        src = require(`../../../assets/images/solo/defalut.svg`)
                    }
                    return src
                },
                set: function () {

                }
            }
        },
        data() {
            return {
                depositNumber: 0,
                withdrawNumber: 0,
                withdrawSlide: 0,
                depositSlide: 0,

                approveLoad: false,
                approveFlag: false,
                depositLoad: false,
                withdrawLoad: false,
                claimLoad: false,
                showTooltip: false,

                marks: {
                    0: "",
                    25: "",
                    50: "",
                    75: "",
                    100: "",
                },
            }
        },
        methods: {
            changeSlider(val, type){
                if(type === 'deposit') this.depositNumber = new BigNumber(this.data.userBalance).multipliedBy(val) / 100
                else this.withdrawNumber = new BigNumber(this.data.userAmount).multipliedBy(val) / 100
            },
            changeElSlider(val, type) {
                let dom;
                if(type === 'deposit') dom = this.$el.querySelectorAll('.el-slider')[0]
                else dom = this.$el.querySelectorAll('.el-slider')[1]
                if (val > 0) dom.className = 'el-slider active-jd-d1'
                if (val > 25) dom.className = 'el-slider active-jd-d1 active-jd-d2'
                if (val > 50) dom.className = 'el-slider active-jd-d1 active-jd-d2 active-jd-d3'
                if (val > 75) dom.className = 'el-slider active-jd-d1 active-jd-d2 active-jd-d3 active-jd-d4'

                if (val < 75) dom.className = 'el-slider active-jd-d1 active-jd-d2 active-jd-d3'
                if (val < 50) dom.className = 'el-slider active-jd-d1 active-jd-d2'
                if (val < 25) dom.className = 'el-slider active-jd-d1'
                if (val == 0) dom.className = 'el-slider'
            },

            format(percentage) {
                return '';
            },
            setActiveRoot(index) {
                this.depositNumber = '';
                this.withdrawNumber = '';
                if (this.activeRoot === index) this.$emit('update:activeRoot', '');
                else this.$emit('update:activeRoot', index)
            },
            setMaxAmount(type) {
                if (type === 'deposit') {
                    this.depositNumber = this.data.userBalance
                } else this.withdrawNumber = this.data.userAmount
            },
            showDoubt(index){
                this.$emit('update:doubtShowIndex', this.doubtShowIndex === index ? -1 : index)
            },

            approve(token,symbol){
                this.approveLoad = true;
                let platform = ChainApi.getContractAddr('DemaxShackChef')
                ChainApi.approve(token, platform).then(res => {
                    if(res.status){
                        this.$notify({
                            title: 'Approve',
                            message: 'Approve Success',
                            type: 'success'
                        });
                        this.$store.dispatch('recordCallback', {
                            key: 'Approve',
                            action: 'Shack',
                            params: {describe: `Approve ${symbol}`},
                            code: 1,
                            result: res.transactionHash,
                        });
                        this.approveFlag = true
                    } else {
                        this.$notify({
                            title: 'Approve',
                            message: 'Approve Error',
                            type: 'error'
                        });
                    }
                }).finally(() => {
                    this.approveLoad = false;
                });
            },

            changeVal(type){
                if(type === 'deposit') this.depositNumber = this.$comparedTo(this.depositNumber,this.data.userBalance) === 1 ? this.data.userBalance : this.depositNumber;
                else this.withdrawNumber = this.$comparedTo(this.withdrawNumber,this.data.userAmount) === 1 ? this.data.userAmount : this.withdrawNumber;
            },

            deposit(){
                this.depositLoad = true;
                let amount = new BigNumber(this.depositNumber).toFixed()
                ChainApi.shackDeposit(this.data.pid, amount).then(res => {
                    this.$store.dispatch('recordCallback', {
                        key: 'Shack',
                        action: 'Shack',
                        params: {describe: `Deposit ${amount} ${this.data.tokenSymbol}`},
                        code: 0,
                        result: res,
                    });
                    return ChainApi.awaitTransactionMined(res);
                }).then(require => {
                    if (require.status) {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Deposit ${amount} ${this.data.tokenSymbol}`},
                            code: 1,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Deposit',
                            message: 'Deposit Success',
                            type: 'success'
                        });
                        this.depositNumber = '';
                        ChainApi.shackUpdatePool(this.data.pid, true)
                    } else {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Deposit ${amount} ${this.data.tokenSymbol}`},
                            code: 2,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Deposit',
                            message: 'Deposit Error',
                            type: 'error'
                        });
                    }
                }).finally(() => {
                    this.depositLoad = false;
                });
            },

            withdraw(){
                this.withdrawLoad = true;
                let amount = new BigNumber(this.withdrawNumber).toFixed()
                ChainApi.shackWithdraw(this.data.pid, amount).then(res => {
                    this.$store.dispatch('recordCallback', {
                        key: 'Shack',
                        action: 'Shack',
                        params: {describe: `Withdraw ${amount} ${this.data.tokenSymbol}`},
                        code: 0,
                        result: res,
                    });
                    return ChainApi.awaitTransactionMined(res);
                }).then(require => {
                    if (require.status) {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Withdraw ${amount} ${this.data.tokenSymbol}`},
                            code: 1,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Withdraw',
                            message: 'Withdraw Success',
                            type: 'success'
                        });
                        this.withdrawNumber = ''
                        ChainApi.shackUpdatePool(this.data.pid, true)
                    } else {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Withdraw ${amount} ${this.data.tokenSymbol}`},
                            code: 2,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Withdraw',
                            message: 'Withdraw Error',
                            type: 'error'
                        });
                    }
                }).finally(() => {
                    this.withdrawLoad = false;
                });
            },

            harvest(){
                this.claimLoad = true;
                ChainApi.shackHarvest(this.data.pid).then(res => {
                    this.$store.dispatch('recordCallback', {
                        key: 'Shack',
                        action: 'Shack',
                        params: {describe: `Harvest ${this.data.earnSymbol} and ${this.data.rewardSymbol}`},
                        code: 0,
                        result: res,
                    });
                    return ChainApi.awaitTransactionMined(res);
                }).then(require => {
                    if (require.status) {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Harvest ${this.data.earnSymbol} and ${this.data.rewardSymbol}`},
                            code: 1,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Harvest',
                            message: 'Harvest Success',
                            type: 'success'
                        });
                        ChainApi.shackUpdatePool(this.data.pid, true)
                    } else {
                        this.$store.dispatch('recordCallback', {
                            key: 'Shack',
                            action: 'Shack',
                            params: {describe: `Harvest ${this.data.earnSymbol} and ${this.data.rewardSymbol}`},
                            code: 2,
                            result: require.transactionHash,
                        });
                        this.$notify({
                            title: 'Harvest',
                            message: 'Harvest Error',
                            type: 'error'
                        });
                    }
                }).finally(() => {
                    this.claimLoad = false;
                });
            }
        },

    }
</script>

<style>
    .el-progress-bar__outer {
        background: #1F2226;
    }

    .sell-section .el-input__inner {
        height: 50px;
        background: #2C3035;
        border-color: rgba(255, 255, 255, 0.5);
    }

    .el-slider__runway {
        height: 2px;
        background-color: #1F2226;
    }

    .el-slider__bar {
        /*background: #F0B80B;*/
        background: linear-gradient(90deg, #F0B80B 13.89%, #E9714B 91.67%);
        top: 1px;
        height: 2px;
    }

    .el-slider__stop {
        width: 10px;
        height: 10px;
        margin-top: -3px;
        background-color: #1F2226;
        position: absolute;
        top: -1px;
    }

    .el-slider__button {
        border: 2px solid #fff;
        background-color: #fff;
        margin-top: -2px;
        width: 10px;
        height: 10px;
    }

    .active-jd-d1 .el-slider__stop:first-child, .active-jd-d2 .el-slider__stop:nth-child(2), .active-jd-d3 .el-slider__stop:nth-child(3), .active-jd-d4 .el-slider__stop:nth-child(4) {
        background-color: #fff !important;
        margin-top: -2px;
    }

    @media (max-width: 768px) {
        .el-slider__stop {
            width: 10px;
            height: 10px;
            margin-top: -1px;
            background-color: #1F2226;
            position: absolute;
            top: -1px;
        }

        .active-jd-d1 .el-slider__stop:first-child, .active-jd-d2 .el-slider__stop:nth-child(2), .active-jd-d3 .el-slider__stop:nth-child(3), .active-jd-d4 .el-slider__stop:nth-child(4) {
            background-color: #fff;
            margin-top: -1px;
        }
    }

</style>
<style scoped lang="less">

    .solo-list {
        &-head {
                padding: 36px 0;
                display: flex;
                flex-flow: row;
                cursor: pointer;
                position: relative;

                &-symbol {
                    display: none;
                    color: #FFFFFF;
                    margin-left: 20px;
                    position: relative;
                    top: -6px;

                    &-name {
                        font-size: 16px;
                        line-height: 16px;
                        margin-bottom: 11px;
                    }

                    &-tip {
                        opacity: .6;
                        font-size: 12px;
                        line-height: 12px;
                    }
                }

                &-icon {
                    width: 63px;
                    height: 63px;
                }

                .direction {
                    position: absolute;
                    right: 0px;
                    top: 43%;
                    transition: all 0.5s;
                }

                .direction-down {
                    transform: rotate(90deg);
                }

                &-right {
                    display: flex;
                    width: calc(100% - 63px);
                    color: #FFFFFF;

                    .info {
                        color: #FFFFFF;
                        text-align: left;

                        &:nth-of-type(1) {
                            flex: 0.8;
                            padding-left: 49px;
                        }

                        &:nth-of-type(2) {
                            flex: 1.3;
                        }

                        &:nth-of-type(3) {
                            flex: 1.5;
                        }

                        &:last-child {
                            flex: 1.1;

                            .info-tip {
                                position: relative;

                                .progress {
                                    width: 100%;
                                    position: relative;
                                    top: 0px;
                                }

                                .totle {
                                    position: absolute;
                                    left: 60%;
                                    top: 0;
                                }
                            }
                        }

                        &-name {
                            font-size: 16px;
                            line-height: 16px;
                            height: 16px;

                            color: rgba(#fff, .6);
                            margin-bottom: 30px;
                            position: relative;
                            &-wenhao{
                                width: 20px;
                                display: inline-block;
                                margin-left: 6px;
                                position: relative;
                                vertical-align: sub;
                                &-top{
                                    position: relative;
                                }
                                &-img{
                                    position: relative;
                                    width: 20px;
                                    height: 20px;
                                }
                                &-down{
                                    position: absolute;
                                    bottom: -14px;
                                    left: 50%;
                                    transform: translateX(-50%) rotate(90deg);
                                    width: 8px;
                                }
                                &-annualized{
                                    position: absolute;
                                    left: 50%;
                                    top: 40px;
                                    transform: translateX(-50%);
                                    background: #fff;
                                    border-radius: 20px;
                                    width: 450px;
                                    z-index: 9999;
                                    padding: 24px 20px;

                                    p{
                                        font-size: 14px;
                                        line-height: 18px;
                                        margin-bottom: 14px;

                                        color: rgba(#2C3035, .6);
                                        &:last-child{
                                            margin-bottom: 0;
                                        }
                                        span{
                                            float: right;
                                            color: rgba(#F09C07, .6);
                                        }
                                        &:nth-of-type(5){
                                            margin-bottom: 16px;
                                        }
                                    }

                                    &-tip{
                                        padding-top: 12px;
                                        margin-bottom: 6px !important;
                                        border-top: 1px solid #bbbcc5;
                                    }
                                }
                            }

                        }

                        &-tip {
                            font-weight: 500;
                            font-size: 20px;
                            line-height: 16px;
                        }
                        &-tip-symbol{
                            margin-top: 23px;
                        }


                    }
                }
            }

        section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 24px 10px 41px;
            display: flex;
            justify-content: space-between;

            .sell {
                max-width: 430px;
                width: calc(33% - 20px);

                &-head {
                    color: #FFFFFF;
                    line-height: 16px;
                    margin-bottom: 16px;

                    span {
                        font-size: 14px;
                    }

                    &-name {
                        margin-right: 6px;
                        opacity: .6;
                    }

                    &-count {
                        font-weight: 500;
                        float: right;
                        opacity: 1 !important;
                    }
                }

                &-section {
                    overflow: hidden;

                    &-input {
                        display: flex;
                        height: 50px;
                        position: relative;

                        &-elinput {
                            width: 99%;

                            ::v-deep .el-input__inner {
                                height: 50px;
                                border-radius: 4px;
                                font-size: 16px;
                                color: #fff;
                                opacity: 1;
                            }

                            ::v-deep .el-input__inner::placeholder {
                                color: #fff;
                                opacity: .3;
                            }

                            ::v-deep .el-input__inner::-webkit-input-placeholder {
                                color: #fff;
                                opacity: .3;
                            }

                            ::v-deep .el-input__inner:-moz-placeholder {
                                color: #fff;
                                opacity: .3;
                            }

                            ::v-deep .el-input__inner:-ms-input-placeholder {
                                color: #fff;
                                opacity: .3;
                            }
                        }

                        span {
                            position: absolute;
                            right: 17px;
                            top: 17px;
                            font-weight: 500;
                            font-size: 16px;
                            line-height: 16px;
                            color: #F0B80B;
                            cursor: pointer;
                        }
                    }

                    &-slide {
                        width: 91%;
                        margin: 15px 4% 20px;
                    }
                }

                &-income{
                    margin-top: 7px;
                    margin-bottom: 70px;
                    p{
                        font-size: 14px;
                        line-height: 16px;
                        color: rgba(#fff, .6);
                        margin-bottom: 16px;
                        span{
                            float: right;
                            color: #fff;
                        }
                    }
                }

                .btn {
                    width: 100%;
                    height: 40px;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 12px;
                    color: #212833;
                    background: #F0B90B;
                    border-radius: 20px;
                    border: none;
                }
            }

            /deep/ .el-button{
                transition: background .2s;
            }
            /deep/ .el-button:hover{
                background: #F6D261;
            }
            /deep/ .is-disabled{
                background: #EEEEE9 !important;
                &:hover{background: #EEEEE9 !important}
            }
        }
    }

    @media (max-width: 768px) {
        .solo-list {
            &-head {
                padding: 24px 0 26px;
                display: block;
                flex-flow: inherit;

                &-icon {
                    width: 48px;
                    height: 48px;
                }

                &-symbol {
                    display: inline-block;
                }

                .direction {
                    right: 8px;
                    top: 30px;
                }

                &-right {
                    display: block;
                    width: 100%;
                    margin-top: 22px;

                    .info {
                        margin-bottom: 22px;

                        &:first-child {
                            display: none;
                        }

                        &:last-child {
                            margin-bottom: 0;

                            /*.info-name {*/
                            /*    float: right;*/
                            /*    opacity: 1;*/
                            /*    font-size: 16px;*/
                            /*    line-height: 16px;*/

                            /*    span {*/
                            /*        display: none;*/
                            /*    }*/
                            /*}*/

                        }

                        &-progress {
                            width: 70%;
                            top: 0px;
                            float: none !important;

                            ::v-deep .el-progress-bar__outer {
                                height: 10px !important;
                            }
                        }

                        &-name {
                            display: inline;
                            font-size: 14px;
                            line-height: 16px;
                            margin-bottom: 24px;
                            position: inherit;
                            &-wenhao{
                                width: 20px;
                                display: inline-block;
                                margin-left: 6px;
                                position: inherit;
                                vertical-align: sub;
                                &-img{
                                    top: -2px;
                                }
                                &-down{
                                    bottom: -10px;
                                    left: 50%;
                                    transform: translateX(-50%) rotate(90deg);
                                    width: 8px;
                                }
                                &-annualized{
                                    width: calc(100vw - 16px);
                                    left: -32px;
                                    transform: translateX(0);
                                    top: 135px;
                                    border-radius: 14px;
                                    padding: 20px 14px;

                                    p{
                                        font-size: 12px;
                                        line-height: 22px;
                                        margin-bottom: 8px;
                                        &:last-child{
                                            margin-bottom: 0;
                                        }
                                    }

                                    &-tip{
                                        margin-bottom: 8px !important;
                                    }
                                }
                            }
                        }

                        &-tip {
                            font-weight: 500;
                            font-size: 16px;
                            line-height: 16px;
                            float: right;
                            display: inline-block;
                        }
                    }
                }
            }

            section {
                padding: 34px 0px 34px;
                display: block;

                .sell {
                    max-width: 100%;
                    width: 100%;
                    margin-top: 34px;

                    &-head {
                        font-size: 14px;
                        line-height: 16px;
                        margin-bottom: 28px;
                    }

                    &-section {
                        &-input {
                            height: 46px;
                        }

                        &-slide {
                            margin: 25px 4% 20px;
                        }
                    }

                    &-income{
                        margin-top: 7px;
                        margin-bottom: 28px;
                        p{
                            font-size: 14px;
                            line-height: 14px;
                            color: rgba(#fff, .6);
                            margin-bottom: 20px;
                            span{
                                float: right;
                                color: #fff;
                            }
                        }
                    }

                    .btn {
                        height: 50px;
                        font-size: 20px;
                    }

                    &:first-child {
                        margin-top: 0;
                    }
                }
            }

        }

    }
</style>
