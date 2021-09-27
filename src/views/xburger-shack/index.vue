<template>
    <div>
        <Title :title="$t('xBurger.title')" :sub-title="$t('xBurger.subTitle')" class="_title"/>
        <div class="claim-hxburger" @click="claim()" v-if="clainInfo.symbol">Claim</div>
        <a-loading :loading="load">
            <div class="_xburger-flex">
                <template v-for="el in poolsList">
                <div>
                    <Card :data="el"/>
                </div>
                </template>
                <empty v-if="!poolsList.length"/>
            </div>
        </a-loading>

        <el-dialog
            :append-to-body="true"
            class="dialog-madel claim-hxburger-model pd-0"
            :visible="visible"
            :before-close="closeModel"
            :close-on-click-modal="true"
        >
            <div class="claim-hxburger-model-header">
                <h4 class="title"> Claim {{clainInfo.symbol}} Token </h4>
                <h4 class="amount"> {{clainInfo.amount}} {{clainInfo.symbol}} </h4>
                <p></p>

            </div>
            <section class="claim-hxburger-model-body">
                <p>Connect your BSC wallet to see if you are a winner. The claim button will appear (not greyed out) if your wallet address has any claimable hxBURGER. <br/>**if it is greyed out, it means you are not a winner**</p>
                <el-button :loading="claimLoad" class="claim-hxburger-model-btn" :disabled="!clainInfo.result && clainInfo.amount <= 0" @click.stop="harvest">Claim {{clainInfo.symbol}}</el-button>
            </section>

        </el-dialog>
    </div>
</template>

<script>
import Title from '../Ifo/LaunchPad/Component/ifo-title';
import Card from './card'
import ChainApi from '../../../static/sdk/ChainApi';
import {mapState} from 'vuex';
import ComingSoon from '../../components/ComingSoon';
import Empty from '../../components/Empty'
import {subLogin} from 'mixins/subLogin'


export default {
    name: 'index',
    components: {Title, Card, ComingSoon, Empty},
    mixins: [subLogin],
    data() {
        return {
            load: true,
            doubtShowIndex: -1,
            activeRoot: '',
            shackStatistics: {},
            liquidityLoading: true,
            poolsList: [],
            timer: '',
            time: {
                d: '00',
                h: '00',
                m: '00',
                s: '00'
            },
            showTime: false,
            claimLoad: false,
            visible: false,
            clainInfo: {}
        }
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
        }),
    },
    watch: {
        isConnect() {
            // this.init();
        },
    },

    created() {
        // this.init()
    },
    methods: {
        init() {
            if (this.isConnect) {
                this.shackStatistics = ChainApi.shackStatistics;
                this.getShackList()
                this.claim_getPendingReward();
            } else {
                this.poolsList = [];
            }
        },
        getShackList() {
            this.load = true;
            ChainApi.shackFarmGetPools().then(res => {
                console.log(res)
                this.load = false;
                this.liquidityLoading = false;
                this.poolsList = res;
            })
        },
        closeModel(){
            this.visible = false
        },

        claim(){
          this.visible = true;

        },
        harvest(){
            this.claimLoad = true;
            ChainApi.claim.claim().then(hash => {
                this.$store.dispatch('recordCallback', {
                    key: 'Prediction',
                    action: 'Prediction',
                    params: {describe: `Harvest ${this.clainInfo.symbol}`},
                    code: 0,
                    result: hash,
                });
                return ChainApi.awaitTransactionMined(hash);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Harvest ${this.clainInfo.symbol}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Success',
                        type: 'success'
                    });
                    this.claim_getPendingReward();
                    this.visible = false;
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'Prediction',
                        action: 'Prediction',
                        params: {describe: `Harvest ${this.clainInfo.symbol}`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Harvest',
                        message: 'Harvest Error',
                        type: 'error'
                    });
                }
            }).finally(() => {
                this.claimLoad = false;
            });
        },

        claim_getPendingReward() {
            ChainApi.claim.getPendingReward().then(res => {
                this.clainInfo = res;
            });
        },

        claim_claim() {
            ChainApi.claim.claim().then(hash => {
                return ChainApi.awaitTransactionMined(hash);
            }).then(tx => {
                console.log('claim tx:', tx);
            }).finally(() => {
                console.log('claim finally')
            });
        },
    }
}
</script>

<style scoped lang="less">
    ._title {
        ::v-deep h5 {
            letter-spacing: 2px;
        }
    }

    ._pool-time {
        margin-top: 30px;
        color: #fff;

        .tip {
            font-weight: 500;
            font-size: 24px;
            line-height: 24px;
            text-align: center;
            margin-bottom: 14px;
        }

        .times {
            display: flex;
            justify-content: center;
            margin-bottom: 50px;

            &-item {
                text-align: center;
                width: 80px;

                &-data {
                    font-weight: 500;
                    font-size: 64px;
                    line-height: 64px;
                }

                &-tips {
                    margin-top: 2px;
                    font-size: 12px;
                    line-height: 12px;
                    font-weight: 400;
                    color: rgba(#fff, .6);
                }
            }

            span {
                margin: 0 10px;
                font-size: 48px;
                line-height: 54px;
            }
        }

    }

    ._xburger-flex {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        & > div {
            margin: 10px;
        }
    }
    .claim-hxburger{
        position: fixed;
        top: 150px;
        line-height: 50px;
        font-size: 16px;
        color: #F0B80B;
        padding: 0 20px 0 30px;
        right: 0;
        background: rgba(240, 184, 11, 0.1);
        border-bottom-left-radius: 25px;
        border-top-left-radius: 25px;
        cursor: pointer;
    }

    .claim-hxburger-model{
        color: #212833;
        /deep/ .el-dialog{
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            overflow: hidden;
            background: #2C3035;
        }
        /deep/ .el-dialog__header{
            background: #2C3035;
            border: none;
            .el-dialog__close{
                color: #fff;
            }
        }
        /deep/ .el-dialog__body{
            background: #2C3035;
        }

        &-header{
            padding-bottom: 31px;
            background: #2C3035;
            .title{
                height: 34px;
                font-weight: 500;
                font-size: 18px;
                line-height: 6px;
                text-indent: 24px;
                margin: 0;
                color: #fff;
            }
            .amount{
                font-weight: 600;
                font-size: 36px;
                line-height: 36px;
                color: #E8B941;
                text-indent: 24px;
                margin: 0;
            }
        }
        &-body{
            padding: 20px 24px 34px;
            text-align: center;
            background: #fff;
            p{
                margin-bottom: 31px;
                font-weight: 600;
                font-size: 18px;
                line-height: 24px;
                text-align: left;
                word-break: keep-all;
            }
        }
        &-btn{
            font-weight: 500;
            font-size: 14px;
            color: #212833;
            background: #F0B90B;
            border: none;
            padding: 0 40px;
            width: 85%;
            height: 50px;
            border-radius: 25px;
            float: inherit;
            margin-right: 0;
        }
        /deep/ .el-button{
            transition: background .2s;
        }
        /deep/ .el-button:hover{
            background: #F6D261;
        }
        /deep/ .is-disabled{
            background: #EEEEE9 !important;
            &:hover{background: #EEEEE9 !important}
        }
    }
</style>
