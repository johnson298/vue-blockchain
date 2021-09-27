<template>
<div class="nav-link" :class="[type]">
    <el-menu
        :collapse-transition="false"
        active-text-color="#FFFFFF"
        :default-active="activeIndex"
        class="menu dis-over-auto"
        :collapse="isCollapse"
        router
    >
        <el-submenu
            v-for="(item, index) in list"
            v-if="!!item.subMenu"
            :key="index"
            :index="index + ''"
        >
            <template slot="title">
            <a-icon class="icon" :type="item.icon"/>
            <span :class="[{'_menu-text': isCollapse}]"> {{$t(item.title)}}</span>
            </template>
            <template v-for="(child, ind) in item.subMenu">
            <el-menu-item v-if='child.isRoute' :key="ind" :index="child.path" @click="routerClick">
                <span class="_menu-line" v-if="activeIndex === child.path"></span>
                <span slot="title">{{ $t(child.title) }}</span>
            </el-menu-item>

            <a v-else :href="child.path ==='/doc' ? docUrl : child.path" target="_blank"
                class="_link-a">
                <el-menu-item>
                    {{$t(child.title)}}
                </el-menu-item>
            </a>
            </template>
        </el-submenu>
        <el-menu-item v-else :index="item.path" @click="routerClick">
            <a-icon class="icon" :type="item.icon"/>
            <span slot="title" :class="[{'_menu-text': isCollapse}]">
                {{ $t(item.title) }}<img src="~img/hotNew.svg" class="_tag-new" v-if="item.tag" />
            </span>
            <span class="_menu-line" v-if="activeIndex === item.path"></span>
<!--            <span class="_tag" v-if="item.tag">NEW</span>-->
<!--            -->
        </el-menu-item>
    </el-menu>
</div>
</template>

<script>
import {swapHelper} from '@/store/swap.module';

export default {
    name: 'NavLink',
    props: ['type', 'isCollapse', 'lang'],
    data() {
        return {
            activeIndex: this.$route.path,
            isShow: true,
            docUrl: this.lang === 'ZH' ? 'https://burgerswap.gitbook.io/burgerswap-cn-1/' : 'https://burgerswap.gitbook.io/burgerswap-en/',
            navApp: [
                {
                    path: '/trade',
                    name: 'SwapIndex',
                    title: 'MainView.Trade',
                    extra: true,
                    icon: 'icon-swap',
                    isSubMenu: true,
                    isShow: this.isShow,
                    tag: false,
                    subMenu: [
                        {
                            path: '/trade/swap',
                            name: 'SwapIndex',
                            title: 'MainView.Swap',
                            isRoute: true
                        },
                        {
                            path: '/trade/pool',
                            name: 'SwapPool',
                            title: 'MainView.Pool',
                            isRoute: true,
                        },
                    ]
                },
                {
                    path: '/governance',
                    name: 'Governance',
                    title: 'Nav.Government',
                    icon: 'icon-governance',
                    isSubMenu: false,
                    isShow: this.isShow,
                    tag: false,
                },
                {
                    path: '/shack',
                    name: 'Solo',
                    title: 'Solo.Title',
                    icon: 'icon-shack',
                    isSubMenu: false,
                    isShow: this.isShow,
                    tag: false,
                    // subMenu: [
                    //     {
                    //         isRoute: true,
                    //         path: '/shack',
                    //         name: 'Solo',
                    //         title: 'Solo.Title',
                    //     },
                    //     {
                    //         isRoute: true,
                    //         path: '/xburger-shack',
                    //         name: 'Xburger-shack',
                    //         title: 'XBurger Shack',
                    //     }
                    // ]
                },
                {
                    path: '/xburger-pool',
                    name: 'Xburgershack',
                    title: 'MainView.XBurgerShack',
                    icon: 'icon-pool',
                    isSubMenu: false,
                    tag: false,
                },
                {
                    path: '/farms',
                    name: 'Farms',
                    title: 'MainView.Farms',
                    icon: 'icon-farms',
                    isSubMenu: false,
                    tag: false,
                },
                {
                    path: '/transit',
                    name: 'Transit',
                    title: 'MainView.Transit',
                    icon: 'icon-bridge',
                    isSubMenu: true,
                    isShow: this.isShow,
                    tag: false,
                    subMenu: [
                        {
                            isRoute: true,
                            path: '/transit',
                            name: 'Transit',
                            title: 'MainView.Bridge'
                        },
                        {
                            isRoute: false,
                            path: 'https://cb.burgerswap.org/',
                            title: 'MainView.BurgerBridge'
                        },
                        {
                            isRoute: false,
                            path: 'https://www.binance.org/en/bridge',
                            title: 'MainView.BinanceBridge'
                        }
                    ]
                },
                {
                    path: '/lending',
                    name: 'LendingIndex',
                    title: 'MainView.Lending',
                    icon: 'icon-lending',
                    isSubMenu: true,
                    tag: false,
                    subMenu: [
                        {
                            path: '/lending/pool',
                            name: 'LendingIndex',
                            isRoute: true,
                            title: 'Nav.Pool',
                            icon: 'icon-Home',
                        },
                        {
                            path: '/lending/liquidation',
                            name: 'Liquidation',
                            title: 'Nav.Liquidation',
                            isRoute: true,
                            icon: 'icon-compute',
                        },
                        {
                            path: '/lending/my',
                            name: 'My',
                            title: 'Nav.My',
                            isRoute: true,
                            icon: 'icon-account',
                        },
                    ]
                },
                {
                    path: '/ifo',
                    name: 'Ifo',
                    title: 'MainView.Ifo',
                    icon: 'icon-ifo',
                    isSubMenu: false,
                    tag: false,
                },
                {
                    path: '',
                    name: 'Info',
                    title: 'MainView.Info',
                    icon: 'icon-info',
                    isSubMenu: true,
                    tag: false,
                    subMenu: [
                        {
                            isRoute: false,
                            path: 'https://info.burgerswap.org/',
                            title: 'MainView.Analytics'
                        },
                        // {
                        //     isRoute: true,
                        //     path: '/home',
                        //     name: 'Home',
                        //     title: 'MainView.My'
                        // },
                        {
                            isRoute: false,
                            path: 'https://doc.burgerswap.org/',
                            title: 'MainView.OpenApi'
                        },
                        {
                            isRoute: false,
                            path: '/doc',
                            title: 'MainView.Doc'
                        },
                    ]
                },
                {
                    path: '/prediction',
                    name: 'Prediction',
                    title: 'MainView.Prediction',
                    icon: 'icon-prediction',
                    isSubMenu: false,
                    tag: true
                }
            ],
            list: []
        };
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                if (val.path.indexOf('/lending/pool') !== -1) {
                    this.activeIndex = '/lending/pool';
                } else {
                    this.activeIndex = val.path;
                }
            },
            deep: true
        },
        lang: {
            handler(val) {
                this.docUrl = val === 'ZH' ? 'https://burgerswap.gitbook.io/burgerswap-cn-1/' : 'https://burgerswap.gitbook.io/burgerswap-en/';
            },
            deep: true
        }
    },
    computed: {
        ...swapHelper.mapGetters({
            'ver': 'ver'
        })
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            console.log('lang====>', this.lang)
            const hideList = ['/prediction'];
            if (window.location.host === 'burgerswap.org' || window.location.host === 'ipfs.io') {
                this.list = this.navApp.filter(item => !hideList.includes(item.path))
            } else {
                this.list = this.navApp;
            }
        },
        routerClick() {
            this.$emit('mobile')
        },
    }
};
</script>

