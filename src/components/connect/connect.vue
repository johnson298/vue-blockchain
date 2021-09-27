<template>
<div class="dialog-main">
    <div class="dialog-bg" @click="closeModal" style="display: block"></div>
    <div class="dialog" style="display: block">
        <div class="dialog-wrap">
            <div class="dialog-top">
                <span>Connect to a wallet</span>
                <i class="icon-close" @click="closeModal"></i>
            </div>
            <div class="dialog-content">
                <div class="wallet-box" @click="connect('m')">
                    <span class="wallet-name">Metamask</span>
                    <img src="../../assets/images/wallet/Metamask.svg" alt=""/>
                </div>

                <div class="wallet-box" @click="connect('m')">
                    <span class="wallet-name">TrustWallet</span>
                    <img src="../../assets/images/wallet/TrustWallet.svg" alt=""/>
                </div>

                <div class="wallet-box" @click="connect('m')">
                    <span class="wallet-name">MathWallet</span>
                    <img src="../../assets/images/wallet/MathWallet.svg" alt=""/>
                </div>

                <div class="wallet-box" @click="connect('m')">
                    <span class="wallet-name">TokenPocket</span>
                    <img src="../../assets/images/wallet/TokenPocket.svg" alt=""/>
                </div>

                <div class="wallet-box" @click="connect('w')">
                    <span class="wallet-name">WalletConnect</span>
                    <img src="../../assets/images/wallet/WalletConnect.svg" alt=""/>
                </div>

                <div class="wallet-box" @click="connect('b')">
                    <span class="wallet-name">Binance Chain Wallet</span>
                    <img src="../../assets/images/wallet/BinanceChainWallet.svg" alt=""/>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: 'Connect',
    props: ['isInstall'],
    data() {
        return {};
    },
    created() {
        // console.log(this.isInstall, 'this.isInstall');
    },
    mounted() {
    },
    methods: {
        //连接
        connect(type) {
            this.$emit('connect', type);
        },
        closeModal() {
            this.$emit('closeModal', false);
        },
    },
    computed: {
        ...mapState({
            account: 'account',
            isConnect: 'isConnect',
        }),
    },
};
</script>

<style lang="less" scoped>
    .dialog-bg {
        width: 100%;
        height: 100%;
        background: rgba(35, 39, 59, 0.4);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        display: none;

        &.open {
            display: block;
        }
    }

    .dialog {
        width: 380px;
        background: #ffffff;
        box-shadow: 0 0 10px 4px rgba(39, 88, 53, 0.06);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2020;
        display: none;
        border-radius: 10px;

        &.open {
            display: block;
        }

        .dialog-wrap {
            overflow: hidden;

            .dialog-top {
                position: relative;
                height: 60px;
                padding: 0 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 36px;
                color: #212833;
                font-weight: 500;
                border-bottom: 1px solid rgb(233, 234, 235);

                .icon-close {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url("../../assets/images/image/close.svg") no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                }
            }

            .dialog-content {
                min-height: 230px;
                padding: 24px;
                font-size: 16px;

                .wallet-box {
                    height: 48px;
                    border-radius: 10px;
                    color: #F0B80B;
                    background: #EEEEEE;
                    padding: 0 24px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all .2s;

                    &:hover {
                        background-color: #F0F4F5;
                    }

                    img {
                        height: 24px;
                        width: 24px;
                        border-radius: 4px;
                    }
                }
            }

            .footer {
                padding: 30px;

                .connect-btn {
                    height: 60px;
                    width: 100%;
                }
            }
        }
    }

    @media (max-width: 960px) {
        .dialog {
            width: 358px;
            background: #ffffff;
            box-shadow: 0 0 10px 4px rgba(39, 88, 53, 0.06);
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1001;
            display: none;

            &.open {
                display: block;
            }

            .dialog-wrap {
                overflow: hidden;

                .dialog-top {
                    position: relative;
                    height: 73px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 20px;
                    border-bottom: 1px solid rgb(233, 234, 235);
                    color: #212833;

                    .icon-close {
                        display: block;
                        width: 14px;
                        height: 14px;
                        background: url("../../assets/images/image/close.svg") no-repeat;
                        background-size: 100% 100%;
                        cursor: pointer;
                    }
                }

                .dialog-content {
                    padding: 24px;
                    min-height: 225px;

                    .wallet-box {
                        img {
                            height: 24px;
                            width: 24px;
                        }
                    }
                }

                .footer {
                    margin-top: 20px;

                    .connect-btn {
                        height: 60px;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
