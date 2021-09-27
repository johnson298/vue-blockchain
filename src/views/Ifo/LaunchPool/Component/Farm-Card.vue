<template>
<div class="_farm-card">
    <div class="_farm-card-title">
        <img :src="imgSrc" alt="">
        <div class="_title-rt">
            <span class="_txt">{{data.lpToken0Symbol}}-{{data.lpToken1Symbol}}</span>
            <span class="_tag">{{data.rate}}X</span>
        </div>
    </div>

    <div class="_farm-apr">
        <p>
            <span>{{$t('Ifo.apr')}}</span>
            <span>{{data.apr}}</span>
        </p>
    </div>

    <div class="_farm-harvest">
        <div class="_lf-txt">
            <p>{{$t('Ifo.earned', {token: data.mintTokenSymbol})}}</p>
            <p class="_mg-bt">
                {{Number(data.userReward) > 0 ? $shiftedBy(data.userReward,
                -data.mintTokenDecimals).toFixed(6) : 0}}
            </p>
            <p>{{$t('Ifo.earned', {token: 'Burger'})}}</p>
            <p>{{Number(data.userBurger)>0 ? $shiftedBy(data.userBurger, -18).toFixed(6) : 0}}</p>
        </div>
        <div class="_rt-btn">
            <el-button class="_n-btn _disabled"
                :loading="harvestLoad"
                :disabled="Number(data.userReward)<=0 && Number(data.userBurger)<=0"
                @click="harvestClick">{{$t('Ifo.harvest')}}
            </el-button>
        </div>
    </div>

    <div class="_farm-harvest _farm-bor">
        <div class="_lf-txt">
            <p>{{$t('Ifo.staked')}}</p>
            <p>{{$shiftedBy(data.userBalance, -18).toFixed() || '--'}}</p>
        </div>
        <div class="_rt-btn">
            <template v-if="Number(data.userBalance)>0">
            <span class="_btn-unstake" @click="stakeClick('unStake')">-</span>
            <span class="_btn-stake" v-if="endStatus !== 2" @click="stakeClick('stake')">+</span>
            </template>
            <template v-if="Number(data.userBalance)<=0 && endStatus !== 2">
            <el-button class="_n-btn"
                :loading="commonLoad || stakeLoad"
                @click="approveStakeClick">
                {{isApprove ? $t('Ifo.stake') : $t('Ifo.approve')}}
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
                <span><a :href="href" target="_blank">{{data.lpToken0Symbol}}-{{data.lpToken1Symbol}} BLP</a></span>
            </p>
            <p>
                <span>{{$t('Ifo.totalLiquidity')}}</span>
                <span>${{data.totalStakeValue || '--'}}</span>
            </p>
        </div>
    </april-transition>

    <stake-modal
        :width="'480px'"
        :visible="visible"
        :title="title"
        :balance="commonBalance"
        :pool="data.pool"
        :name="name"
        :lpToken0="data.lpToken0Symbol"
        :lpToken1="data.lpToken1Symbol"
        :unBalance="data.userBalance"
        @cancel="cancel"
        @balance="getBalance">
    </stake-modal>
</div>
</template>

<script>
import AprilTransition from '../../../../components/transition';
import StakeModal from './Stake-Modal';
import ChainApi from '../../../../../static/sdk/ChainApi';
import Common from '../../../../assets/common';

export default {
    name: 'farm-card',
    components: {AprilTransition, StakeModal},
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
            imgSrc: require('../../../../assets/images/ifo/BTC-BURGER.svg'),
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            ChainApi.allowance(this.data.lpToken, this.data.pool).then(res => {
                if (res) {
                    this.isApprove = res.toNumber() > 0;
                }
            });
            this.href = ChainApi.getEtherscanAddress(this.data.lpToken);
            this.imgSrc = require(`../../../../assets/images/ifo/${this.data.lpToken0Symbol}-${this.data.lpToken1Symbol}.svg`);
        },
        detailsClick() {
            this.isHide = !this.isHide;
        },
        approveStakeClick() {
            if (!this.isApprove) {
                this.approve()
            } else {
                this.visible = true;
                this.name = 'stake';
                this.title = this.$t('Ifo.modalTitle', {name: this.$t('Ifo.stake')});
                this.getBalance();
            }
        },
        cancel() {
            this.visible = false;
        },
        approve() {
            this.comApprove(this.data.lpToken, this.data.pool).then(resolve => {
                if (resolve === 'success') {
                    this.isApprove = true
                }
            });
        },
        stakeClick(name) {
            this.visible = true;
            this.name = name;
            this.title = this.$t('Ifo.modalTitle', {name: name === 'stake' ? this.$t('Ifo.stake') : this.$t('Ifo.unStake')});
            this.getBalance();
        },
        getBalance() {
            this.comBalance(this.data.lpToken, this.walletAddress);
        },
        harvestClick() {
            this.harvestLoad = true;
            ChainApi.projectMintAll(this.data.pool).then(tx => {
                console.log(tx)
                this.$store.dispatch('recordCallback', {
                    key: 'Harvest',
                    action: 'Ifo Farm',
                    params: {describe: `Harvest ${this.data.mintTokenSymbol} and Burger`},
                    code: 0,
                    result: tx,
                });
                return ChainApi.awaitTransactionMined(tx)
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Harvest',
                        action: 'Ifo Farm',
                        params: {describe: `Harvest ${this.data.mintTokenSymbol} and Burger`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Success',
                        type: 'success'
                    });
                    ChainApi.projectPoolSync(this.data.pool)
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Harvest',
                        action: 'Ifo Farm',
                        params: {describe: `Harvest ${this.data.mintTokenSymbol} and Burger`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Error',
                        type: 'error'
                    });
                }
                this.harvestLoad = false;
            }).catch(e => {
                this.harvestLoad = false;
            }).finally(() => {
                this.harvestLoad = false
            })
        },
    }
}
</script>

<style lang="less" scoped>
    ._farm-card {
        background-color: #2C3035;
        border-radius: 20px;
        width: 340px;
        height: auto;
        padding: 20px 20px 24px;

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
