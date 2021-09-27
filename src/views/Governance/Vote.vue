<template>
<div class="vote">
    <div class="left">{{ $t('governanceControl.voteTitle') }}</div>
    <div class="right">
        <el-select
            class="__select_vote"
            @change="selectChange($event)"
            v-model="value"
            :placeholder="$t('Form.Filter')"
        >
            <el-option
                class="options"
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>
        <el-button
            class="add_btn"
            @click="showMadel"
            :disabled="!isLogin"
            round
        >
            {{ $t('Government.CreateProposal') }}
        </el-button>
    </div>
    <el-dialog class="dialog-madel" :close-on-click-modal="false" :visible.sync="visible">
        <div class="dialog-title">
            <span style="margin-left: 0">{{ $t('Government.CreateProposal') }}</span>
        </div>
        <div class="dialog-body _gov-body">
            <div class="pool-amount">
                {{ $t('nowVote.txVoteBonus') }}
                <span>{{ poolAmount }}{{ $project }}</span>
            </div>
            <el-form :model="form" :rules="rule" ref="ruleForm" @submit.native.prevent>
                <el-form-item prop="type" class="select">
                    <el-select
                        style="width: 100%"
                        @change="typeChange($event)"
                        v-model="form.type"
                        :placeholder="$t('Government.SelectProposal')"
                    >
                        <el-option
                            v-for="item in voteList"
                            :key="item.key"
                            :disabled="item.disabled"
                            :label="item.title"
                            :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="voting-reward">
                    {{ $t('Government.CurrentAmount') }}&nbsp;{{ amount.currentValue }}
                </div>
                <div class="voting-reward">
                    {{ $t('Government.FollowingRange') }}&nbsp;
                    <span>{{ amount.minValue }}-{{ amount.maxValue }}</span>
                </div>

                <el-form-item prop="number" class="select">
                    <el-input
                        v-model="form.number"
                        :placeholder="$t('Government.NumberYouWant')"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="context">
                    <el-input
                        type="textarea"
                        v-model="form.context"
                        :placeholder="$t('Government.EnterDetails')"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="dialog-footer">
            <el-button
                class="__button swap implement-btn"
                @click="createProposal"
            >
                {{ $t('Button.Ok') }}
            </el-button>
        </div>
    </el-dialog>
    <el-dialog
        class="dialog-madel"
        :visible.sync="visiblePay"
        :close-on-click-modal="false"
    >
        <div class="dialog-title">
            <span style="margin-left: 0">{{ $t('nowVote.txVoteBonas') }}</span>
        </div>
        <div>
            <span class="staked">{{ $t('nowVote.PayDGAS') }}:</span>
            <span class="pay-coin">&nbsp;{{ fee.proposalAmount }}</span>
        </div>
        <div class="dialog-body">
            <el-form :model="coinForm" :rules="coinRule" ref="coinForm" @submit.native.prevent>
                <el-form-item prop="coinNumber" class="select">
                    <el-input
                        v-model="coinForm.coinNumber"
                        :placeholder="$t('Form.PlaceAmount')"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="dialog-footer">
            <el-button
                class="__button swap implement-btn"
                :loading="loading"
                @click="create"
            >
                {{ auth ? $t('Button.Authorization') : $t('Button.Ok') }}
            </el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {mapState} from 'vuex';
import LPSymbol from '../../components/LPSymbol';
import {governanceHelper} from '@/store/gove.module';
import {combineLatest} from 'rxjs';

