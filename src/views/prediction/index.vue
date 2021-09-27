<template>
    <div class="_pre-con">
        <template v-if="!visible">
            <div class="_top top-test">
                <Pools :name="poolInfo.name" :currentPrice="currentPrice" @symbol="symbolClick"/>
                <prev-next @prev="prev" @next="next" @center="center"/>
                <Time :item="later1Time"/>
            </div>
            <a-loading :loading="isLoad">
                <swiper ref="mySwiper" :options="swiperOptions">
                    <swiper-slide class="_pre-bg _end-bg"
                        v-for="item of endList"
                        :key="item.epoch">
                        <img src="../../assets/images/prediction/end-top-bg.svg" alt=""
                            class="_pre-img">

                        <div class="_prediction-card end-card">
                            <div class="_con">

                                <div class="_title">
                                    <a-icon type="icon-expried"/>
                                    <span>{{$t('prediction.statusTag1')}}</span>
                                    <span>#{{item.epoch}}</span>
                                    <img src="../../assets/images/prediction/img5.svg" alt=""
                                        class="_end-success-tag"
                                        v-if="(!item.isShow && Number(item.amount) > 0 && Number(item.position) === 0 && (item.closePrice - item.lockPrice) > 0)
                                        || (!item.isShow && Number(item.amount) > 0 && Number(item.position) === 1 && (item.closePrice - item.lockPrice) < 0)
                                        || (!item.isShow) && Number(item.amount)>0 && !item.oracleCalled">
                                </div>

                                <div class="_price">
                                    <div class="_price-center _real-time"
                                        :class="[{'_up-border-color': (item.closePrice - item.lockPrice) > 0},
                                             {'_down-border-color': (item.closePrice - item.lockPrice) < 0}]">
                                        <p>{{$t('prediction.closedPrice')}}</p>
                                        <p>
                                        <span :class="[
                                                {'up-color': (item.closePrice - item.lockPrice) > 0},
                                                {'down-color': (item.closePrice - item.lockPrice) < 0}]">
                                            $<count-jump
                                            :val="$shiftedBy(item.closePrice, -item.oracleDecimals).toFixed(2)"
                                            is-format="true"/>
                                        </span>

                                            <span
                                                :class="[
                                                {'_r-up-bg': (item.closePrice - item.lockPrice) > 0},
                                                {'_r-down-bg': (item.closePrice - item.lockPrice) < 0}]">
                                            <a-icon type="icon-arrow-down1"/>
                                            $<count-jump
                                                :val="$shiftedBy((item.closePrice - item.lockPrice), -item.oracleDecimals)"
                                                is-format="true"/>
                                        </span>
                                        </p>

                                        <p>
                                            <span>{{$t('prediction.lockedPrice')}}:</span>
                                            <span>$
                                        <count-jump
                                            :val="$shiftedBy(item.lockPrice, -item.oracleDecimals)"
                                            is-format="true"/></span>
                                        </p>

                                        <p>
                                            <span>{{$t('prediction.pricePool')}}:</span>
                                            <span><count-jump
                                                :val="$toFixed($shiftedBy(item.totalAmount, -item.tokenDecimals), 2)"/> {{item.tokenSymbol}}</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="_price-change _real-time-change">
                                    <template v-if="!item.isShow">
                                        <el-tooltip class="item" effect="light"
                                            :content="$shiftedBy(item.amount, -item.tokenDecimals) + ' ' + item.tokenSymbol"
                                            placement="top"
                                            :disabled="!(Number(item.amount)>0 && Number(item.position) === 0)">
                                            <div class="_btn-change _up"
                                                :class="[{'_r-up-bg': (item.closePrice - item.lockPrice) > 0}]">
                                                <img src="../../assets/images/prediction/img4.svg"
                                                    alt=""
                                                    class="_chang-up-img"
                                                    v-if="Number(item.amount)>0 && Number(item.position) === 0">
                                                <span class="txt">UP</span>
                                                <span class="num">
                                                    {{(item.totalAmount == 0 || item.bullAmount == 0) ? 0 : (item.totalAmount / item.bullAmount).toFixed(2)}}x {{$t('prediction.payout')}}</span>
                                            </div>
                                        </el-tooltip>
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            :content="$shiftedBy(item.amount, -item.tokenDecimals) + ' ' + item.tokenSymbol"
                                            placement="top"
                                            :disabled="!(Number(item.amount)>0 && Number(item.position) === 1)">
                                            <div class="_btn-change _down"
                                                :class="[{'_r-down-bg': (item.closePrice - item.lockPrice) < 0}]">
                                                <span class="num">
                                                    <img
                                                        src="../../assets/images/prediction/img4.svg"
                                                        alt=""
                                                        class="_chang-down-img"
                                                        v-if="Number(item.amount)>0 && Number(item.position) === 1">
                                                    {{(item.totalAmount == 0 || item.bearAmount == 0) ? 0 : (item.totalAmount / item.bearAmount).toFixed(2)}}x {{$t('prediction.payout')}}
                                                </span>
                                                <span class="txt">DOWN</span>
                                            </div>
                                        </el-tooltip>
                                    </template>

                                    <div class="_end-collect"
                                        v-if="item.isShow">
                                        <img src="../../assets/images/prediction/img6.svg" alt="">
                                        <el-button @click="collectClick(item)"
                                            :loading="collectLoad">{{$t('prediction.footerGold')}}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img src="../../assets/images/prediction/end-bt-bg.svg" alt=""
                            class="_pre-img">
                    </swiper-slide>

                    <swiper-slide class="_pre-bg" v-if="poolIndex>1">
                        <img src="../../assets/images/prediction/r-bg-top.svg" alt=""
                            class="_pre-img">

                        <div class="_prediction-card real-card">
                            <div class="_con" v-if="!isOpen">
                                <el-progress
                                    class="_pre-progress"
                                    :percentage="percentage"
                                    :color="customColor"
                                    :stroke-width="10"
                                    :show-text="false">
                                </el-progress>

                                <div class="_title">
                                    <a-icon type="icon-real-time"/>
                                    <span>{{$t('prediction.statusTag2')}}</span>
                                    <span>#{{realList.epoch}}</span>
                                </div>

                                <div class="_price">
                                    <div class="_price-center _real-time"
                                        :class="[{'_up-border-color':  (currentPrice -  $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) > 0},
                                                 {'_down-border-color':  (currentPrice -  $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) < 0}]">
                                        <p>{{$t('prediction.lastPrice')}}</p>
                                        <p>
                                        <span :class="[{'_up-color': (currentPrice -  $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) > 0},
                                        {'_down-color': (currentPrice - $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) < 0}]">
                                            $<count-jump
                                            :val="$toFixed(currentPrice, 2)"
                                            :is-format="true"/>
                                        </span>

                                            <span
                                                :class="[
                                                {'_r-up-bg': (currentPrice -  $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) > 0},
                                                {'_r-down-bg': (currentPrice - $shiftedBy(realList.lockPrice, -realList.oracleDecimals)) < 0}]">
                                            <a-icon type="icon-arrow-down1"/>
                                            $<count-jump
                                                :val="$toFixed((currentPrice - $shiftedBy(realList.lockPrice, -realList.oracleDecimals)), 2)"
                                                :is-format="true"/>
                                        </span>
                                        </p>

                                        <p>
                                            <span>{{$t('prediction.lockedPrice')}}:</span>
                                            <span>$<count-jump
                                                :val="$shiftedBy(realList.lockPrice, -realList.oracleDecimals)"
                                                :is-format="true"/></span>
                                        </p>

                                        <p>
                                            <span>{{$t('prediction.pricePool')}}:</span>
                                            <span><count-jump
                                                :val="$shiftedBy(realList.totalAmount, -realList.tokenDecimals)"
                                                :is-format="true"/> {{realList.tokenSymbol}}</span>
                                        </p>
                                    </div>
                                </div>

                                <div
                                    class="_price-change _real-time-change">
                                    <el-tooltip class="item" effect="light"
                                        :content="$shiftedBy(realList.amount, -realList.tokenDecimals) + ' ' + realList.tokenSymbol"
                                        placement="top"
                                        :disabled="!(Number(realList.amount)>0 && Number(realList.position) === 0)">
                                        <div class="_btn-change _up"
                                            :class="[{'_r-up-bg': currentPrice - $shiftedBy(realList.lockPrice, -realList.oracleDecimals) > 0}]">
                                            <img src="../../assets/images/prediction/img4.svg"
                                                alt=""
                                                class="_chang-up-img"
                                                v-if="Number(realList.amount)>0 && Number(realList.position) === 0">
                                            <span class="txt">UP</span>
                                            <span class="num">{{(realList.totalAmount == 0 || realList.bullAmount == 0) ? 0 : (realList.totalAmount / realList.bullAmount).toFixed(2)}}x {{$t('prediction.payout')}}</span>
                                        </div>
                                    </el-tooltip>

                                    <el-tooltip
                                        class="item"
                                        effect="light"
                                        :content="$shiftedBy(realList.amount, -realList.tokenDecimals) + ' ' + realList.tokenSymbol"
                                        placement="top"
                                        :disabled="!(Number(realList.amount)>0 && Number(realList.position) === 1)">
                                        <div class="_btn-change _down"
                                            :class="[{'_r-down-bg': currentPrice - $shiftedBy(realList.lockPrice, -realList.oracleDecimals) < 0}]">
                                            <img src="../../assets/images/prediction/img4.svg"
                                                alt=""
                                                class="_chang-down-img"
                                                v-if="Number(realList.amount)>0 && Number(realList.position) === 1">
                                            <span class="num">{{(realList.totalAmount == 0 || realList.bearAmount == 0) ? 0 : (realList.totalAmount / realList.bearAmount).toFixed(2)}}x {{$t('prediction.payout')}}</span>
                                            <span class="txt">DOWN</span>
                                        </div>
                                    </el-tooltip>


                                </div>
                            </div>

                            <div class="real-open" v-if="isOpen">
                                <img src="../../../public/loading.gif"/>
                                <p>{{$t('prediction.openTxt')}}</p>
                            </div>
                        </div>

                        <img src="../../assets/images/prediction/r-bg-bt.svg" alt=""
                            class="_pre-img">
                    </swiper-slide>

                    <swiper-slide class="_pre-bg">
                        <img src="../../assets/images/prediction/end-top-bg.svg" alt=""
                            class="_pre-img">

                        <div
                            :class="['_prediction-card', 'next-card', {'card-rotate-180': isRotate}, {'_backface': browserVer}]">
                            <div class="_con _front-bg" :class="{'_backface': !browserVer}">
                                <div class="_title">
                                    <a-icon type="icon-real-time"/>
                                    <span>{{$t('prediction.statusTag3')}}</span>
                                    <span>#{{nextList.epoch}}</span>
                                </div>

                                <div class="_price">
                                    <div class="_price-center _next-center">
                                        <div class="_pool-top">
                                            <p class="_total-pool">
                                                <span>Prize Pool:</span>
                                                <span><count-jump
                                                    :val="$shiftedBy(nextList.totalAmount, -nextList.tokenDecimals).toFixed(2)"
                                                    :is-format="true"/> {{nextList.tokenSymbol}}</span>
                                            </p>
                                            <p class="_your-pool"
                                                v-if="Number(nextList.amount) > 0">
                                                <span>Your Position:</span>
                                                <span><count-jump
                                                    :val="$shiftedBy(nextList.amount, -nextList.tokenDecimals).toFixed(2)"
                                                    :is-format="true"/> {{nextList.tokenSymbol}}</span>
                                            </p>
                                        </div>

                                        <div class="_price-bt">
                                            <el-button :disabled="disabled"
                                                @click="enterClick('up')">
                                                Enter UP
                                            </el-button>
                                            <el-button :disabled="disabled"
                                                @click="enterClick('down')">
                                                Enter DOWN
                                            </el-button>
                                        </div>
                                    </div>
                                </div>

                                <div class="_price-change _next-change">
                                    <div class="_btn-change _up"
                                        :class="[{'_r-up-bg': Number(nextList.amount)>0 && Number(nextList.position)===0}]">
                                        <img src="../../assets/images/prediction/img4.svg" alt=""
                                            class="_chang-up-img"
                                            v-if="Number(nextList.amount)>0 && Number(nextList.position) === 0">
                                        <span class="txt">UP</span>
                                        <span class="num">{{(nextList.totalAmount == 0 || nextList.bullAmount == 0) ? 0 : (nextList.totalAmount / nextList.bullAmount).toFixed(2)}}x {{$t('prediction.payout')}}</span>
                                    </div>
                                    <div class="_btn-change _down"
                                        :class="[{'_r-down-bg': Number(nextList.amount)>0 && Number(nextList.position)===1}]">
                                        <img src="../../assets/images/prediction/img4.svg" alt=""
                                            class="_chang-down-img"
                                            v-if="Number(nextList.amount)>0 && Number(nextList.position) === 1">
                                        <span class="num">
                                            {{(nextList.totalAmount == 0 || nextList.bearAmount == 0) ? 0 : (nextList.totalAmount / nextList.bearAmount).toFixed(2)}}x {{$t('prediction.payout')}}
                                        </span>
                                        <span class="txt">DOWN</span>
                                    </div>
                                </div>
                            </div>

                            <div class="_con _back-bg" :class="{'_backface': !browserVer}">
                                <Back
                                    :data="poolInfo"
                                    :info="nextList"
                                    :type="type"
                                    :is-rotate="isRotate"
                                    @goBack="goBack"
                                    @subscribeUpdate="subscribeUpdate"
                                />
                            </div>
                        </div>

                        <img src="../../assets/images/prediction/end-bt-bg.svg" alt=""
                            class="_pre-img">
                    </swiper-slide>

                    <swiper-slide class="_pre-bg">
                        <img src="../../assets/images/prediction/end-top-bg.svg" alt=""
                            class="_pre-img">

                        <div class="_prediction-card later-card">
                            <div class="_con">
                                <div class="_title">
                                    <a-icon type="icon-later"/>
                                    <span>{{$t('prediction.statusTag4')}}</span>
                                    <span>#{{Number(poolIndex) + 1}}</span>
                                </div>

                                <div class="_price">
                                    <div class="_price-center _later-center">
                                        <p>
                                            <span>{{$t('prediction.entryStarts')}}:</span>
                                            <span>～{{later1Time.m}}:{{later1Time.s}}</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="_price-change _later-change">
                                    <div class="_btn-change _up">
                                        <span class="txt">UP</span>
                                    </div>
                                    <div class="_btn-change _down">
                                        <span class="txt">DOWN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img src="../../assets/images/prediction/end-bt-bg.svg" alt=""
                            class="_pre-img">
                    </swiper-slide>
                </swiper>
            </a-loading>

        </template>
        <Paused :visible="visible"/>
        <prediction-layout
            @prev="prev"
            @next="next"
            :update="watchHistory"
            :claim-epoch="claimEpoch"/>
        <el-dialog
            :append-to-body="true"
            class="dialog-madel prediction-reward pd-0"
            :visible="rewardVisible"
            :before-close="closeRewardModel"
            :close-on-click-modal="true"
        >
            <h4 class="prediction-reward-title"> {{ $t('prediction.footerGold') }} </h4>
            <section class="prediction-reward-body">
                <img src="~img/prediction/reward.svg" alt="">
                <p>{{$t('prediction.footerCollecting')}} <span>{{harvestInfo.reward}} {{harvestInfo.tokenSymbol}}</span>
                </p>
                <el-button :loading="claimLoad" class="prediction-footer-btn prediction-reward-btn"
                    @click.stop="harvest()">{{ $t('prediction.footerCollect') }}
                </el-button>
            </section>
        </el-dialog>
        <SymbolModal
            :symbol-visible="symbolVisible"
            :symbol-list="poolList"
            @close="cancelSymbolModal"/>
    </div>
