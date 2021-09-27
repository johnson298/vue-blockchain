<template>
    <div class="prediction-footer-history" :class="{'prediction-nodata': list.length == 0}">
        <div class="prediction-footer-history-head">
            <p>Filter <span :class="{'dis-claim': !disClaimAll}" @click="disClaimAll && clainHarvest(true, {})">{{ $t('prediction.footerCollectAll') }}</span></p>
            <img class="prediction-footer-history-head-close" @click="close" src="~img/prediction/close.svg" alt="">
            <div class="prediction-footer-history-head-menu">
                <div v-for="item in typeList" :key="item.key"  @click="type = item.key, filterList(item.key)" :class="{'nomall-nav': type != item.key}">
                    <img v-if="type === item.key" src="~img/prediction/select.svg" alt="">
                    <img v-else src="~img/prediction/unselect.svg" alt="">
                    <img class="prediction-footer-history-head-menu-hover" src="~img/prediction/hover.svg" alt="" >
                    {{item.label}}
                </div>
            </div>
        </div>

        <div class="prediction-footer-history-list" v-for="(item,index) in list" :key="item.epoch">
            <div class="prediction-footer-history-list-nav" @click="showDetail(index)">
                <div class="prediction-footer-history-list-nav-item">
                    <p>{{ $t('prediction.footerRound') }}</p>
                    <p>{{item.epoch}}</p>
                </div>
                <div class="prediction-footer-history-list-nav-item">
                    <p>{{ $t('prediction.footerResuit') }}</p>
                    <p :class="[item.reward > 0 ? 'blue' : 'red']">{{item.reward > 0 ? '+' : ''}} {{item.reward | numberFormat(2)}}</p>
                </div>

                <el-button class="prediction-footer-btn f-center-y" :disabled="item.claimed == 2" v-if="item.reward > 0 && item.epoch < poolIndex-1" @click.stop="clainHarvest(false,item)">{{ $t('prediction.footerCollect') }}</el-button>
                <img src="~img/prediction/chevron-down.svg" alt="" :class="{'down': activeIndex === index}" >
            </div>
            <april-transition :show="activeIndex === index">
                <history-info :data-info="item" />
            </april-transition>
        </div>

        <div class="prediction-footer-history-nodata" v-if="list.length == 0">
            {{ $t('prediction.footerNoData') }}
        </div>
    </div>
</template>

