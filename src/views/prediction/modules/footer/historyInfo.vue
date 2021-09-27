<template>
    <div class="prediction-history-detail">
        <div class="prediction-history-detail-item">
            <h4>{{ $t('prediction.footerHistory') }}</h4>
            <div class="detail-item-info">
                <p class="detail-item-info-your">{{ $t('prediction.footerDirection') }}
                    <span class="btn" v-if="dataInfo.position == 0"><img src="~img/prediction/up.svg" alt="">{{ $t('prediction.footerUP') }}</span>
                    <span class="btn btn-down" v-else><img src="~img/prediction/up.svg" alt="">{{ $t('prediction.footerDOWN') }}</span>
                </p>

                <p class="detail-item-info-your">{{ $t('prediction.footerPosition') }} <span>{{$shiftedBy(dataInfo.amount, -Number(dataInfo.tokenDecimals)) | numberFormat(2)}} {{dataInfo.tokenSymbol}}</span></p>
                <p class="f-fw6 detail-item-info-white detail-item-info-your">Your Result <span :class="[dataInfo.reward > 0 ? 'blue' : 'red']">{{dataInfo.reward > 0 ? '+' : ''}} {{dataInfo.reward | numberFormat(2)}} {{dataInfo.tokenSymbol}}</span></p>
<!--                <p class="detail-item-info-your"> <span>-$0</span></p>-->
            </div>
        </div>

        <div class="prediction-history-detail-item">
            <h4>Round History</h4>
            <div class="detail-item-info" :class="[dataInfo.closePrice > 0 ? spread >= 0 ? 'detail-item-info-up' : 'detail-item-info-down' : '']">
                <p class="detail-item-info-close">{{ $t('prediction.footerCLOSED') }}</p>
                <div class="detail-item-info-history" :class="[spread >= 0 ? 'blue' : 'red']">
                    ${{$shiftedBy(dataInfo.closePrice, -Number(dataInfo.oracleDecimals))}}
                    <span class="btn" v-if="spread >= 0"><img src="~img/prediction/up.svg" alt="">+ ${{spread | numberFormat(2)}}</span>
                    <span class="btn btn-down" v-else><img src="~img/prediction/up.svg" alt="">${{spread | numberFormat(2)}}</span>
                </div>
                <p class="detail-item-info-history">Locked price: <span>${{$shiftedBy(dataInfo.lockPrice, -Number(dataInfo.oracleDecimals)) | numberFormat(2)}}</span></p>
                <p class="f-fw6 detail-item-info-white detail-item-info-history ">Prize Pool: <span>{{$shiftedBy(dataInfo.totalAmount, -Number(dataInfo.tokenDecimals))}} {{dataInfo.tokenSymbol}}</span></p>
                <div class="detail-item-info-direction"> {{ $t('prediction.footerUP') }}:
                    <div>
                        <p class="detail-item-info-white">{{dataInfo.bullAmount == 0 ? 0 : dataInfo.totalAmount / dataInfo.bullAmount  | numberFormat(2)}}x {{ $t('prediction.footerPayout') }}</p>
                        <p>{{$shiftedBy(dataInfo.bullAmount, -Number(dataInfo.tokenDecimals))  | numberFormat(2)}} {{dataInfo.tokenSymbol}}</p>
                    </div>
                </div>
                <div class="detail-item-info-direction"> {{ $t('prediction.footerDOWN') }}:
                    <div>
                        <p class="detail-item-info-white">{{dataInfo.bearAmount == 0 ? 0 : dataInfo.totalAmount / dataInfo.bearAmount | numberFormat(2)}}x {{ $t('prediction.footerPayout') }}</p>
                        <p>{{$shiftedBy(dataInfo.bearAmount, -Number(dataInfo.tokenDecimals))  | numberFormat(2)}} {{dataInfo.tokenSymbol}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BigNumber from 'bignumber.js';
    import ChainApi from "../../../../../static/sdk/ChainApi";

    export default {
        name: "HistoryInfo",
        props: ['dataInfo'],
        data(){
          return{
              spread: 0,
          }
        },
        created() {
            this.realDirection()
        },

        methods:{
            realDirection(){
                this.spread = new BigNumber(this.dataInfo.closePrice  || 0).minus(this.dataInfo.lockPrice || 0).shiftedBy(-Number(this.dataInfo.oracleDecimals)).toString()
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
    .prediction-history-detail{
        width: 85%;
        margin: 0 auto;
        padding-bottom: 30px;
        display: flex;
        justify-content: space-between;
        &-item{
            width: 47%;
            h4{
                font-weight: 600;
                font-size: 18px;
                line-height: 18px;
                margin: 28px 0 22px;
                color: #FFFFFF;
            }
            .detail-item-info{
                height: 380px;
                padding: 0 18px;
                border: 2px solid #C8C8C8;
                box-sizing: border-box;
                border-radius: 10px;
                &-up{
                    border-color: #309049;
                }
                &-down{
                    border-color: rgba(188, 83, 63, 1);
                }

                .btn{
                    display: inline-block;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    background: #309049;
                    border-radius: 4px;
                    color: #fff;
                    img{
                        width: 20px;
                        margin-right: 4px;
                        vertical-align: sub;
                    }
                }
                .btn-down{
                    background: #BC533F;
                    img{
                        transform: rotate(180deg);
                    }
                }

                &-white{
                    color: #fff !important;
                    font-weight: 600;
                }
                &-your{
                    color: #ABACAE;
                    height: 30px;
                    line-height: 30px;
                    margin-top: 15px;
                    font-size: 16px;
                    span{
                        float: right;
                        color: #fff;
                        font-weight: 600;
                    }
                    &:first-child{
                        margin-top: 30px;
                    }
                }
                &-close{
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 16px;
                    color: #ABACAE;
                    margin: 30px 0 5px;
                }
                &-history{
                    font-weight: 500;
                    color: #ABACAE;
                    height: 44px;
                    font-size: 18px;
                    line-height: 44px;
                    margin-top: 15px;
                    span{
                        float: right;
                        font-size: 16px;
                    }
                }
                &-direction{
                    font-weight: 500;
                    color: #ABACAE;
                    height: 44px;
                    /*line-height: 44px;*/
                    font-size: 16px;
                    margin: 18px 0 20px;
                    div{
                        float: right;
                        font-weight: 500;
                        p{
                            font-size: 16px;
                            line-height: 18px;
                            margin-bottom: 4px;
                            text-align: right;
                            &:last-child{
                                text-align: right;
                            }
                        }
                    }
                }
            }
        }
    }


    @media (max-width: 768px){
        .prediction-history-detail{
            display: inline;
            &-item{
                width: 90%;
                margin-left: 5%;
                &:first-child{
                    .detail-item-info{
                        height: 170px;
                    }
                }
            }
        }
    }
</style>
