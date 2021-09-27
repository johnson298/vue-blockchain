<template>
    <div class="_farm-pools-container">
        <ifo-title :title="$t('Ifo.farmTitle')" :subTitle="$t('Ifo.farmSubTitle')"></ifo-title>
        <Tabs :tabsList="tabsList" :active="activeIndex" @tab="tabClick"></Tabs>
        <a-loading :loading="load">
            <template v-if="isLogin">
                <template v-for="(item, index) in list">
                    <div class="_farm-list-pd">
                        <farm-list :data="item"></farm-list>
                        <img src="~img/pool-down.svg" @click="handleShow(index)" alt="" class="_farm-list-pd-img" :class="{'_farm-list-pd-img-fan': findActive(index)}">
                    </div>
                    <transition name="normal-expand">
                        <div class="_pool-flex" v-show="!findActive(index) || isShowAll">
                            <template v-for="el in poolObject[item.factory]">
                                <div>
                                    <farm-card :data="el" :walletAddress="walletAddress"
                                               :endStatus="item.status"></farm-card>
                                </div>
                            </template>
                        </div>
                    </transition>
                </template>
            </template>
            <template v-if="!isLogin || !list.length">
                <empty></empty>
            </template>
        </a-loading>
    </div>
</template>

<script>
    import FarmList from './Component/Farm-List'
    import FarmCard from './Component/Farm-Card';
    import ChainApi from '../../../../static/sdk/ChainApi';
    import Empty from '../../../components/Empty';
    import IfoTitle from '../LaunchPad/Component/ifo-title';
    import Tabs from '../../../components/Tabs';
    import {mapGetters} from 'vuex';

    export default {
        name: 'LaunchPool',
        components: {Empty, FarmList, FarmCard, IfoTitle, Tabs},
        data() {
            return {
                walletAddress: '',
                load: true,
                poolObject: {},
                isEnd: false,
                list: [],
                comList: [],
                endList: [],
                tabsList: [
                    {
                        name: 'next',
                        label: 'Ifo.inProgress',
                        active: 1
                    },
                    {
                        name: 'past',
                        label: 'Ifo.completed',
                        active: 2
                    }
                ],
                activeIndex: 1,
                active: [],
                isShowAll: true
            }
        },
        computed: {
            ...mapGetters({'isLogin': 'getLoginStatus'}),
        },
        mounted() {

            this.init();
        },
        methods: {
            findActive(index){
                return this.active.includes(index)
            },
            init() {
                ChainApi.getAccounts().then(res => {
                    this.walletAddress = res[0];
                });
                this.getData({name: 'next', active: 1});
            },
            handleShow(index){
                this.isShowAll = false;
                if(this.active.includes(index)) {
                    this.active = this.active.filter(res => res != index)
                }else{
                    this.active.push(index)
                }
            },
            getData(params) {
                this.$swap.loginStatus().subscribe(isLogin => {
                    if (isLogin) {
                        ChainApi.projectFactoryList().then(async res => {
                            console.warn('res....', res)
                            if (res) {
                                const time = new Date().getTime();
                                for (let item of res) {
                                    this.poolObject[item.factory] = await this.getPoolLists(item);
                                    // this.poolObject[item.factory] = {}
                                    // for (let k in pools) {
                                    //     this.poolObject[item.factory][pools[k].pool.toLowerCase()] = pools[k]
                                    // }
                                }
                                this.comList = res.filter(d => d.status <= 1);
                                this.endList = res.filter(d => d.status === 2);
                                this.tabClick(params);
                                this.load = false;
                                this.$forceUpdate()
                            }
                        }).catch(e => {
                            console.error('error====>', e)
                            this.load = false;
                        }).finally(() => {
                            this.load = false;
                        });
                    } else {
                        this.load = false;
                    }
                })
            },
            // compare(property) {
            //     return function (a, b) {
            //         return a[property] - b[property]
            //     }
            // },
            getPoolLists(pool) {
                return ChainApi.projectPoolList(pool).then(res => {
                    if (res) {
                        return res;
                    }
                })
            },
            tabClick($event) {
                this.activeIndex = $event.active;
                this.list = $event.name === 'next' ? this.comList : this.endList;
                console.log('this.list.....', this.list)
            }
        }
    }
</script>

<style scoped lang="less">
    ._farm-pools-container {
        margin-bottom: 50px;
    }

    ._farm-list-pd {
        padding: 0 10px;
        position: relative;
        &-img{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            /*top: 136px;*/
            bottom: 16px;
            cursor: pointer;
            transition: all .4s;
            transform-origin: center center;
            &-fan{
                transform: translateX(-50%) rotate(-180deg);
            }
        }
    }

    ._pool-flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow-y: hidden;
        & > div {
            /*margin-right: 12px;*/
            margin: 0 10px 32px;

            /*&:nth-of-type(3n) {*/
            /*    margin-right: 0;*/
            /*}*/
        }
    }

    @media (max-width: 768px) {
        ._pool-flex {
            justify-content: center;

            & > div {
                margin-right: 0;
            }
        }
        ._farm-list-pd-img{
            width: 13px;
            bottom: 12px;
        }
    }
</style>
