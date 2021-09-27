<template>
<el-dialog
    :title="title"
    :visible="visible"
    :width="width"
    :close-on-click-modal="false"
    @close="cancel"
    custom-class="_stake-modal">

    <el-form
        :model="stakeForm"
        :inline-message="true"
        ref="stakeForm"
        class="_stake-form">
        <el-form-item
            class="_flex-item"
            prop="amount"
            :label="name === 'stake' ? this.$t('Ifo.stake') : this.$t('Ifo.unStake')"
            :rules="rules">
            <el-input
                class="_n-input _item-input"
                type="amount"
                v-model.text="stakeForm.amount"
                autocomplete="off"
                @input.native="$filterNumber"></el-input>
            <el-button @click="maxClick()" class="_max">
                {{$t('Ifo.all')}}
            </el-button>
        </el-form-item>
        <template>
        <div class="_form-balance">
            <span>{{data.name}}</span>
            <span>{{$t('Ifo.balance')}} {{(name.toLocaleLowerCase() === 'stake' ? data.userBalance : data.userAmount) || '--'}}</span>
        </div>
        </template>
    </el-form>

    <div class="_body-btn">
        <el-button class="_n-btn cancel-btn"
            @click="cancel">{{$t('Button.Cancel')}}
        </el-button>
        <el-button
            class="_n-btn stake-btn"
            :loading="stakeLoad"
            @click="submitForm('stakeForm')">
            {{$t('Button.Ok')}}
        </el-button>
    </div>

    <span slot="footer" class="dialog-footer">
        <router-link :to="data.tokenType === 1 ? '/trade/swap' : '/trade/pool'">Get {{data.name}} <a-icon
            type="icon-third-party" class="icon"/></router-link>
    </span>
</el-dialog>
</template>

<script>
import ChainApi from '../../../static/sdk/ChainApi';
import BigNumber from 'bignumber.js';

export default {
    name: 'stake-modal',
    props: ['title', 'width', 'visible', 'pool', 'name', 'data'],
    data() {
        const checked = (rule, val, callback) => {
            if (!val) {
                return callback(new Error(this.$t('Form.PlaceAmount')));
            } else {
                callback()
            }
        };
        return {
            stakeForm: {
                amount: ''
            },
            rules: [
                {validator: checked}
            ],
            stakeLoad: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.stakeLoad = true;
                    this.name.toLocaleLowerCase() === 'stake' ?
                        this.stake(this.stakeForm.amount) :
                        this.unStake(this.stakeForm.amount)
                } else {
                    return false;
                }
            });
        },
        maxClick() {
            this.stakeForm.amount = this.name.toLocaleLowerCase() === 'stake' ? this.data.userBalance : this.data.userAmount;
        },
        cancel() {
            this.$emit('cancel');
            this.$refs['stakeForm'].resetFields();
        },
        stake(amount) {
            ChainApi.shackFarmDeposit(this.data.pid, amount).then(res => {
                this.$store.dispatch('recordCallback', {
                    key: 'xBurger Pool',
                    action: 'xBurger Pool',
                    params: {describe: `Stake ${amount} ${this.data.tokenSymbol}`},
                    code: 0,
                    result: res,
                });
                return ChainApi.awaitTransactionMined(res);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: `Stake ${amount} ${this.data.tokenSymbol}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Stake',
                        message: 'Stake Success',
                        type: 'success'
                    });
                    ChainApi.shackFarmUpdatePool(this.data.pid, true)
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: `Stake ${amount} ${this.data.tokenSymbol}`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'Stake',
                        message: 'Stake Error',
                        type: 'error'
                    });
                }
                this.cancel();
            }).finally(() => {
                this.stakeLoad = false;
            });
        },
        unStake(amount) {
            ChainApi.shackFarmWithdraw(this.data.pid, amount).then(res => {
                this.$store.dispatch('recordCallback', {
                    key: 'xBurger Pool',
                    action: 'xBurger Pool',
                    params: {describe: `unStake ${amount} ${this.data.tokenSymbol}`},
                    code: 0,
                    result: res,
                });
                return ChainApi.awaitTransactionMined(res);
            }).then(require => {
                if (require.status) {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: `unStake ${amount} ${this.data.tokenSymbol}`},
                        code: 1,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'unStake',
                        message: 'unStake Success',
                        type: 'success'
                    });
                    ChainApi.shackFarmUpdatePool(this.data.pid, true)
                } else {
                    this.$store.dispatch('recordCallback', {
                        key: 'xBurger Pool',
                        action: 'xBurger Pool',
                        params: {describe: `unStake ${amount} ${this.data.tokenSymbol}`},
                        code: 2,
                        result: require.transactionHash,
                    });
                    this.$notify({
                        title: 'unStake',
                        message: 'unStake Error',
                        type: 'error'
                    });
                }
                this.cancel();
            }).finally(() => {
                this.stakeLoad = false;
            });
        }
    }
}
</script>

<style scoped lang="less">
    /deep/ ._stake-modal {
        border-radius: 20px;

        .el-form-item__error--inline {
            margin-top: 5px;
        }

        .el-dialog__header {
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #E9EAEB;
            height: 87px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            position: relative;

            .el-dialog__headerbtn {
                top: 50%;
                transform: translateY(-50%);

                .el-dialog__close {
                    font-size: 24px;
                    color: #212833;


                    &:hover {
                        color: var(--col-main);
                    }
                }
            }
        }

        .el-dialog__body {
            padding: 24px;

            .el-form-item {
                margin-bottom: 24px;
            }

            ._stake-form {
                border-radius: 20px;
                padding: 0;
                margin-bottom: 30px;

                .el-form-item__error--inline {
                    position: absolute;
                    left: 0;
                    height: 100%;
                    display: inline-flex;
                    align-items: center;
                    padding-top: 0;
                }

                .el-form-item__label {
                    padding: 0;
                    line-height: 16px;
                    font-weight: bold;
                    font-size: 18px;
                    color: #212833;
                }

                ._n-input .el-input__inner {
                    height: 50px;
                    background: #ffffff;
                    border: 1px solid #2C3035;
                    border-radius: 11px;
                    color: #212833;
                    padding: 0 80px 0 10px;
                    font-size: 18px;
                    margin-top: 24px;
                    transition: all .2s;
                    position: relative;

                    &:hover {
                        border-color: #F0B80B;
                    }
                }

                ._max {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    margin-top: 19px;
                    padding: 0;
                    background-color: transparent;
                    border: 0;
                    font-size: 18px;
                    font-weight: 500;
                    color: #212833;
                    transition: color .2s;

                    &:hover {
                        color: #03050A;
                    }
                }

                ._form-balance {
                    display: flex;
                    justify-content: space-between;
                    font-size: 18px;
                    color: #212833;

                    span {
                        &:nth-of-type(1) {
                            font-weight: 600;
                        }
                    }
                }
            }

            ._body-btn {
                display: flex;
                justify-content: space-between;

                button {
                    width: 204px;
                    height: 48px;
                    border-radius: 20px;
                    font-weight: 500;
                }

                .stake-btn:disabled {
                    background-color: #E9EAEB;
                }
            }
        }

        .el-dialog__footer {
            text-align: center;
            padding-bottom: 32px;

            a {
                color: var(--col-main);
                transition: all .2s;
                display: inline-flex;
                justify-content: center;
                font-size: 16px;
                font-weight: bold;

                .icon {
                    margin-left: 8px;
                }

                &:hover {
                    color: #F9C420;
                }
            }
        }
    }
</style>
