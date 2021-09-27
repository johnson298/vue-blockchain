<template>
    <div class="prediction-footer">
        <div class="prediction-footer-nav">
            <div><img src="~img/prediction/chart.svg" alt="" >Chart</div>
            <div><img src="~img/prediction/history.svg" alt="" >Your History</div>
        </div>
        <section>
            <!--        <chart />-->
            <history />
        </section>
    </div>
</template>

<script>
    import Chart from './modules/charts.vue'
    import History from './modules/history.vue'
    export default {
        name: "index",
        components: {Chart, History},
        data(){
            return{

            }
        },

        created() {
        },

        mounted() {

        },

        methods:{


        },
        beforeDestroy() {

        }
    }
</script>

<style scoped lang="less">
    .prediction-footer{
        width: 100%;
        /*position: absolute;*/
        /*bottom: 0;*/
        &-nav{
            div{
                height: 48px;
                display: inline-block;
                color: #fff;
                font-weight: 600;
                font-size: 24px;
                line-height: 30px;
                margin-right: 100px;
            }
            img{
                width: 30px;
                height: 30px;
                margin-right: 13px;
                vertical-align: bottom;
            }
        }
        section{
            padding-top: 48px;
        }
    }
</style>