<script>
    import HistoryInfo from './historyInfo'
    import ChainApi from "../../../../../static/sdk/ChainApi";
    import {mapState} from "vuex";
    import BigNumber from "bignumber.js";
    import AprilTransition from "../../../../components/transition";
    export default {
        name: "History",
        components: {AprilTransition, HistoryInfo},
        inject: ['harvest', 'showHaves'],
        data(){
            const that = this;
            return{
                type: 'all',
                typeList: [
                    {label: that.$t('prediction.footerAll'), key: 'all'},
                    {label: that.$t('prediction.footerCollected'), key: 'collected'},
                    {label: that.$t('prediction.footerUncollected'), key: 'uncollected'},
                ],

                list: [],
                baseList: [],
                activeIndex: -1,

                predictValue: '',
                total: 0,
                isFirst: true,
                disClaimAll: false,
            }
        },
        props: {
            update: {
                type: Object,
                default: () => {
                    return {
                        index: null,
                        upDate: false
                    }
                }
            },
            claimEpoch: {
                type: String||Number,
                default: ''
            }
        },
        watch: {
            update: {
                handler(data) {
                    if (data.upDate && data.index == this.poolIndex && !this.isFirst) {
                        this.getUserRounds(Math.max(this.total - 2, 0), 3, true)
                    }
                },
                immediate: true,
                deep: true
            },
            claimEpoch: {
                handler(data) {
                    if (data && !this.isFirst) {
                        this.updataHistory(false,data)
                    }
                },
                immediate: true,
                deep: true
            },
            poolInfo: {
                handler(data) {
                    if (data?.address) {
                        this.init()
                    }
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            ...mapState({
                account: 'account',
                poolIndex: 'poolIndex',
                poolInfo: 'poolInfo'
            }),
        },

        methods:{
            clainHarvest(isAll, data){
                const callback = (isClainAll, harvestInfo) => {
                    this.updataHistory(isClainAll,harvestInfo.epoch)
                }
                this.showHaves(isAll, data, callback)
            },

            updataHistory(isClainAll, epoch){
                if(isClainAll){
                    this.baseList = this.baseList.map(res => {
                        return {
                            ...res,
                            claimed: 2,
                        }
                    })
                }else{
                    this.baseList = this.baseList.map(res => {
                        return {
                            ...res,
                            claimed: epoch === res.epoch ? 2 : res.claimed,
                        }
                    })
                }
                this.filterList(this.type);
            },

            init(){
                if(this.poolInfo?.address){
                    this.list = [];
                    this.isFirst = true;
                    this.getUserRounds(0, 15)
                }
            },

            getUserRounds(start, size, updata = false){
                ChainApi.pricePredictionQuery.iterateUserRounds(this.poolInfo.address, start, size, this.account).then(res => {
                    console.log('getUserRounds', res, start, size)
                    const _list = res.data.map(item => {
                        let _reward = 0
                        if(item.claimed != 0 ){
                            if (item.oracleCalled) {
                                _reward = item.rewardBaseCalAmount == 0
                                    ? 0
                                    : new BigNumber(item.amount).multipliedBy(item.rewardAmount).dividedBy(item.rewardBaseCalAmount);
                            }else {
                                _reward = item.amount;
                            }
                        }

                        return {
                            ...item,
                            reward: this.$shiftedBy(_reward, -Number(item.tokenDecimals)),
                        }
                    })
                    this.total = res.total;
                    if(updata) this.baseList.splice(-2, 2, ..._list)
                    else this.baseList.push(..._list);
                    this.filterList(this.type);

                    this.isFirst = false;
                    if(Number(size) == res.data.length){
                        setTimeout(_ => {
                            this.getUserRounds(Number(start) + 15, size)
                        }, 1000)
                    }
                });
            },

            showDetail(index){
                this.activeIndex = this.activeIndex === index ? null : index
            },
            filterList(type){
                this.activeIndex = -1;
                let _list = JSON.parse(JSON.stringify(this.baseList));
                switch (type) {
                    case 'all': this.list = _list.reverse(); break
                    case 'collected': this.list = _list.filter(item => item.claimed == 2).reverse(); break
                    default: this.list = _list.filter(item => (item.claimed == 1 && item.reward > 0)).reverse(); break
                }

                this.disClaimAll = this.list.some(item => item.claimed == 1 && item.reward > 0 && item.epoch < this.poolIndex-1)
            },

            close(){
                this.$emit('close')
            }
        }
    }
</script>

<style scoped lang="less">
    .red{
        color: rgba(188, 83, 63, 1) !important;
    }
    .blue{
        color: #309049 !important;
    }
    .prediction-nodata{
        padding-bottom: 30px;
    }
    .prediction-footer-history{
        width: 100%;
        background: rgba(44, 48, 53, 1);
        &-head{
            height: 100px;
            padding: 20px 38px;
            box-sizing: border-box;
            color: #FFFFFF;
            position: relative;
            background: linear-gradient(106.39deg, rgba(#A66868, .2) 1.4%, rgba(#8D4627,.2) 53.69%, rgba(#615703,.2) 99.67%);
            p{
                font-size: 18px;
                line-height: 18px;
                margin-bottom: 16px;
                span{
                    float: right;
                    color: #F0B80B;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 18px;
                    margin-right: 60px;
                    cursor: pointer;
                    &:hover{
                        color: #ffc820;
                    }
                }
                .dis-claim{
                    color: #AAA;
                    cursor: not-allowed;
                    &:hover{
                        color: #AAA;
                    }
                }
            }
            &-close{
                position: absolute;
                right: 38px;
                top: 16px;
                width: 24px;
                height: 24px;
                cursor: pointer;
            }
            &-menu{
                height: 24px;

                div{
                    height: 100%;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 24px;
                    margin-right: 48px;
                    cursor: pointer;
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                        vertical-align: bottom;
                        transition: all .2s;
                    }
                    .prediction-footer-history-head-menu-hover{
                        display: none;
                    }

                    &:last-child{
                        margin-right: 0;
                    }
                }
                .nomall-nav{
                    &:hover{
                        img{
                            display: none;
                        }
                        .prediction-footer-history-head-menu-hover{
                            display: inline-block;
                        }
                    }
                }

            }
        }
        &-list{
            &-nav{
                height: 80px;
                padding: 13px 44px;
                background: #43474B;
                border-bottom: 1px solid #687179;
                position: relative;
                &-item{
                    font-weight: 600;
                    text-align: center;
                    margin-right: 50px;
                    display: inline-block;
                    p{
                        color: #ABACAE;
                        font-size: 14px;
                        line-height: 16px;
                        padding: 0 20px;
                    }
                    p:last-child{
                        color: #fff;
                        font-size: 18px;
                        line-height: 20px;
                        margin-top: 12px;
                    }
                    &:first-child{
                        p{
                            padding-left: 0;
                        }
                    }
                }
                img{
                    position: absolute;
                    right: 44px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
                .down{
                    transform: translateY(-50%) rotate(180deg);
                }
            }
        }
        &-nodata{
            width: 85%;
            font-size: 24px;
            margin: 30px auto;
            color: var(--col-label60);
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            background: #6d5f5f;
        }
    }
    .prediction-footer-btn {
        height: 34px;
        font-weight: 500;
        font-size: 14px;
        color: #212833;
        background: #F0B90B;
        border-radius: 20px;
        border: none;
        padding: 0 40px;
        float: right;
        margin-right: 70px;
    }
    /deep/ .el-button{
        transition: background .2s;
    }
    /deep/ .el-button:hover{
        background: #F6D261;
    }
    /deep/ .is-disabled{
        color: #AAAAAA;
        background: linear-gradient(360deg, #DDDDDD 0%, #F3F2EE 100%) !important;
        &:hover{background: linear-gradient(360deg, #DDDDDD 0%, #F3F2EE 100%) !important; color: #AAAAAA;}
    }

    @media (max-width: 768px){
        .prediction-footer-history{
            width: 100%;
            height: 100%;
            overflow-y: auto;
            &-head{
                padding: 20px 20px;
                p{
                    span{
                        margin-right: 75px;
                    }
                }
                &-close{
                    right: 25px;
                }
            }
            &-list{
                &-nav{
                    padding: 15px 20px 13px;
                    &-item{
                        margin-right: 10px;
                    }
                    img{
                        right: 20px;
                    }
                }
            }
        }
    }
</style>
