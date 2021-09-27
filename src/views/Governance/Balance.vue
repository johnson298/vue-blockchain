<template>
<div class="balance-page">
    <div class="left">
        <span class="balance">{{ $t('Government.Balance') }}:</span>&nbsp;&nbsp;
        <span class="total">{{ balance | toFixed(4) | toFormat }}</span>
        <span class="staked">
				+ {{ stakeAmount | toFixed(4) | toFormat }} (staked){{ $project }}
			</span>
        <el-tooltip
            effect="dark"
            :content="$t('governanceControl.proTxts.0')"
            placement="right-start"
        >
            <a-icon class="icon" type="icon-wenhao"/>
        </el-tooltip>
    </div>

    <div class="right">
        <el-button
            :loading="loading"
            :disabled="!isLogin"
            class="__button swap mortgage"
            @click="operation('mortgage')"
        >
            {{
            $t(allowance_gov <= 0 ? 'Button.Authorization' : 'Button.Mortgage')
            }}
        </el-button>
        <el-button
            class="__button swap mortgage"
            :disabled="allowance_gov <= 0 || !isLogin || redeemAmount <= 0"
            @click="operation('redeem')"
        >
            {{ $t('Button.Redeem') }}
        </el-button>
    </div>
    <el-dialog class="dialog-madel" :visible.sync="visible">
        <div class="dialog-title">
            <span>{{ $t(type === 'mortgage' ? 'Button.Mortgage' : 'Button.Redeem') }}</span>
        </div>
        <div class="dialog-body _gov-body">
            <el-form :model="form" :rules="rule" ref="ruleForm" @submit.native.prevent>
                <el-form-item prop="amount">
                    <el-input
                        :placeholder="$t('Form.PlaceAmount')"
                        v-model="form.amount"
                        autocomplete="off"
                    >
                        <div class="append-box" slot="suffix">
                            <span class="up">{{ $project }}</span>
                            <a-max @click.stop="allAmount"/>
                        </div>
                    </el-input>
                </el-form-item>
            </el-form>
            <div>
                <div class="asset-box">
                    <div class="left">
                        {{ $t('Staking.AvailableAsset') }}：{{ assets }}
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-footer _gov-footer">
            <el-button class="public-button-out button-200" @click="handleClose">
                {{ $t('Button.SignOut') }}
            </el-button>
            <el-button
                :loading="submitLoading"
                class="public-button-determine button-200"
                type="primary"
                @click="submitForm('ruleForm')"
            >{{ $t('Button.Ok') }}
            </el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {mapState} from 'vuex';
import ChainApi from '../../../static/sdk/ChainApi';
import Logo from '../../components/Logo';
import {BigNumber} from 'bignumber.js';

export default {
    name: 'Balance',
    props: ['tokenInfo', 'totalStake'],
    components: {
        Logo,
    },
    data() {
        const checkedSize = (rule, value, callback) => {
            if (!value || value <= 0) {
                return callback(new Error(this.$t('Form.PlaceAmount')));
            }
            const val = this.$number(value);
            if (val.isGreaterThan(this.assets)) {
                callback(new Error(this.$t('Form.HaveExceeded')));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            visible: false,
            form: {
                //弹框表单
                amount: '',
            },
            rule: {
                //弹框表单校验
                amount: [{validator: checkedSize, trigger: 'blur'}],
            },
            assets: 0,
            submitLoading: false,
            type: '',
            isLogin: false,

            balance: 0,
            allowance_gov: '',
            totalSupply: '',

            stakeAmount: '',
            redeemAmount: 0,
        };
    },
    watch: {
        tokenInfo: {
            handler(val) {
                this.balance = val.balance;
                this.allowance_gov = val.allowance_gov;
                this.totalSupply = val.totalSupply;
            },
            immediate: true,
        },
        totalStake: {
            handler(val) {
                this.stakeAmount = val.stakeAmount;
                this.redeemAmount = val.redeemAmount;
            },
            immediate: true,
        },
    },
    computed: {
        ...mapState({
            account: 'account',
        }),
    },
    mounted() {
        this.$swap.loginStatus().subscribe((res) => {
            this.isLogin = res;
        });
    },
    methods: {
        operation(t) {
            if (this.allowance_gov > 0) {
                this.visible = true;
                this.type = t;
                this.assets = t === 'mortgage' ? new BigNumber(this.balance).toFixed(6, 1) : this.stakeAmount;
            } else {
                this.approve();
            }
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    if (this.type === 'mortgage') {
                        this.stake();
                    } else {
                        this.unStake();
                    }
                } else {
                    return false;
                }
            });
        },

        stake() {
            this.$store.dispatch('governance/stake', {
                amount: this.form.amount,
                cb: (stake, tx) => {
                    // console.log('stake', stake, tx);
                    if (stake === 1) {
                        this.msg();
                        this.$emit('upData');
                        this.handleClose();
                        this.$store.dispatch('recordCallback', {
                            key: 'Stake',
                            action: 'governance',
                            params: {
                                describe: `Stake ${this.form.amount} ${this.$project}`,
                            },
                            code: stake,
                            result: tx,
                        });
                    }
                },
            });
        },

        unStake() {
            this.$store.dispatch('governance/redeem', {
                amount: this.form.amount,
                cb: (redeem, tx) => {
                    if (redeem === 1) {
                        this.msg();
                        this.$emit('upData');
                        this.handleClose();
                        this.$store.dispatch('recordCallback', {
                            key: 'Redeem',
                            action: 'governance',
                            params: {
                                describe: `Redeem ${this.form.amount} ${this.$project}`,
                            },
                            code: redeem,
                            result: tx,
                        });
                    }
                },
            });
        },

        approve() {
            this.loading = true;
            this.$store.dispatch('governance/approveTokenGOV', {
                totalAmount: this.totalSupply,
                cb: (code, tx) => {
                    if (code === 1) {
                        this.$store.dispatch('recordCallback', {
                            key: 'approve',
                            action: 'governance',
                            params: {describe: `Approve ${this.$project}`},
                            code: code,
                            result: tx,
                        });
                        this.$emit('upData');
                        this.loading = false;
                    }
                },
            });
        },

        allAmount() {
            this.form.amount = this.$number(this.assets).toFixed(6, 1);
        },

        handleClose() {
            this.visible = false;
            this.submitLoading = false;
            this.$nextTick(function () {
                this.$refs['ruleForm'].resetFields();
                this.$refs['ruleForm'].clearValidate();
            });
        },
        msg() {
            this.visible = false;
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },
    },
};
</script>

<style lang="less" scoped>
    .balance-page {
        .left {
            display: flex;
            padding: 40px 0;
            font-size: 16px;

            .balance {
                color: var(--col-main-active);
                font-weight: bold;
                margin-right: 5px;
            }

            .total {
                font-weight: bold;
                color: var(--col-main);
                margin-right: 20px;
            }

            .staked {
                color: var(--col-label60);
                margin-right: 10px;
            }
        }

        .right {
            display: flex;
            justify-content: space-between;

            button {
                width: 49%;
            }
        }

        .icon {
            color: white;
        }
    }

    .mortgage {
        font-size: 16px;
        font-weight: 700;
    }

    @media (max-width: 960px) {
        .balance-page {
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .left {
                font-size: 24px;
                padding: 30px 0 20px 0;
            }
        }
    }
</style>
