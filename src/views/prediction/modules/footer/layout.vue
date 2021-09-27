<template>
    <div>
        <div class="prediction-footer" :class="{'prediction-footer-normal': ['chart', 'history'].includes(type)}">
            <div class="prediction-footer-nav">
                <div @click="type = type === 'chart' ? '' : 'chart', jumpToScroll()" :class="{'active': type === 'chart'}">
                    <img src="~img/prediction/chart.svg" alt="" >
                    {{ $t('prediction.footerChart') }}
                </div>
                <div @click="type = type === 'history' ? '' : 'history', jumpToScroll()" :class="{'active': type === 'history'}">
                    <img src="~img/prediction/history.svg" alt="">
                    {{ $t('prediction.footerHistory') }}
                </div>
            </div>

            <section class="prediction-footer-body" name="prediction-footer-body" v-show="['chart', 'history'].includes(type)">
                <chart :type="type" v-show="type === 'chart'" @close="type = 'home'" />
                <history v-if="type === 'history'" :update="update" :claim-epoch="claimEpoch" @close="type = 'home'" />
            </section>
        </div>

        <div class="prediction-footer-m">
            <img class="prediction-footer-m-left" @click="prev" src="~img/prediction/arrow-left.svg" alt="">
            <div class="prediction-footer-m-center f-center-x">
                <div :class="[type === 'home' && 'active']" @click="changeType('home')"><i class="iconfont">&#xe609;</i></div>
                <div :class="[type === 'chart' && 'active']" @click="changeType('chart')"><i class="iconfont">&#xe608;</i></div>
                <div :class="[type === 'history' && 'active']" @click="changeType('history')"><i class="iconfont">&#xe60a;</i></div>
            </div>
            <img class="prediction-footer-m-right" @click="next" src="~img/prediction/arrow-left.svg" alt="">
        </div>
    </div>

</template>

<script>
    import Chart from './charts.vue'
    import History from './history.vue'

    export default {
        name: "predictionLayout",
        components: {Chart, History},
        data(){
            return{
                type: 'home'
            }
        },
        props: ['update', "claimEpoch"],

        methods:{

            jumpToScroll(){
                this.$nextTick(() => {
                    document.querySelector("#el-main").scrollIntoView({
                        block:"end",
                        behavior: "smooth"
                    });

                    // let container = document.getElementById('body-contion') // 获取对象
                    // console.error('scrollIntoView===>maxHeight')


                    // if(container.scrollTop > 100) return
                    //
                    // const _step = 400 / 10; let _top = 0;
                    // let jump = () => {
                    //     setTimeout(_ => {
                    //         if(_top < 400){
                    //             _top = _top+_step
                    //             container.scrollTop = Math.min(_top, 400);
                    //             jump()
                    //         }
                    //     },50)
                    // }
                    // jump()
                })
            },
            changeType(type){
                this.type = type
            },

            prev(){
                this.$emit('prev')
            },
            next(){
                this.$emit('next')
            }
        }
    }
</script>

<style scoped lang="less">
    .prediction-footer{
        display: block;
        margin-top: 50px;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        /*padding: 0 60px;*/
        &-normal{
            position: inherit;
            padding: 0 0 20px 0;
            /*.prediction-footer-nav{*/
            /*    padding: 0 60px;*/
            /*}*/
        }
        &-nav{
            .active{
                background: #F0B80B;
            }
            div{
                height: 40px;
                display: inline-block;
                color: #fff;
                font-weight: 600;
                font-size: 16px;
                line-height: 40px;
                margin-right: 20px;
                padding: 0 22px 0 18px;
                cursor: pointer;
                border-top-left-radius: 16px;
                border-top-right-radius: 16px;
                transition: all .2s;
                border: 1px solid #D8A031;
                background: #2C3035;
                &:hover{
                    background: #F0B80B;
                }
                img{
                    width: 30px;
                    height: 30px;
                    margin-right: 2px;
                    vertical-align: middle;

                }
            }

        }
        section{
            padding-top: 20px;
        }
    }
    .prediction-footer-m{
        display: none;
    }
    @media (max-width: 768px){
        .prediction-footer{
            &-nav{
                display: none;
            }
            &-body{
                width: 100%;
                height: calc(100% - 100px);
                position: fixed;
                bottom: 0;
                left: 0;
                z-index: 8;
                padding-top: 0px !important;
            }
        }
        .prediction-footer-m{
            display: block;
            width: 100%;
            height: 60px;
            position: fixed;
            bottom: 0;
            left: 0;
            background: #fff;
            display: flex;
            align-items: center;
            padding: 0 15px;
            box-sizing: border-box;
            &-left{
                width: 28px;
                transform: rotate(180deg);
            }
            &-right{
                width: 28px;
                position: absolute;
                right: 15px;

            }
            &-center{
                background: #EAEAEA;
                height: 40px;
                border-radius: 20px;
                display: flex;
                transform: translateX(-63%);
                div{
                    border-radius: 20px;
                    height: 100%;
                    align-items: center;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    i{
                        font-size: 24px;
                        color: #F0B80B;
                    }
                }
                .active{
                    background: #F0B80B;
                    i{
                        color: #fff;
                    }
                }
            }
        }
    }
</style>
