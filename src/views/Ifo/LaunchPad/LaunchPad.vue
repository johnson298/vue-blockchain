<template>
    <div class="_flex-card">
        <ifo-title :title="$t('Ifo.title')" :subTitle="$t('Ifo.subTitle')"></ifo-title>

        <Tabs :tabsList="tabsList" :active="activeIndex" @tab="tabClick"></Tabs>

        <a-loading :loading="loading">
            <div class="start" v-for="(item,index) in comList" v-if="activeIndex === 1">
                <launch-pad-card
                    :key="index"
                    :item="item"
                    :walletAddress="walletAddress"
                    @update="upDate"/>
            </div>
            <div class="end" v-for="(item,index) in endList" v-if="activeIndex === 2">
                <launch-pad-card
                    :key="index"
                    :item="item"
                    :walletAddress="walletAddress"
                    @update="upDate"/>
                <empty v-if="!endList.length"></empty>
            </div>
            <coming-soon v-if="!comList.length && activeIndex === 1"/>
            <empty v-if="!endList.length && activeIndex === 2"></empty>
        </a-loading>

        <project-rules></project-rules>
        <apply-now></apply-now>
    </div>
</template>

<script>
import LaunchPadCard from './Component/launch-pad-card';
import ChainApi from '../../../../static/sdk/ChainApi';
import Empty from '../../../components/Empty';
import ProjectRules from './Component/project-rules';
import IfoTitle from './Component/ifo-title';
import Tabs from '../../../components/Tabs';
import {mapGetters, mapState} from 'vuex';
import ComingSoon from '../../../components/ComingSoon';
import ApplyNow from './Component/apply-now'

export default {
    components: {ComingSoon, IfoTitle, ProjectRules, Empty, LaunchPadCard, Tabs, ApplyNow},
    name: 'LaunchPad',
    data() {
        return {
            loading: false,
            walletAddress: '',
            comList: [],
            endList: [],
            tabsList: [
                {
                    name: 'next',
                    label: 'MainView.NextPage',
                    active: 1
                },
                {
                    name: 'past',
                    label: 'MainView.PastPage',
                    active: 2
                }
            ],
            activeIndex: 1,
            isEnd: false,
            isWhite: true
        };
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
        }),
        ...mapGetters({'isLogin': 'getLoginStatus'}),
    },
    watch: {
        isConnect() {
            this.init();
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if (this.isConnect) {
                ChainApi.getAccounts().then(res => {
                    this.walletAddress = res[0];
                });
                this.getData({name: 'next', active: 1});
            } else {
                this.comList = [];
                this.endList = [];
            }
        },
        getData(params) {
            this.loading = true;
            ChainApi.ifoList().then(res => {
                this.loading = false;
                console.log('res==>', res)
                if (res && res.length) {
                    for (let d of res) {
                        if (d.status < 2) {
                            this.comList.push(ChainApi.ifoPools[d.pool.toLowerCase()]);
                        } else if (d.status === 2) {
                            this.endList.push(ChainApi.ifoPools[d.pool.toLowerCase()]);
                        }
                    }
                }
                this.loading = false;
                this.tabClick(params)
            }).catch(e => {
                this.loading = false;
            }).finally(() => {
                this.loading = false;
            });
        },
        tabClick($event) {
            this.activeIndex = $event.active;
        },
        upDate() {
            this.getData({name: 'next', active: 1});
        }
    }
};
</script>

<style scoped lang="less">
    ._flex-card > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
