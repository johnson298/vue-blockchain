<template>
<div class="_farm-card">
    <div :class="['_farm-relative', {'animation-bg': data.name === 'xBURGER/BURGER'}]">
        <div class="_farm-card-title">
            <img :src="imgSrc" alt="">
            <div class="_title-rt">
                <span class="_txt">{{data.name}}</span>
                <span class="_tag">{{data.weight}}X</span>
            </div>
        </div>

        <div class="_farm-apr">
            <p>
                <span>{{$t('Ifo.apr')}}</span>
                <span><count-jump :val="data.apy" isFormat="true"/>%</span>
            </p>
        </div>

        <div class="_farm-harvest _min-hg">
            <div class="_lf-txt">
                <template v-if="data.isReward2">
                <p>{{$t('Ifo.earned', {token: 'Burger'})}}</p>
                <p class="_mg-bt">
                    <count-jump :val="$toFixed(data.userReward2, 6)" isFormat="true"/>
                </p>
                </template>
                <p>{{$t('Ifo.earned', {token: 'xBurger'})}}</p>
                <p>
                    <count-jump :val="$toFixed(data.userReward, 6)" isFormat="true"/>
                </p>
            </div>
            <div class="_rt-btn">
                <el-button class="_n-btn _disabled"
                    :loading="harvestLoad"
                    :disabled="isNaN(data.userReward) || (data.isReward2 && Number(data.userReward)<=0 && Number(data.userReward2)<=0) || (!data.isReward2 && Number(data.userReward)<=0)"
                    @click="harvestClick">{{$t('Ifo.harvest')}}
                </el-button>
            </div>
        </div>

        <div class="_farm-harvest _farm-bor">
            <div class="_lf-txt">
                <p>{{$t('Ifo.staked')}}</p>
                <p>
                    <count-jump :val="data.userAmount" isFormat="true"/>
                </p>
            </div>
            <div class="_rt-btn">
                <template v-if="!isNaN(data.userAmount) && Number(data.userAmount)>0">
                <span class="_btn-unstake" @click="stakeClick('unStake')">-</span>
                <span class="_btn-stake" v-if="endStatus !== 2" @click="stakeClick('stake')">+</span>
                </template>

                <template v-if="!isNaN(data.userAmount) && Number(data.userAmount)<=0">
                <el-button class="_n-btn"
                    :loading="approveLoad"
                    @click="approveStakeClick">
                    {{Number(data.userAllowance) > 0 || approveFlag ? $t('Ifo.stake') :
                    $t('Ifo.approve')}}
                </el-button>
                </template>
            </div>
        </div>

        <div class="_farm-details" @click="detailsClick">
            {{!isHide ? $t('Ifo.details') : $t('Ifo.hide')}}
            <a-icon type="icon-down" :class="['icon', {'icon-': isHide}]"/>
        </div>

        <april-transition :show="isHide">
            <div class="_farm-apr">
                <p>
                    <span>{{$t('Ifo.deposit')}}</span>
                    <span><a :href="href" target="_blank">{{data.name}} {{data.tokenType === 1 ? null : 'BLP'}}</a></span>
                </p>
                <p>
                    <span>{{$t('xBurger.tvl')}}</span>
                    <span>$<count-jump :val="data.totalStakeValue" isFormat="true"/></span>
                </p>
            </div>
        </april-transition>
    </div>


    <stake-modal
        :width="'480px'"
        :visible="visible"
        :title="title"
        :pool="data.pool"
        :name="name"
        :data="data"
        @cancel="cancel"
        @balance="getBalance">
    </stake-modal>
</div>
</template>

<script>
import AprilTransition from '../../components/transition';
import StakeModal from './stake-modal';
import ChainApi from '../../../static/sdk/ChainApi';
import Common from '../../assets/common';
import CountJump from '../../components/countJump/index';
import {mapState} from 'vuex';

