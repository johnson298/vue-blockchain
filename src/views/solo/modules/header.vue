<template>
    <header class="solo-head">
        <div class="solo-head-title">
            <div class="solo-head-title-name">{{$t('Solo.Title')}}</div>
            <p>{{$t('Solo.Tip')}}</p>
        </div>
        <div class="solo-head-info">
            <div class="solo-head-info-item">
                <div class="solo-head-info-item-number"><count-jump :val="data.tvl" :is-format=true /></div>
                <p>{{$t('Solo.TotalLock')}}(USDT)</p>
            </div>
            <div class="solo-head-info-item">
                <div class="solo-head-info-item-number"><count-jump :val="data.earn" :is-format=true /></div>
                <p>{{$t('Solo.UserIncome')}}(USDT)</p>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "soloHead",
        props: {
            data: {
                type: Object,
                default: ()=>{}
            },
        }
    }
</script>

<style lang="less" scoped>
    .solo-head {
        color: #fff;
        margin-bottom: 48px;
        &-title{
            text-align: center;
            &-name{
                font-weight: 500;
                font-size: 32px;
                line-height: 32px;
                height: 36px;
            }
            p{
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
                letter-spacing: 2px;
                margin-top: 14px;
                opacity: 0.6;
            }
        }
        &-time{
            margin-top: 30px;
            color: #fff;
            .tip{
                font-weight: 500;
                font-size: 24px;
                line-height: 24px;
                text-align: center;
                margin-bottom: 14px;
            }
            .times{
                display: flex;
                justify-content: center;
                &-item{
                    text-align: center;
                    width: 80px;
                    &-data{
                        font-weight: 500;
                        font-size: 64px;
                        line-height: 64px;
                    }
                    &-tips{
                        margin-top: 2px;
                        font-size: 12px;
                        line-height: 12px;
                        font-weight: 400;
                        color: rgba(#fff, .6);
                    }
                }
                span{
                    margin: 0 10px;
                    font-size: 48px;
                    line-height: 54px;
                }
            }

        }
        &-info{
            margin-top: 66px;
            /*height: 136px;*/
            display: flex;
            &-item{
                flex: 1;
                padding: 34px 44px 32px;
                background: #2C3035;
                border-radius: 10px;
                &:first-child{
                    margin-right: 37px;
                }
                &-number{
                    font-size: 36px;
                    line-height: 24px;
                }
                p{
                    margin-top: 28px;
                    font-size: 18px;
                    line-height: 18px;
                    opacity: 0.6;
                }
            }
        }
    }
    @media (max-width: 768px){
        .solo-head{
            margin-bottom: 27px;
            &-title{
                &-name{
                    font-size: 24px;
                    line-height: 24px;
                    height: 24px;
                }
                p{
                    margin-top: 18px;
                    font-size: 18px;
                    line-height: 18px;
                }
            }
            &-time{
                margin-top: 20px;
                .tip{
                    font-size: 24px;
                }
                .times{
                    &-item{
                        width: 70px;
                        &-data{
                            font-size: 58px;
                            line-height: 58px;
                        }
                        &-tips{
                            font-size: 8px;
                        }
                    }
                    span{
                        margin: 0 10px;
                        font-size: 48px;
                        line-height: 54px;
                    }
                }

            }
            &-info{
                margin-top: 27px;
                display: block;
                &-item{
                    width: 100%;
                    padding: 28px 18px;
                    &:last-child{
                        margin-top: 18px;
                    }
                    &-number{
                        font-size: 22px;
                        line-height: 24px;
                    }
                    p{
                        margin-top: 26px;
                        font-size: 14px;
                        line-height: 14px;
                    }
                }
            }
        }
    }
</style>