</template>

<script>
import {subLogin} from 'mixins/subLogin'
import Back from './back';
import Pools from './pools'
import ChainApi from '../../../static/sdk/ChainApi';
import {mapState} from 'vuex';
import predictionLayout from './modules/footer/layout'
import CountJump from '../../components/countJump/index';
import PrevNext from './prev-next';
import Time from './time';
import store from '@/store/store';
import mixin from '../../assets/js/mixin';
import Paused from './paused'
import BigNumber from 'bignumber.js';
import SymbolModal from './symbol';

export default {
    name: 'index',
    mixins: [subLogin],
    components: {
        CountJump,
        Back,
        predictionLayout,
        Pools,
        PrevNext,
        Time,
        Paused,
        SymbolModal
    },
    provide() {
        return {
            harvest: this.harvest,
            showHaves: this.showHaves,
        };
    },
    data() {
        return {
            percentage: 0,
            customColor: '#EA6607',
            poolList: [],
            poolName: '--',
            poolAddress: null,
            cardObj: {},
            poolInfo: {},
            poolIndex: null,
            isRotate: false,
            type: 'up',
            rounds: [],
            isAdd: true,
            isLoad: true,

            swiperOptions: {
                slidesPerView: 'auto',
                slidesOffsetAfter: 0,
                spaceBetween: 10,
                centerInsufficientSlides: true,
                freeMode: true,
                centeredSlides: true
            },

            timer: null,
            startBlock: null,
            endBlock: null,

            endList: [],
            realList: {},
            nextList: {},
            isOpen: false,

            later1Time: {
                down: true,
                d: '00',
                h: '00',
                m: '00',
                s: '00'
            },

            lastPrice: null,
            startName: '',
            disabled: false,

            visible: false,

            watchHistory: {
                index: null,
                upDate: false
            },

            collectLoad: false,


            /**
             * reward
             */
            rewardVisible: false,
            claimLoad: false,
            isCalinAll: false,
            predictValue: '',

            claimForm: '',
            harvestInfo: {
                reward: '',
                tokenSymbol: '',
                epoch: ''
            },

            /** Calin After Callback **/
            cbFn: '',

            /** CardList Calin After Updata HistoryList**/
            claimEpoch: '',

            // symbol modal
            symbolVisible: false,

            // browser
            browserVer: false
        }
    },
    computed: {
        ...mapState({
            currentPrice: 'currentPrice',
        }),
        swiper() {
            return !this.visible && !this.isLoad && this.$refs.mySwiper.$swiper
        }
    },
    mounted() {
        console.log('内核', navigator.userAgent.indexOf('Firefox'));
        this.browserVer = navigator.userAgent.indexOf('Firefox') > -1;
    },
    methods: {
        init() {
            this.getPoolsList();
        },
        prev() {
            if (this.visible) return;
            this.swiper.slideTo(this.swiper.activeIndex - 1, 300, true);
        },
        next() {
            if (this.visible) return;
            this.swiper.slideTo(this.swiper.activeIndex + 1, 300, true);
        },
        center() {
            this.swiper.slideTo(this.endList.length, 300, true);
        },
        subscribeUpdate() {
            this.watchHistory = {
                index: this.poolIndex,
                upDate: true
            }
        },
        subscribeHandle(predictPool, eventLog) {
            console.log('eventLog', eventLog)
            this.startName = eventLog.eventName;
            if (eventLog.eventName === 'StartRound') {
                this.poolIndex = eventLog.data.epoch;
                this.getCurrentValue();
                this.subscribeUpdate();
                this.clearStatus();
            }
            if (eventLog.eventName === 'BetBear' || eventLog.eventName === 'BetBull') {
                this.getNextList(this.poolIndex, 'next');
            }
            if (eventLog.eventName === 'Pause') {
                this.visible = true;
                this.clearStatus();
            }
            if (eventLog.eventName === 'Unpause') {
                this.visible = false;
                this.clearStatus();
                this.getPoolsList();
            }
        },
        getPoolsList() {
            try {
                ChainApi.pricePredictionQuery.getPools().then(res => {
                    console.log('poolsList==>', res);
                    this.poolList = res;
                    this.poolInfo = res[0];
                    this.poolName = res[0].name;
                    this.poolAddress = res[0].address;
                    this.isLoad = true;
                    this.getInitList();
                });
            } catch (e) {
                console.error('e', e)
            }
        },
        getInitList() {
            ChainApi.DemaxPricePrediction(this.poolAddress).subscribe(this.subscribeHandle);
            ChainApi.DemaxPricePrediction(this.poolAddress).paused().then(paused => {
                if (!paused) {
                    ChainApi.DemaxPricePrediction(this.poolAddress).getCurrentEpoch().then(index => {
                        this.poolIndex = index;
                        this.getCurrentValue();
                        if (this.poolIndex <= 1) {
                            this.getNextList(this.poolIndex);
                        } else {
                            this.getRealList(this.poolIndex - 1);
                            this.getEndList(index);
                        }
                    });
                } else {
                    this.visible = true;
                }
            })
        },
        getCurrentValue() {
            store.commit('setPoolIndex', this.poolIndex);
            store.commit('setPoolInfo', this.poolInfo);
            if (this.startName === 'StartRound') {
                this.isOpen = false;
                this.startBlock = null;
                this.endBlock = null;
                this.getRealList(this.poolIndex - 1);
                if (this.poolIndex > 1) this.getLastEnd(this.poolIndex - 2);
            }
        },
        getRealList(val) {
            ChainApi.pricePredictionQuery.getUserRound(this.poolAddress, val).then(async res => {
                if (res) {
                    this.endBlock = await ChainApi.getNowToEndBlockTime(res.endBlock);
                    this.realList = res;
                    console.log('end==>', this.endBlock);
                    this.getNextList(this.poolIndex);
                    setTimeout(() => {
                        if (this.swiper) {
                            this.swiper.slideTo(this.endList.length, 300, true)
                        }
                    }, 1000);
                }
            });
        },
        getNextList(val, name) {
            ChainApi.pricePredictionQuery.getUserRound(this.poolAddress, val).then(async res => {
                if (res) {
                    this.nextList = res;
                    this.isLoad = false;
                    if (name !== 'next') {
                        this.startBlock = await ChainApi.getNowToEndBlockTime(res.startBlock);
                        this.isRotate = false;
                        this.percentage = 0;
                        console.log('start===>', this.startBlock)
                        if (this.endBlock && this.startBlock) {
                            this.getCountDown(this.startBlock, this.endBlock);
                        }
                    }
                }
            });
            this.getIsStake(this.poolAddress, this.poolIndex);
        },
        getEndList(val) {
            const range = (start, stop, step = 1) =>
                Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);
            if (val > 2 && val < 10) {
                this.rounds = range(1, val - 1);
            } else {
                this.rounds = range(val - 10, val - 1)
            }
            ChainApi.pricePredictionQuery.getUserRounds(this.poolAddress, this.rounds).then(res => {
                if (res) {
                    this.endList = res.map(d => {
                        let isShow, reward;
                        if (Number(d.amount) > 0 && Number(d.claimed) === 1 && (((d.closePrice - d.lockPrice) > 0 && Number(d.position) === 0)
                            || ((d.closePrice - d.lockPrice) < 0 && Number(d.position) === 1))
                            || (Number(d.closePrice) === 0 && Number(d.claimed) === 1 && Number(d.amount) > 0)
                            || (Number(d.lockPrice) === 0 && Number(d.claimed) === 1 && Number(d.amount) > 0)) {
                            isShow = true;
                            reward = d.oracleCalled ?
                                (Number(d.rewardBaseCalAmount) === 0 ? 0 : new BigNumber(d.amount).multipliedBy(d.rewardAmount).dividedBy(d.rewardBaseCalAmount).shiftedBy(-Number(d.tokenDecimals)).toFixed())
                                : new BigNumber(d.amount).shiftedBy(-Number(d.tokenDecimals)).toFixed();
                        } else {
                            isShow = false;
                            reward = d.amount;
                        }
                        return {
                            ...d,
                            isShow,
                            reward
                        }
                    });

                    console.log('end===>', this.endList)
                }
            });
        },
        getLastEnd(val) {
            ChainApi.pricePredictionQuery.getUserRound(this.poolAddress, val).then(res => {
                if (res) {
                    let isShow, reward;
                    if (Number(res.amount) > 0 && Number(res.claimed) === 1 && (((res.closePrice - res.lockPrice) > 0 && Number(res.position) === 0)
                        || ((res.closePrice - res.lockPrice) < 0 && Number(res.position) === 1))
                        || (Number(res.closePrice) === 0 && Number(res.claimed) === 1 && Number(res.amount) > 0)
                        || (Number(res.lockPrice) === 0 && Number(res.claimed) === 1 && Number(res.amount) > 0)) {
                        isShow = true;
                        reward = res.oracleCalled ?
                            (Number(res.rewardBaseCalAmount) === 0 ? 0 : new BigNumber(res.amount).multipliedBy(res.rewardAmount).dividedBy(res.rewardBaseCalAmount).shiftedBy(-Number(res.tokenDecimals)).toFixed())
                            : new BigNumber(res.amount).shiftedBy(-Number(res.tokenDecimals)).toFixed();
                    } else {
                        isShow = false;
                        reward = res.amount;
                    }
                    this.endList.push({
                        ...res,
                        isShow,
                        reward
                    });
                }
            });
        },
        enterClick(name) {
            this.type = name;
            this.isRotate = true;
        },
        goBack(name) {
            this.isRotate = false;
            if (name) {
                this.disabled = true;
            }
        },
        getCountDown(start, end) {
            this.timer = setInterval(async () => {
                // const currentBlock = await ChainApi.getBlockNumber();
                const currentBlock = new Date().getTime();
                const num = (currentBlock - start) / (end - start) * 100;
                this.percentage = num >= 100 ? 100 : num;
                // console.log('倒计时===》', start, end, currentBlock - start, end - start, this.percentage);
                const a = mixin.methods.counDown(currentBlock, end, () => {
                    clearInterval(this.timer);
                    this.isOpen = true;
                    this.percentage = 0;
                    this.endBlock = null;
                    this.startBlock = null;
                    this.isRotate = false;
                    this.disabled = true;
                });
                this.later1Time = {...a}
            }, 2000);
        },
        getIsStake(address, val) {
            ChainApi.DemaxPricePrediction(address).getLedger(val).then(res => {
                this.disabled = Number(res.amount) > 0;
            });
        },
        closeModal() {
            this.visible = false
        },
        collectClick(item) {
            this.collectLoad = true;
            const callback = (isClainAll, harvestInfo) => {
                if (!isClainAll) {
                    this.collectLoad = false;
                    this.claimEpoch = harvestInfo.epoch;
                    this.updateEndList(harvestInfo);
                }
            };
            this.showHaves(false, item, callback, 'cardList');
        },
        updateEndList(harvestInfo, isClaimAll = false) {
            this.endList = this.endList.map(res => {
                return {
                    ...res,
                    claimed: isClaimAll ? 2 : (harvestInfo.epoch === res.epoch ? 2 : res.claimed),
                    isShow: false
                }
            })
        },
        /**
         * Harvest Reward Model
         * Harvest Reward Model
         * Harvest Reward Model
         */
        closeRewardModel() {
            this.rewardVisible = false;
            this.collectLoad = false;
        },
        /**
         * showHaves
         * @param isCalinAll Booble
         * @param data {epoch: '', tokenSymbol: '', epoch: ''}
         * @param cb  Function
         * @param form
         */
        showHaves(isCalinAll, data, cb, form = 'history') {
            this.isCalinAll = isCalinAll;
            this.cbFn = cb;
            this.claimForm = form;
            if (!isCalinAll) {
                this.rewardVisible = true;
                this.harvestInfo = data;
            } else {
                this.harvest()
            }

        },
        harvest() {
            this.claimLoad = true;
            let request;
            if (this.isCalinAll) request = ChainApi.DemaxPricePrediction(this.poolInfo.address).claimAll()
            else request = ChainApi.DemaxPricePrediction(this.poolInfo.address).claim(this.harvestInfo.epoch)

            request.then(hash => {
                this.$store.dispatch('recordCallback', {
                    key: 'Prediction',
                    action: 'Prediction',
                    params: {describe: `Harvest ${this.harvestInfo.tokenSymbol}`},
                    code: 0,
                    result: hash,
                });
                return ChainApi.awaitTransactionMined(hash);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Harvest ${this.harvestInfo.tokenSymbol}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Success',
                        type: 'success'
                    });
                    this.rewardVisible = false;
                    if (this.cbFn) this.cbFn(this.isCalinAll, this.harvestInfo);
                    if (this.claimForm === 'history') this.updateEndList(this.harvestInfo, this.isCalinAll);
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Harvest ${this.harvestInfo.tokenSymbol}`},
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
        },
        /**
         * symbol modal
         */
        symbolClick() {
            if (this.poolList.length <= 1) return;
            this.symbolVisible = true;
        },
        cancelSymbolModal($event) {
            console.log('close===>', $event)
            if ($event) {
                this.poolInfo = $event;
                this.poolName = $event.name;
                this.poolAddress = $event.address;
                this.isLoad = true;
                this.clearStatus();
                this.getInitList();
            }
            this.symbolVisible = false;
        },
        clearStatus() {
            clearInterval(this.timer);
            this.isOpen = false;
            this.startBlock = null;
            this.endBlock = null;
            this.percentage = 0;
        },
    },
    beforeDestroy() {
        this.clearStatus();
        ChainApi.DemaxPricePrediction(this.poolAddress).unsubscribe(this.subscribeHandle);
    }
}
</script>

<style scoped lang="less">
    ._top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 60px;
        position: relative;
        padding: 0 60px;

        ._prev-next {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    ::v-deep .swiper-wrapper {
        align-items: center;
    }

    ._back-bg, ._front-bg {
        position: absolute;
        background-color: #2C3035;
        border-radius: 10px;
        overflow: hidden;
    }

    ._back-bg {
        transform: rotateY(180deg);
        /*z-index: -1;*/
    }

    ._front-default {
        position: relative !important;
        overflow: inherit !important;
    }

    ._pre-bg {
        width: 344px;
        margin: 0 10px;

        ._pre-img {
            margin: 0 .5%;
            width: 99%;
        }
    }

    ._end-bg {
        cursor: pointer;

        &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            z-index: 2;
            background-image: url("../../assets/images/prediction/end-bg.svg");
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
        }


        &:hover {
            &::before {
                z-index: -1;
            }
        }
    }

    ._prediction-card {
        margin: 12px auto 19px;
        width: 297px;
        height: auto;
        border-radius: 10px;
        position: relative;
        transition: transform 1s;
        transform-style: preserve-3d;
    }

    ._backface {
        -webkit-backface-visibility: hidden; /* Chrome 和 Safari */
        -moz-backface-visibility: hidden; /* Firefox */
        -ms-backface-visibility: hidden; /* Internet Explorer */
        backface-visibility: hidden;
    }

    .end-card {
        overflow: hidden;

        ._real-time {
            margin-bottom: 20px;
        }

        ._price-change div ._chang-down-img {
            top: 5px;
            right: 0;
        }
    }

    .real-card {
        min-height: 315px;
        /*overflow: hidden;*/
    }

    .next-card {
        height: 309px;

        ._front-bg {
            z-index: 0;
        }

        ._back-bg {
            z-index: -1;
        }
    }

    .later-card {
        /*height: 239px;*/
        overflow: hidden;
    }

    .real-open {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        flex-wrap: wrap;

        img {
            width: 180px;
        }

        p {
            width: 100%;
            text-align: center;
            color: #000000;
        }
    }

    .card-rotate-180 {
        transform: rotateY(180deg);

        /*._front-bg {*/
        /*    z-index: -1;*/
        /*}*/

        /*._back-bg {*/
        /*    z-index: 0;*/
        /*}*/
    }

    ::v-deep .el-progress-bar__outer {
        border-radius: 0;
    }

    ._con {
        width: 100%;
        height: 100%;
        background-color: #2C3035;
    }

    ._title {
        padding: 20px 20px 0;
        position: relative;
        margin-bottom: 17px;
        display: flex;
        align-items: center;
        color: #ffffff;

        span {
            font-size: 14px;
            padding-right: 11px;

            &:nth-of-type(1) {
                font-size: 24px;
            }

            &:nth-of-type(2) {
                padding-right: 8px;
            }

            &:nth-of-type(3) {
                font-size: 14px;
            }
        }

        ._end-success-tag {
            position: absolute;
            top: 10px;
            right: 20px;
            width: 35px;
        }
    }

    ._price {
        padding: 0 20px;

        ._price-center {
            width: 100%;
            height: auto;
            padding: 16px 10px;
            border: 2px solid #C8C8C8;
            border-radius: 10px;
        }
    }

    ._real-time {
        margin-bottom: 30px;

        p {
            &:nth-of-type(1) {
                font-weight: 500;
                font-size: 12px;
                line-height: 12px;
                margin-bottom: 25px;
                color: #ffffff;
            }

            &:nth-of-type(2) {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;

                span {
                    font-weight: 600;
                    color: #ffffff;

                    &:nth-of-type(1) {
                        font-size: 20px;
                    }

                    &:nth-of-type(2) {
                        display: inline-flex;
                        align-items: center;
                        padding: 0 10px;
                        height: 26px;
                        font-size: 16px;
                        color: #000;
                        border-radius: 4px;
                        background-color: #ffffff;

                        .a-icon {
                            color: #000000;
                        }
                    }
                }
            }

            &:nth-of-type(3), &:nth-of-type(4) {
                width: 50%;
                display: inline-flex;
                flex-wrap: wrap;

                span {
                    display: block;
                    width: 100%;

                    &:nth-of-type(1) {
                        font-weight: 600;
                        font-size: 14px;
                        color: #ABACAE;
                        margin-bottom: 8px;
                    }

                    &:nth-of-type(2) {
                        font-weight: 500;
                        font-size: 16px;
                        color: #ffffff;
                    }
                }
            }

            &:nth-of-type(4) {
                text-align: right;
            }
        }

        ._real-you-pool {
            margin-top: 12px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;

            span {
                &:nth-of-type(1) {
                    font-weight: 600;
                    font-size: 14px;
                    color: #ABACAE;
                }

                &:nth-of-type(2) {
                    font-weight: 500;
                    font-size: 16px;
                    color: #ffffff;
                }
            }
        }
    }

    ._next-center {
        margin-bottom: 19px;
        height: 175px !important;

        ._pool-top {
            margin-bottom: 22px;
        }

        ._total-pool, ._your-pool {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;

            span:nth-of-type(1) {
                color: #ABACAE;
            }
        }

        ._total-pool {
            margin-bottom: 9px;
        }

        ._price-bt {
            padding: 5px 18px 0;

            button {
                width: 100%;
                margin: 0;
                height: 30px;
                border-radius: 10px;
                color: #ffffff;
                font-weight: 600;
                font-size: 16px;
                border: 0;
                display: flex;
                align-items: center;
                padding: 0;
                justify-content: center;

                &:nth-of-type(1) {
                    background-color: #309049;
                    box-shadow: 1px 2px 0px #146629, inset 0px -1px 6px rgba(91, 193, 160, 0.2);
                    margin-bottom: 10px;
                }

                &:nth-of-type(2) {
                    background: #BC533F;
                    box-shadow: 1px 2px 0px #AA3B26, inset 0px -2px 4px rgba(234, 94, 111, 0.2);
                }

                &:disabled {
                    color: #C0C4CC;
                    opacity: 0.5;
                }
            }
        }
    }

    ._later-center {
        border-color: #C8C8C8 !important;
        height: 116px !important;
        margin-bottom: 22px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #ffffff;

        p {
            width: 100%;

            span {
                font-weight: 600;

                &:nth-of-type(1) {
                    display: block;
                    width: 100%;
                    font-size: 14px;
                    padding-bottom: 15px;
                }

                &:nth-of-type(2) {
                    font-size: 24px;
                }
            }

        }
    }

    ._price-change {
        display: flex;
        justify-content: space-between;

        ._btn-change {
            width: calc(50% - 3px);
            min-height: 48px;
            display: flex;
            align-items: center;
            text-align: center;
            flex-wrap: wrap;
            padding: 10px 0;
            position: relative;

            &:nth-of-type(1) {
                border-radius: 0 34px 34px 10px;
            }

            &:nth-of-type(2) {
                border-radius: 34px 0 10px 34px;
            }

            span {
                display: block;
                width: 100%;

                &:nth-of-type(1) {
                    margin-bottom: 5px;
                }
            }

            .txt {
                font-weight: 600;
                font-size: 20px;
            }

            .num {
                font-weight: 600;
                font-size: 14px;
            }

            ._chang-up-img {
                position: absolute;
                right: 0;
                top: -11px;
                width: 40px;
            }

            ._chang-down-img {
                position: absolute;
                right: -1px;
                top: 10px;
            }
        }
    }

    ._real-time-change, ._next-change {
        div {
            background-color: #D8D8D8;

            .num {
                color: #1F2226;
            }

            &:nth-of-type(1) {
                .txt {
                    color: #309049;
                }
            }

            &:nth-of-type(2) {
                .txt {
                    color: #BC533F;
                }
            }
        }
    }

    ._next-change {
        div {
            background-color: #2C3035;
            border: 1px solid #868686;

            .num {
                color: #ffffff !important;
            }

            &:nth-of-type(1) {
                border-radius: 0 34px 34px 10px;
            }

            &:nth-of-type(2) {
                border-radius: 34px 0 10px 34px;
            }
        }
    }

    ._later-change {
        div {
            background-color: #D8D8D8;

            span:nth-of-type(1) {
                margin-bottom: 0 !important;
            }

            .txt {
                color: #ADADAD;
            }

            .num {
                display: none;
            }
        }
    }

    ._end-collect {
        width: 100%;
        height: 59px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 0 10px 10px;
        background-color: rgba(#97521A, .4) !important;

        img {
            width: 44px;
            margin-right: 23px;
        }

        button {
            width: 170px;
            height: 36px;
            background: #DF9E1C;
            border-radius: 10px;
            border: 0;
            font-size: 16px;
            color: #ffffff;
            padding: 0;
            margin: 0;
        }
    }

    ._r-up-bg {
        background-color: #30914A !important;
        color: #ffffff !important;
        border: none !important;

        span, .num {
            color: #ffffff !important;
        }

        .a-icon {
            transform: rotate(180deg);

            ::v-deep svg {
                font-size: 20px;
            }
        }
    }

    ._r-down-bg {
        background-color: #BC533F !important;
        color: #ffffff !important;
        border: none !important;

        span, .num {
            color: #ffffff !important;
        }

        .a-icon {
            ::v-deep svg {
                font-size: 20px;
            }
        }
    }

    ._up-color {
        color: #309049 !important;
    }

    ._down-color {
        color: #BC533F !important;
    }

    ._up-border-color {
        border-color: #30914A !important;
    }

    ._down-border-color {
        border-color: #BC533F !important;
    }


    .prediction-footer-btn {
        height: 34px;
        font-weight: 500;
        font-size: 14px;
        color: #212833;
        background: linear-gradient(180deg, #F0B90B 0%, #F8D12F 100%) !important;
        border-radius: 20px;
        border: none;
        padding: 0 40px;
        float: right;
        margin-right: 70px;
        transition: background .2s;

        &:hover {
            background: #F6D261 !important;
        }
    }

    /deep/ .prediction-reward {
        color: #212833;

        &-title {
            height: 34px;
            font-weight: 500;
            font-size: 18px;
            line-height: 6px;
            text-indent: 24px;
            margin: 0;
            color: #212833;
            border-bottom: 2px solid #E9EAEB;;
        }

        &-body {
            padding: 43px 24px 34px;
            text-align: center;

            img {
                width: 200px;
            }

            p {
                margin: 31px 0;
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                text-align: left;
                color: #212833;

                span {
                    float: right;
                }
            }
        }

        &-btn {
            width: 85%;
            height: 50px;
            border-radius: 25px;
            float: inherit;
            margin-right: 0;
        }
    }

    @media (max-width: 768px) {
        ._top {
            padding: 0 20px;
        }

        ._price {
            ._price-center {
                border-width: 1px;
            }
        }

        .real-open {
            img {
                width: 150px;
            }
        }


        .next-card {
            height: 315px;

            ._title {
                span {
                    font-size: 10px;
                }
            }
        }
    }
</style>