export default {
    name: 'card',
    components: {CountJump, AprilTransition, StakeModal},
    props: ['data', 'walletAddress', 'endStatus'],
    mixins: [Common],
    data() {
        return {
            isHide: false,
            visible: false,
            title: '',
            stakeAmount: 0,
            isApprove: false,
            stakeLoad: false,
            name: '',
            harvestLoad: false,
            href: null,
            imgSrc: require('../../assets/images/xburger/xBURGER.svg'),
            approveFlag: false,
            approveLoad: false
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
            this.imgSrc = require(`../../assets/images/xburger/${this.data.tokenSymbol}.svg`);
            if (this.isConnect) {
                ChainApi.allowance(this.data.lpToken, this.data.pool).then(res => {
                    if (res) {
                        this.isApprove = res.toNumber() > 0;
                    }
                });
                this.href = ChainApi.getEtherscanAddress(this.data.address);
            }
        },
        detailsClick() {
            this.isHide = !this.isHide;
        },
        approveStakeClick() {
            if (Number(this.data.userAllowance) <= 0 && !this.approveFlag) {
                this.approve()
            } else {
                this.visible = true;
                this.name = 'stake';
                this.title = this.$t('Ifo.stake') + ' Tokens';
                this.getBalance();
            }
        },
        cancel() {
            this.visible = false;
        },
        approve() {
            this.approveLoad = true;
            let platform = ChainApi.getContractAddr('DemaxShackFarm');
            ChainApi.approve(this.data.address, platform).then(res => {
                if (res.status) {
                    this.$notify({
                        title: 'Approve',
                        message: 'Approve Success',
                        type: 'success'
                    });
                    this.$store.dispatch('recordCallback', {
                        key: 'Approve',
                        action: 'xBurger Pool',
                        params: {describe: `Approve ${this.data.tokenSymbol}`},
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
        stakeClick(name) {
            this.visible = true;
            this.name = name;
            this.title = (name === 'stake' ? this.$t('Ifo.stake') : this.$t('Ifo.unStake')) + ' Tokens';
            this.getBalance();
        },
        getBalance() {
            this.comBalance(this.data.lpToken, this.walletAddress);
        },
        harvestClick() {
            this.harvestLoad = true;
            ChainApi.shackFarmHarvest(this.data.pid).then(res => {
                this.$store.dispatch('recordCallback', {
                    key: 'xBurger Pool',
                    action: 'xBurger Pool',
                    params: {describe: this.type === 'double' ? 'Harvest Burger and xBURGER' : 'Harvest xBURGER'},
                    code: 0,
                    result: res,
                });
                return ChainApi.awaitTransactionMined(res);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: this.type === 'double' ? 'Harvest Burger and xBURGER' : 'Harvest xBURGER'},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Success',
                        type: 'success'
                    });
                    ChainApi.shackFarmUpdatePool(this.data.pid, true)
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: this.type === 'double' ? 'Harvest Burger and xBURGER' : 'Harvest xBURGER'},
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
                this.harvestLoad = false;
            });
        },
    }
}
</script>

<style lang="less" scoped>
    @keyframes bgPosition {
        0% {
            background-position: 0 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }

    ._farm-relative {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 20px 20px 24px;
        z-index: 0;
    }

    .animation-bg {
        &:before {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            content: '';
            background-color: #2C3035;
            border-radius: 20px;
        }

        &::after {
            filter: blur(6px);
            position: absolute;
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            content: '';
            top: -2px;
            right: -2px;
            bottom: -2px;
            left: -2px;
            z-index: -2;
            background: linear-gradient(45deg, rgb(255, 0, 0) 0%, rgb(255, 154, 0) 10%, rgb(208, 222, 33) 20%, rgb(79, 220, 74) 30%, rgb(63, 218, 216) 40%, rgb(47, 201, 226) 50%, rgb(28, 127, 238) 60%, rgb(95, 21, 242) 70%, rgb(186, 12, 248) 80%, rgb(251, 7, 217) 90%, rgb(255, 0, 0) 100%) 0% 0% / 300% 300%;
            background-image: linear-gradient(45deg, rgb(255, 0, 0) 0%, rgb(255, 154, 0) 10%, rgb(208, 222, 33) 20%, rgb(79, 220, 74) 30%, rgb(63, 218, 216) 40%, rgb(47, 201, 226) 50%, rgb(28, 127, 238) 60%, rgb(95, 21, 242) 70%, rgb(186, 12, 248) 80%, rgb(251, 7, 217) 90%, rgb(255, 0, 0) 100%);
            background-position-x: initial;
            background-position-y: initial;
            background-size: 300% 300%;
            background-repeat-x: initial;
            background-repeat-y: initial;
            background-attachment: initial;
            background-origin: initial;
            background-clip: initial;
            background-color: initial;
            animation: 2s linear 0s infinite normal none running bgPosition;
            border-radius: 20px;
        }
    }

    ._farm-card {
        background-color: #2C3035;
        border-radius: 20px;
        width: 340px;
        height: auto;


        ._min-hg {
            min-height: 100px;
        }

        .transition-dom {
            overflow-y: hidden;
            transition: height .2s linear;
        }

        ._farm-card-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(#ffffff, .1);
            margin-bottom: 20px;

            img {
                width: 64px;
                height: 64px;
            }

            ._title-rt {
                text-align: right;
            }

            ._txt {
                display: block;
                font-size: 18px;
                font-weight: bold;
                color: #ffffff;
                margin-bottom: 10px;
            }

            ._tag {
                display: inline-flex;
                align-items: center;
                height: 20px;
                padding: 0 15px;
                font-size: 12px;
                font-weight: 500;
                color: #212833;
                background-color: #F0B80B;
                border-radius: 40px;
            }
        }

        ._farm-apr {
            font-size: 14px;
            padding-bottom: 20px;
            margin-bottom: 20px;
            /*border-bottom: 1px solid rgba(#ffffff, .1);*/

            &:nth-last-child(1) {
                padding-bottom: 0;
                margin-bottom: 0;
                border-bottom: 0;
                margin-top: 24px;
            }

            p {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #ffffff;
                margin-bottom: 16px;

                &:nth-last-child(1) {
                    margin-bottom: 0;
                }

                span:nth-of-type(1) {
                    color: rgba(#ffffff, .6);
                }

                a {
                    color: #F0B80B;
                }
            }
        }

        ._farm-harvest {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;

            &._farm-bor {
                margin-bottom: 0;
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(#ffffff, .1);
            }

            ._lf-txt {
                p {
                    color: #ffffff;
                    margin-bottom: 12px;
                    font-size: 14px;

                    &:nth-last-child(1) {
                        margin-bottom: 0;
                    }

                    &:nth-of-type(odd) {
                        color: rgba(#ffffff, .6);
                        font-weight: 300;
                    }

                    &:nth-of-type(even) {
                        font-weight: 500;
                    }

                    &._mg-bt {
                        margin-bottom: 20px;
                    }
                }
            }

            ._rt-btn {
                button {
                    border-radius: 36px;
                    color: #212833;
                    min-width: 120px;
                }

                ._btn-stake, ._btn-unstake {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: linear-gradient(360deg, #F0B90B 0%, #F8D12F 100%);
                    color: #212833;
                    font-size: 24px;
                    cursor: pointer;

                    &:hover {
                        background: #F6D261;
                    }
                }

                ._btn-stake {
                    margin-left: 12px;
                }
            }
        }

        ._farm-details {
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #F8D02D;
            margin-top: 24px;

            .icon {
                margin-left: 10px;
                margin-top: 2px;
                transition: all .3s;
            }

            .icon- {
                transform: rotate(180deg);
            }
        }
    }
</style>
