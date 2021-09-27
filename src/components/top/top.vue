<template>
<div class="top-wrap">
    <div class="header">
        <div class="logo-box">
            <a-icon class="_icon-menu"
                :type="isCollapse ? 'icon-open': 'icon-menu-open'"
                @click="menuClick"/>
            <img
                class="web"
                src="../../assets/images/logo/burger_logo.svg"
                alt=""
            />
            <img
                class="h5"
                src="../../assets/images/logo/h5-logo.png"
                alt=""
                @click="$router.push('/')"
            />
        </div>
        <div class="center">
            <div :class="['wallet-address', { connected: $store.state.isConnect }]">
                <div v-if="!isConnect" @click="handleConnect">
                    <img
                        class="binance-logo"
                        :src="imgSrc"
                        alt=""
                    />
                    <span>{{$t('Main.WalletNotConnected')}}</span>
                </div>

                <div v-else @click="show">
                    <img
                        class="binance-logo"
                        :src="imgSrc"
                        alt=""
                    />
                    <template v-if="actionCache.filter(t=>t.code === 0).length>0">
                    {{actionCache.filter(t=>t.code === 0).length}} Pending....
                    </template>
                    <span class="account" v-else>{{addressNumFilter(account)}}</span>
                </div>
            </div>
        </div>
    </div>

    <Connect
        v-if="isOpen"
        :isInstall="isInstall"
        @connect="connect"
        @closeModal="closeModal"
    ></Connect>
    <DialogTop
        :account="account"
        :visible.sync="visible"
        @close="close"
        @isLogin="isLogin"
    ></DialogTop>
</div>
</template>

<script>
import ChainApi from '../../../static/sdk/ChainApi.js';
import {mapGetters, mapState} from 'vuex';
import Connect from '../connect/connect';
import Logo from '../Logo';
import GlobalConfig from './GlobalConfig';
import LinkMore from './LinkMore';
import {SwapInstance} from '@/assets/swap.init';
import DialogTop from './Dialog-top';

