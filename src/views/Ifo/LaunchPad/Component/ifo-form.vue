<template>
    <div class="_form">
        <token
            :symbol0="item.lpToken0Symbol"
            :symbol1="item.lpToken1Symbol"
            :useCommitted="useCommitted"
            :isCommitted="isCommitted"
            :total-amount="item.totalAmount"
            :raising-amount="item.raisingAmount"
            class="_n-mg-bt-30 _pd-24"></token>
        <el-form
            :model="padValidateForm"
            :inline-message="true"
            ref="padValidateForm"
            class="amount-form">
            <el-form-item
                class="_flex-item"
                prop="amount"
                :rules="rules">
                <el-input
                    class="_n-input _item-input"
                    type="amount"
                    v-model.text="padValidateForm.amount"
                    autocomplete="off"
                    @input.native="$filterNumber"></el-input>
                <el-button @click="maxClick()" :disabled="isOpen" class="_item-btn">
                    {{$t('Ifo.all')}}
                </el-button>
            </el-form-item>
            <template>
                <div class="_form-balance">{{$t('Ifo.balance')}}
                    <count-jump :val="balance"/>
                </div>
            </template>
            <el-form-item class="_item-bt">
                <el-button
                    class="_n-btn _b-btn"
                    :loading="isLoad"
                    :disabled="isOpen || Number(item.offeredAmount) === 0 || !item.isWhite"
                    @click="submitForm('padValidateForm')">
                    <template v-if="item.isWhite">
                        {{isApprove ? $t('Ifo.contribute') : $t('Ifo.approve')}}
                        {{item.lpToken1Symbol ? item.lpToken0Symbol+'-'+item.lpToken1Symbol + ' LP' : item.lpToken0Symbol}}
                    </template>
                    <template v-else>
                        {{$t('Ifo.isWhite')}}
                    </template>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Token from './token';
import ChainApi from '../../../../../static/sdk/ChainApi';
import BigNumber from 'bignumber.js';
import CountJump from '../../../../components/countJump/index';

export default {
    name: 'ifo-form',
    props: ['item', 'walletAddress', 'isOpen'],
    components: {CountJump, Token},
    data() {
        const checked = (rule, val, callback) => {
            if (!this.isApprove) {
                callback()
            } else {
                if (!val) {
                    return callback(new Error(this.$t('Form.PlaceAmount')));
                } else {
                    callback()
                }
            }
        };
        return {
            balance: null,
            isApprove: false,
            padValidateForm: {
                amount: ''
            },
            rules: [
                {validator: checked}
            ],
            isLoad: false,
            isCommitted: false,
            useCommitted: 0,
            isLp: true
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.item.lpToken === '0x0000000000000000000000000000000000000000') {
                this.isApprove = true;
                this.isLp = false;
            } else {
                this.isLp = true;
                ChainApi.allowance(this.item.lpToken, this.item.pool).then(res => {
                    this.isApprove = res.toNumber() > 0;
                });
            }
            this.getBalance();
            this.getUseCommitted();
        },
        getBalance() {
            ChainApi.tokenBalanceOf(this.item.lpToken, this.walletAddress).then(res => {
                this.balance = res.toFixed();
            })
        },
        maxClick() {
            this.padValidateForm.amount = this.balance;
        },
        submitForm(formName) {
            if (!this.isApprove) {
                this.approve();
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoad = true;
                        console.log('submitForm:', this.item.pool, this.padValidateForm.amount)
                        this.stake(this.item.pool, new BigNumber(this.padValidateForm.amount).shiftedBy(Number(this.item.lpTokenDecimals)).toFixed());
                    } else {
                        return false;
                    }
                });
            }
        },
        approve() {
            this.isLoad = true;
            ChainApi.approve(this.item.lpToken, this.item.pool).then(tx => {
                console.log('tx', tx)
                this.isLoad = false;
                this.isApprove = !this.isApprove;
                this.$store.dispatch('recordCallback', {
                    key: 'Approve',
                    action: 'Ifo',
                    params: {describe: 'Approve'},
                    code: 1,
                    result: tx.transactionHash,
                });

                this.$notify({
                    title: 'Approve',
                    message: 'Approve Success',
                    type: 'success'
                })
            }).catch(e => {
                console.log('eeeeeeeeee=========>', e)
                this.isLoad = false
            })
        },
        stake(poolAddress, poolAmount) {
            console.log('deal', poolAddress, poolAmount)
            ChainApi.ifoDeposit(poolAddress, poolAmount).then(tx => {
                console.error('tx===>', tx)
                this.$store.dispatch('recordCallback', {
                    key: 'Contribute',
                    action: 'Ifo',
                    params: {describe: 'Contribute'},
                    code: 0,
                    result: tx,
                });
                return ChainApi.awaitTransactionMined(tx);
            }).then(receipt => {
                if (receipt.status) {
                    console.log('receipt', receipt);
                    this.$store.dispatch('recordCallback', {
                        key: 'Contribute',
                        action: 'Ifo',
                        params: {describe: 'Contribute'},
                        code: 1,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'Contribute',
                        message: 'Contribute Success',
                        type: 'success'
                    });
                    ChainApi.ifoUpdate(this.item.pool);
                } else {
                    console.log('receipt', receipt);
                    this.$store.dispatch('recordCallback', {
                        key: 'Contribute',
                        action: 'Ifo',
                        params: {describe: 'Contribute'},
                        code: 2,
                        result: receipt.transactionHash,
                    });
                    this.$notify({
                        title: 'Contribute',
                        message: 'Contribute Error',
                        type: 'error'
                    });
                }
                this.getBalance();
            }).catch(e => {
                this.$notify({
                    title: 'Contribute',
                    message: 'Contribute Error',
                    type: 'error'
                });
                this.isLoad = false;
            }).finally(() => {
                this.isLoad = false;
                this.$refs['padValidateForm'].resetFields();
                this.getUseCommitted();
            });
        },
        getUseCommitted() {
            ChainApi.ifoGetUserInfo(this.item.pool, this.walletAddress).then(res => {
                const amount = new BigNumber(res.amount).shiftedBy(-Number(this.item.lpTokenDecimals)).toFixed(6);
                this.useCommitted = amount;
                this.isCommitted = amount > 0;
            })
        }
    }
}
</script>

<style scoped lang="less">
    ._form {
        padding: 0 24px;

        /deep/ .el-form-item__error--inline {
            position: absolute;
            height: 100%;
            display: inline-flex;
            align-items: center;
            padding-top: 0;
            margin-left: 16px;
        }
    }

    .amount-form {
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(#ffffff, .1);
    }

    ._item-input {
        height: 50px;
    }

    ._form-balance {
        font-size: 12px;
        margin-top: -15px;
        margin-bottom: 20px;
    }

    /deep/ ._item-bt {
        margin-bottom: 0;
    }

    /deep/ .el-form-item__content {
        display: flex;

        ._item-btn {
            margin-left: 20px;
            height: 50px;
            width: auto;
            position: absolute;
            top: 0;
            right: 16px;
            background-color: transparent;
            border: 0;
            padding: 0;
            color: #F0B80B;
        }
    }

    ._b-btn {
        width: 100%;
        height: 40px;
        font-size: 16px;
        border-radius: 36px;
    }
</style>