<style lang="less" scoped>
    .menu {
        background-color: transparent;
        border-right: 0;

        & > .el-menu-item,
        & > .el-submenu {
            /*border-bottom: 1px solid rgba(#ffffff, .1);*/
            min-height: 48px;

            & > .el-menu {
                background-color: rgba(#1F2226, .6);
            }
        }

        /deep/ & > .el-submenu > .el-menu {
            background-color: #24282C;

            li {
                font-size: 14px;
                font-weight: 400;

                span {
                    font-size: 14px;
                    font-weight: 400;
                }
            }
        }
    }

    ._link-a {
        color: inherit;
        font-size: 14px;
    }

    ._tag {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #8FC31F;
        border-radius: 0 10px 0 10px;
        height: 22px;
        width: 80px;
        font-size: 14px;
    }
    ._tag-new{
        margin-left: 20px;
        margin-top: -2px;
    }

    /deep/ .el-submenu__title,
    /deep/ .el-menu-item {
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        padding: 0 24px !important;
        &:hover{
            color: var(--col-main) !important;
        }

        .icon {
            margin-right: 8px;
        }

        &.is-active {
            color: var(--col-main) !important;
            /*color: #ffffff;*/
        }

        &:hover,
        &:focus {
            background-color: transparent;
            color: inherit;

            i {
                color: inherit;
            }
        }
    }

    /deep/ .el-tooltip {
        display: inline-flex !important;
        justify-content: center !important;
        align-items: center !important;
    }

    /deep/ .el-submenu .el-menu-item {
        padding-left: 48px !important;
    }

    ._menu-line {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        display: block;
        width: 4px;
        height: 24px;
        background-color: var(--col-main);
    }

    .nav-link {
        color: var(--col-label60);
        font-weight: 700;
        font-size: 24px;
        margin-top: 24px;
        margin-bottom: 24px;
        max-height: calc(100% - 240px);
        overflow-y: auto;
        overflow-x: hidden;

        .router-link-active {
            color: var(--col-main);

            /deep/ .el-menu-item {
                color: var(--col-main);

                &.is-active {
                    color: var(--col-main);
                }
            }
        }
    }
</style>