export default {
    components: {Logo, Connect, GlobalConfig, LinkMore, DialogTop},
    inject: ['reload'],
    props: ['isHome'],
    name: 'Top',
    data() {
        return {
            idx: 0,
            lang_show: false,
            isOpen: false,
            isReady: true,
            walletAddress: '',
            langList: {
                zh: this.$t('Main.Zh'),
                en: this.$t('Main.En'),
            },
            lang: localStorage.getItem('lang') || 'en',
            visible: false,
            isCollapse: false,
            imgSrc: require('../../assets/images/image/icon-eth-logo.svg')
        };
    },
    watch: {
        $route: {
            handler() {
            },
            immediate: true,
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        close() {
            this.visible = false;
        },
        change() {
            this.$store.commit('theme', !this.$store.state.theme);
            this.$store.state.rootEl.className = this.$store.getters.theme;
        },
        //初始化
        init() {
            // console.error('this.isConnect---->', this.isConnect, this.chainId)
            //注册
            this.onChainStatus();
            this.onChainChanged();
            this.onAccountsChanged();
            //链接chain
            // this.connectChain();
            this.connect('m');

        },
        //注册
        onChainStatus() {
            ChainApi.onChainStatus(this.handleChainStatus);
        },
        //链接chain
        connectChain() {
            // ChainApi.connect();
            // ChainApi.connectChain();
            // SwapInstance.onInit(ChainApi.web3());

            console.log('链接chain-------->')
            this.$store.dispatch('connect', 'm').then((isConnect) => {
                // isConnect && this.$store.dispatch('poolList');
                // this.closeModal(false);
                console.error('链接chain', isConnect, this.chainId)
                this.handleChainChanged(this.chainId)

                // console.error('链接chain', isConnect)
            });
        },
        //返回状态
        handleChainStatus(status) {
            // console.log('test handleChainStatus:', status);
            if (status) {
                //console.log('连接成功');
                this.$store.commit('isInstall', true);
                this.isOpen = !this.account;
            } else {
                //console.log('未安装')
                this.$store.commit('isInstall', false);
                this.isOpen = true;
            }
        },

        handleChainChanged(chainId) {
            console.error("handleChainChanged=======>", chainId)
            if (!chainId) {
                return;
            }
            chainId = Number(chainId)
            let cache = this.chainId;

            if (chainId != cache && cache) {
                this.reload();
            }
            if (ChainApi.web3()) {
                SwapInstance.onInit(ChainApi.web3());
            }
            this.imgSrc = chainId === 97 || chainId === 56 ?
                require('../../assets/images/image/icon-binance-wallet.svg') :
                require('../../assets/images/image/icon-eth-logo.svg');
        },
        //监听链
        onChainChanged() {
            ChainApi.onChainChanged(this.handleChainChanged);
            console.error('onChainChanged');
        },
        //监听钱包
        onAccountsChanged() {
            // console.log('onAccountsChanged');
            ChainApi.onAccountsChanged(this.handleNewAccounts);
        },
        handleNewAccounts(acc) {
            console.log('handleNewAccounts:', acc);
            if (!acc.length) {
                sessionStorage.removeItem('account');
                console.log('handleNewAccounts removeItem');
                return;
            }

            let user = this.account;

            // debugger
            if (acc.length) {
                if (user !== null) {
                    if (user === acc[0]) {
                        console.log('handleNewAccounts no changes');
                        return;
                    } else {
                        this.$store.commit('account', acc[0]);
                        console.log('handleNewAccounts changes');
                        this.reload();
                    }
                }
            }
            if (user !== null) {
                console.log('handleNewAccounts connect');
                this.$store.dispatch('connect');
            }
        },
        //连接钱包
        handleConnect() {
            this.isOpen = true;
        },
        closeModal(res) {
            this.isOpen = res;
        },
        show() {
            this.visible = true;
        },
        connect(type) {
            this.$store.dispatch('connect', type).then((isConnect) => {
                console.error('connect=======>', isConnect)
                isConnect && this.$store.dispatch('poolList');
                // this.$store.commit('setLoginStatus', true);
                this.closeModal(false);
            });
        },
        menuClick() {
            this.isCollapse = !this.isCollapse;
            this.$emit('menu-send', this.isCollapse);
        },
        isLogin() {
            if (!sessionStorage.getItem('account')) {
                this.isOpen = true;
            }
        }
    },
    computed: {
        ...mapState({
            chainId: 'chainId',
            account: 'account',
            isInstall: 'isInstall',
            isConnect: 'isConnect',
            ...mapGetters(['actionCache']),
        }),
    },
};
</script>
<style lang="less" scoped>
    ._icon-menu {
        font-size: 20px;
        color: #ffffff;
        margin-right: 33px;
    }

    .beta {
        font-weight: bold;
        color: #f0b80b;
        font-size: 12px;
        padding-left: 10px;
    }

    .icon-platform {
        width: 36px;
        height: 36px;
        margin-left: 10px;
    }

    .right-container,
    .center {
        display: flex;
        align-items: center;
    }

    .center {
        .binance-logo {
            margin-left: -10px;
        }

        img {
            height: 30px;
            margin-left: 10px;
            cursor: pointer;
        }
    }

    .top-wrap {
        width: 100%;
        height: 100px;
        background-color: var(--col-body-background);
        z-index: 2;
        border-bottom: 1px solid #343E4A;
        padding: 0 24px;

        .header {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .logo-box {
                display: flex;
                align-items: center;
                cursor: pointer;

                img {
                    height: 53px;
                }

                .web {
                    display: block;
                }

                .h5 {
                    display: none;
                }
            }
        }

        .wallet-address {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 180px;
            padding: 0 15px;
            height: 40px;
            background-color: var(--col-main-1);
            border-radius: 20px;
            font-size: 14px;
            color: var(--col-font);
            white-space: nowrap;
            transition: all .2s;

            &:hover {
                background-color: rgba(#FBCE45, .2);
            }

            & > div {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            img {
                height: 30px;
                margin-right: 5px;
            }

            &.connected::before {
                background-color: #26a17b;
            }
        }

        .sidebar {
            font-size: 36px;
        }
    }

    .analyis-link {
        display: flex;
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        .analyis {
            color: var(--col-main-ghost);
        }
    }

    .account {
        display: flex;
        align-items: center;
        line-height: 1;
    }

    @media (min-width: 1200px) {
        .mobile-hide {
            //display: block;
        }
    }

    @media (max-width: 768px) {
        .top-wrap {
            /*font-size: 16px;*/
            padding: 26px 24px;

            .header {
                height: 48px;
            }

            .header {
                height: 48px;

                .logo-box {
                    .web {
                        display: none;
                    }

                    .h5 {
                        display: block;
                    }
                }
            }

            .wallet-address {
                min-width: 180px;
                border-radius: 24px;
                position: initial;
                font-size: 14px;
                transform: translateX(0);
            }

            .sidebar {
                display: none;
            }
        }
    }
</style>


