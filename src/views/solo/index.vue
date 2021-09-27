<template>
    <div class="solo">
        <solo-head :data="shackStatistics"/>
        <a-loading :loading="liquidityLoading">
            <div class="solo-list" v-for="(item,index) in poolsList" :key="item.name">
                <shack-list :data="item" :index="index" :doubt-show-index.sync="doubtShowIndex" :active-root.sync="activeRoot" />
            </div>
            <p class="solo-tip">{{$t('Solo.ShackTip')}}</p>
        </a-loading>
    </div>
</template>

<script>
    import soloHead from './modules/header.vue'
    import ShackList from './modules/shackList.vue'
    import ChainApi from '../../../static/sdk/ChainApi';
    import {mapState} from "vuex";

    export default {
        name: "Solo",
        components: {soloHead, ShackList},
        data() {
            return {
                doubtShowIndex: -1,
                activeRoot: '',
                shackStatistics: {},
                liquidityLoading: true,
                poolsList: []
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

        created() {
            this.init()
        },

        methods: {
            init(){
                if(this.isConnect) {
                    this.shackStatistics = ChainApi.shackStatistics;
                    this.getShackList()
                }else{
                    this.poolsList = []
                }
            },

            getShackList() {
                this.liquidityLoading = true;
                ChainApi.shackGetPools().then(res => {
                    console.log(res)
                    this.liquidityLoading = false;
                    this.poolsList = res
                })
            },
        }
    }
</script>
<style scoped lang="less">
    .solo {

        &-list {
            background: #2C3035;
            margin-bottom: 24px;
            box-shadow: 0px 10px 30px 10px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            padding: 0 34px;
        }
        &-tip{
            width: 100%;
            font-weight: 500;
            font-size: 12px;
            line-height: 12px;
            color: rgba(#fff,.6);
            text-align: center;
            position: absolute;
            bottom: -70px;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    @media (max-width: 768px) {
        .solo{
            padding-bottom: 100px;
            position: relative;
            top: -10px;
            &-tip{
                font-size: 12px;
                line-height: 24px;
                color: rgba(#fff,.6);
                text-align: center;
                position: absolute;
                bottom: 0px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .solo-list {
            padding: 0 18px;
            position: relative;
        }
    }
</style>
