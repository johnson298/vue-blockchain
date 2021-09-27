<template>
<el-dialog
    :append-to-body="true"
    class="dialog-madel pd-0"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
>
    <div class="pd">
        <div class="dialog-title _wallet-title">
            <span class="title-account">{{ $t('AccountInfoUI.Account') }}</span>
        </div>
        <div class="dialog-body">
            <p class="connect-account">{{ $t('AccountInfoUI.Connected') }}</p>
            <p class="hash">{{ account | hash }}</p>
            <div class="bsc-scan">
                <div
                    class="copy copy-btn"
                    @click="copyClick"
                    :data-clipboard-text="account"
                >
                    {{ $t('AccountInfoUI.copy_btn') }}
                </div>
                <div class="open" @click="winOpen">{{ $t('submit.View') }}</div>
                <div class="copy open" @click="logoutClick">{{$t('Main.LogOut')}}</div>
            </div>
        </div>
    </div>

    <div class="history-box">
        <template v-if="actionCache.length">
        <div class="clear-box">
            <span class="left">{{ $t('AccountInfoUI.Recent') }}</span>
            <div class="clear-history" @click="clearClick">
                {{ $t('AccountInfoUI.clear_btn') }}
            </div>
        </div>
        <div v-for="item in actionCache" class="history" :key="item.timestamp">
            <span class="left" @click="winAddress(item)">{{item.params.describe}}</span>
            <span class="state">
                <img :src="iconMap[item.code] || iconMap.default" alt=""/>
            </span>
        </div>
        </template>
    </div>
    <div v-if="!actionCache.length" class="dialog-footer">
        Your transactions will appear here...
    </div>
</el-dialog>
</template>

<script>
import * as Clipboard from 'clipboard';
import {mapGetters} from 'vuex';
import ChainApi from '../../../static/sdk/ChainApi.js';

export default {
    name: 'Dialog-top',
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        account: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            iconMap: {
                0: require('../../assets/images/pending.svg'),
                1: require('../../assets/images/success.svg'),
                4: require('../../assets/images/success.svg'),
                default: require('../../assets/images/error.svg'),
            },
        };
    },
    watch: {
        actionCache: {
            handler() {
                this.refreshTokenList()
            },
            deep: true,
        }
    },

    computed: {
        ...mapGetters(['actionCache']),
    },
    methods: {
        close() {
            this.$emit('close', false);
        },
        clearClick() {
            this.$store.commit('clearActionCache');
        },
        winAddress(data) {
            window.open(this.$swap.getBscscanTx(data.result));
        },
        copyClick() {
            // const clipboard = new Clipboard('.copy-btn');

            let clipboard = new Clipboard('.copy-btn', {
                text: function () {
                    return 'text';
                }
            });

            clipboard.on('success', function (e) {
                console.log('clipboard====>', e);
            });
            this.$message({
                message: this.$t('AccountInfoUI.copySuccess'),
                showClose: true,
                type: 'success',
            });
        },
        winOpen() {
            this.$store
                .dispatch('bsc', {
                    account: this.account,
                })
                .then((res) => {
                    window.open(res);
                });
        },
        logoutClick() {
            ChainApi.disconnect();
            this.close();
            this.$store.commit('account', '');
            this.$store.commit('isConnect', false);
            this.$emit('isLogin');
        },
        refreshTokenList(){
            if(!this.actionCache.some(res => res.code === 1)){
                this.$store.dispatch('swap/fetchTokens', 2);
            }
        }
    },
};
</script>

<style scoped lang="less">
    .dialog-footer {
        background: rgba(30, 34, 38, 0.05);
        color: #1e2226;
        font-size: 16px;
    }

    .history-box {
        max-height: 250px;
        overflow-y: scroll;
        background-color: rgba(30, 34, 38, 0.05);
    }

    .history {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        padding: 0 20px;

        .left {
            color: #3b8cff;
            font-size: 12px;
            cursor: pointer;
        }
    }

    .clear-box {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;

        .left {
            color: #1e2226;
        }

        .clear-history {
            cursor: pointer;
            border-radius: 0.26667rem;
            color: #f0b80b;
            background: rgba(30, 34, 38, 0.05);
            padding: 10px;
            text-align: center;
        }
    }
</style>