export default {
    name: 'Vote',
    components: {
        LPSymbol,
    },
    props: ['voteList'],
    data() {
        const checkedSize = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('Form.PlaceAmount')));
            }
            const val = this.$number(value);
            if (
                val.isGreaterThan(this.amount.maxValue) ||
                val.isLessThan(this.amount.minValue)
            ) {
                callback(new Error(this.$t('Form.TheRange')));
            } else {
                callback();
            }
        };
        const coinChecked = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('Form.PlaceAmount')));
            }
            const val = this.$number(value);
            this.auth = val.isGreaterThan(this.tokenInfo.allowance_gov);
            if (this.tokenInfo.balance < this.fee.proposalAmount) {
                callback(new Error(this.$t('swapControl.Insufficient')));
            } else if (val.isLessThan(this.fee.proposalAmount)) {
                callback(new Error(this.$t('nowVote.txVoteBonas') + this.fee.proposalAmount));
            } else {
                callback();
            }
        };
        return {
            value: null,
            loading: false,
            options: [
                {
                    key: 'all',
                    label: this.$t('governanceControl.All'),
                    value: null,
                },
                {
                    key: 'success',
                    label: this.$t('governanceControl.processType1'),
                    value: 'success',
                },
                {
                    key: 'error',
                    label: this.$t('governanceControl.processType3'),
                    value: 'error',
                },
                {
                    key: 'pending',
                    label: this.$t('governanceControl.processType2'),
                    value: 'pending',
                },
            ],
            visible: false,
            form: {
                type: '',
                number: '0',
                context: '',
            },
            rule: {
                //弹框表单校验
                type: [
                    {
                        validator: true,
                        message: this.$t('Form.ProposalType'),
                        trigger: 'change',
                    },
                ],
                number: [{validator: checkedSize, trigger: 'change'}],
                context: [{validator: false}],
            },
            coinForm: {
                coinNumber: '',
            },
            coinRule: {
                coinNumber: [{validator: coinChecked, trigger: 'change'}],
            },

            visiblePay: false,
            amount: {
                currentValue: '',
                minValue: '',
                maxValue: '',
                span: null,
            },
            fee: {
                proposalAmount: '',
            },
            isLogin: false,
            auth: false,
        };
    },
    watch: {},
    computed: {
        ...mapState({}),
        ...governanceHelper.mapGetters({
            tokenInfo: 'tokenInfo',
            poolAmount: 'poolAmount'
        }),
    },
    mounted() {
        this.init();
    },
    destroyed() {
        this.$sub && this.$sub.unsubscribe();
    },
    methods: {
        init() {
            this.$sub = this.comb();
        },
        comb() {
            return combineLatest([
                this.$swap.loginStatus(),
                this.$swap.chainId(),
            ]).subscribe(([isLogin, chainId]) => {
                this.isLogin = isLogin;
                if (isLogin) {
                    this.getFee();
                }
            });
        },
        typeChange($event) {
            this.amount.minValue = '';
            this.amount.maxValue = '';
            this.amount.currentValue = '';
            this.getConfigCommonValues($event);
        },
        getConfigCommonValues(val) {
            this.$store.dispatch('governance/queryConfigInfo', val).then((res) => {
                this.amount.maxValue = res.maxValue;
                this.amount.minValue = res.minValue;
                this.amount.currentValue = res.currentValue;
                this.getFee();
            });
        },

        createProposal() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.visiblePay = true;
                } else {
                    return false;
                }
            });
        },

        selectChange($event) {
            this.$emit('search', $event);
        },
        showMadel() {
            if (!this.isLogin) {
                return;
            }
            this.visible = true;
            this.loading = false;
            this.$nextTick(function () {
                this.$refs['ruleForm'].resetFields();
                this.$refs['ruleForm'].clearValidate();
            });
        },
        create() {
            if (this.tokenInfo.allowance_gov < this.coinForm.coinNumber) {
                this.approveGovernor();
                return;
            }
            this.$refs['coinForm'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$store.dispatch('governance/createGove', {
                        selectVal: this.form.type,
                        titleVal: this.form.number,
                        feeVal: this.coinForm.coinNumber,
                        conVal: this.form.context,
                        cb: (vote, tx) => {
                            if (vote === 2) {
                                this.loading = false;
                            }
                            if (vote === 1) {
                                this.msg();
                                this.visiblePay = false;
                                this.visible = false;
                                this.loading = false;
                                this.value = null;
                                this.$emit('upDataInit', this.value);
                                this.$store.dispatch('recordCallback', {
                                    key: 'create',
                                    action: 'governance',
                                    params: {describe: 'Create proposal'},
                                    code: vote,
                                    result: tx,
                                });
                            }
                        },
                    });
                } else {
                    return false;
                }
            });
        },
        approveGovernor() {
            this.loading = true;
            this.$store.dispatch('governance/approveTokenGOV', {
                totalAmount: this.tokenInfo.totalSupply,
                cb: (apporve, tx) => {
                    this.$store.dispatch('governance/getCoinInfo');
                    if (apporve === 1) {
                        this.msg();
                        this.auth = false;
                        this.loading = false;
                    }
                    this.$store.dispatch('recordCallback', {
                        key: 'approve',
                        action: 'governance',
                        params: {describe: `Approve ${this.$project}`},
                        code: apporve,
                        result: tx,
                    });
                },
            });
        },
        msg() {
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },
        getFee() {
            this.$store.dispatch('governance/getFee').then((res) => {
                this.fee.proposalAmount = res.proposalAmount;
            });
        },
    },
};
</script>

<style lang="less" scoped>
    .vote {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            font-size: 20px;
            font-weight: bold;
            color: var(--col-main-active);
        }

        .right {
            display: flex;
            align-items: center;


            .add_btn {
                margin-left: 20px;
                background: rgba(240, 184, 11, .2);
                color: var(--col-main);
                border: none;
                min-width: 200px;
                font-size: 14px;
                font-weight: 700;
            }


        }

        .__select_vote {
            min-width: 200px;

            .el-input__inner {
                font-size: 16px !important;
                font-weight: bold !important;
            }
        }

        .staked {
            color: #1e2226;
            font-size: 16px;
        }

        .pay-coin {
            color: #1e2226;
            font-size: 16px;
            font-weight: bold;
        }
    }

    @media (max-width: 960px) {
        .vote {
            height: 120px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                font-size: 24px;
                font-weight: bold;
                color: var(--col-main-active);
            }

            .right {
                .button {
                    font-size: 12px;
                }

                .public-select {
                    width: 160px;
                    margin-right: 20px;
                }
            }
        }
    }
</style>
