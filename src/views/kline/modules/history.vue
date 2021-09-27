<template>
    <div class="prediction-footer-history">
        <div class="prediction-footer-history-head">
            <p>Filter</p>
            <img class="prediction-footer-history-head-close" src="~img/prediction/close.svg" alt="">
            <div class="prediction-footer-history-head-menu">
                <div><img src="~img/prediction/select.svg" alt=""> All</div>
                <div><img src="~img/prediction/unselect.svg" alt="">Collected</div>
                <div><img src="~img/prediction/unselect.svg" alt="">Uncollected</div>
            </div>
        </div>

        <div class="prediction-footer-history-list">
            <div class="prediction-footer-history-list-nav">
                <div class="prediction-footer-history-list-nav-item">
                    <p>Round</p>
                    <p>$0.002123</p>
                </div>
                <div class="prediction-footer-history-list-nav-item">
                    <p>Your Resuit</p>
                    <p>-0.010</p>
                </div>

            </div>
            <div class="prediction-footer-history-list-detail"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "History"
    }
</script>

<style scoped lang="less">
    .prediction-footer-history{
        width: 100%;
        background: rgba(44, 48, 53, 1);
        &-head{
            height: 130px;
            padding: 26px 38px 32px;
            box-sizing: border-box;
            color: #FFFFFF;
            position: relative;
            background: linear-gradient(106.39deg, #A66868 1.4%, #8D4627 53.69%, #615703 99.67%);
            p{
                font-size: 18px;
                line-height: 18px;
                margin-bottom: 26px;

            }
            &-close{
                position: absolute;
                right: 38px;
                top: 24px;
                width: 24px;
                height: 24px;
                cursor: pointer;
            }
            &-menu{
                height: 30px;
                div{
                    height: 100%;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 30px;
                    margin-right: 68px;
                    img{
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                        vertical-align: bottom;
                    }
                    &:last-child{
                        margin-right: 0;
                    }
                }

            }
        }
        &-list{
            &-nav{
                height: 100px;
                padding: 23px 34px;
                &-item{
                    font-weight: 600;
                    text-align: center;
                    margin-right: 50px;
                    display: inline-block;
                    p{
                        color: #ABACAE;
                        font-size: 18px;
                        line-height: 18px;
                        padding: 0 20px;
                    }
                    p:last-child{
                        color: #fff;
                        font-size: 24px;
                        line-height: 24px;
                        margin-top: 12px;
                    }
                    &:first-child{
                        p{
                            padding-left: 0;
                        }
                    }
                }
            }
        }
    }
</style>
