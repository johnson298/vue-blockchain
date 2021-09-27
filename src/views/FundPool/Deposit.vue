<template>
    <div>
        <el-row :gutter="40">
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li">
              <span class="label"
              >{{ $t('Staking.DepositAmount') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{ walleAssets | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.Deposited') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{
                                    info.amountSupply
                                        | exist
                                        | toFixed(symbol ? symbol.supplyTokenDecimals : 0, true)
                                        | toFixed(4)
                                }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label">
                {{ $t('FundPool.ApyMining') }}
              </span>
                            <span> {{ apyMining | moreLessThan }} % </span>
                        </el-col>
                        <el-col tag="li">
              <span class="label">
                {{ $t('FundPool.ComprehensiveApy') }}
              </span>
                            <span>{{ comprehensiveApy | moreLessThan }} %</span>
                        </el-col>
                    </el-row>
                    <el-row class="btn-group" type="flex" justify="center">
                        <el-col :sm="24" :md="12">
                            <ApproveGuide
                                :symbol="symbol"
                                type="supplyToken"
                                @handle="approve"
                            >
                                <el-button
                                    @click="showMadel('deposit')"
                                    class="public-button-dark __button"
                                    style="width: 100%"
                                >{{ $t('Button.Deposit') }}
                                </el-button>
                            </ApproveGuide>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.AcceptableQuantity') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{ withdrawAssets | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.GainRevenue') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{ info.interestAmount | toFixed(supplyDes, true) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.LiquidationApportionment') }}&nbsp;({{
                      symbol | pick('collateralTokenSymbol')
                  }}&nbsp;&nbsp;{{ symbol | pick('lpToken0Symbol') }}-{{
                      symbol | pick('lpToken1Symbol')
                  }})</span
              >
                            <span>{{
                                    info.liquidationAmount | toFixed(borrowDes, true, 4)
                                }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('Account.MiningRevenue') }}&nbsp;({{ $project }})</span
              >
                            <span>{{ aaaa | toFixed(4) }}</span>
                        </el-col>
                    </el-row>
                    <el-row class="btn-group" :gutter="20" type="flex" justify="center">
                        <el-col :span="12">
                            <el-button
                                :disabled="!isConnect || withdrawAssets.isZero()"
                                class="public-button-dark __button"
                                @click="showMadel('withdraw')"
                            >
                                {{ $t('Button.TakeOut') }}
                            </el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button
                                :disabled="
                  !isConnect ||
                  !info.interestAmount ||
                  $number(info.interestAmount).isZero()
                "
                                class="public-button-dark __button"
                                :loading="reinvesting"
                                @click="reinvest"
                            >
                                {{ $t('Button.ReInvestment') }}
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <ModalBase
            :open.sync="visible"
            ref="modal"
            @submit="fetchContract"
            @change="changeIpt($event)"
            :type="type"
            @allClick="sliderAmountChange(100)"
            :max-limit="modalConfig.value"
        >
            <template v-slot:header>
                <div class="modal-title">
                    <SymbolIcon
                        style="margin-right: 10px"
                        :token="symbol ? symbol.supplyTokenSymbol : ''"
                    />
                    {{ $t(modalConfig.title) }} {{ symbol | pick('supplyTokenSymbol') }}
                </div>
            </template>
            <div class="mb20" v-if="type === 'withdraw'">
                <el-slider
                    v-model="sliderVal"
                    :step="0.0001"
                    :max="100"
                    :format-tooltip="formatTooltip"
                    @change="sliderAmountChange"
                    :marks="getMarks"
                />
            </div>
            <div>
                {{
                    type === 'withdraw'
                        ? $t('FundPool.AcceptableQuantity')
                        : $t('Staking.AvailableAsset')
                }}：{{ modalConfig.value | toFixed(4) }}
                {{ symbol | pick('supplyTokenSymbol') }}
            </div>
        </ModalBase>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {fundPoolHelper} from '../../store/fundPool.module';
import ApproveGuide from './ApproveGuide';
import ModalBase from './ModalBase';
import SymbolIcon from '../../components/SymbolIcon';

export default {
    components: {
        SymbolIcon,
        ModalBase,
        ApproveGuide,
    },
    name: 'Deposit',
    data() {
        return {
            sliderVal: 0,
            visible: false,
            asset: 0,
            type: 'deposit',
            balance: '',
            info: {},
            approving: false,
            reinvesting: false,
            remainSupply: 0,
            aaaa: '--',
            apyMining: '--',
            comprehensiveApy: '--',
            marks: {},
        };
    },
    watch: {
        symbol: {
            handler(val) {
                // console.log(val, 'symbol');
                if (val) {
                    this.getBalance();
                    this.takeLendPair();
                    this.mintAPR();
                }
            },
            immediate: true,
        },
    },
    methods: {
        approve(val) {
            this.$store.commit('fundPool/supplyApprove', val);
        },
        mintAPR() {
            this.$store
                .dispatch('fundPool/mintAPR')
                .then(({apyMining, comprehensiveApy}) => {
                    this.apyMining = apyMining;
                    this.comprehensiveApy = comprehensiveApy;
                });
        },
        withdraw() {
            // 提现不需要弹窗直接掉合约
            this.type = 'withdraw';
            this.visible = true;
        },
        showMadel(t) {
            this.type = t;
            this.visible = true;
        },
        getBalance() {
            Promise.all([
                this.$store.dispatch('fundPool/supplys', this.symbol.pair),
                this.$store.dispatch('fundPool/withdrawAmount', this.symbol.pair),
                this.symbol.supplyTokenSymbol === 'ETH'
                    ? this.$store.dispatch('ETHBalance')
                    : this.$store.dispatch('balance', this.symbol.supplyToken),
            ]).then(([supply, data, balance]) => {
                this.info = {
                    ...supply,
                    ...data,
                };
                this.balance = balance;
                this.$store.commit(
                    'fundPool/supplyBalance',
                    this.$number(balance).shiftedBy(-this.supplyDes)
                );
            });
        },
        takeLendPair() {
            this.$store.dispatch('fundPool/takeLendPair').then((res) => {
                // console.log(res, 'lend');
                this.aaaa = this.$number(res);
            });
        },
        reinvest() {
            this.reinvesting = true;
            this.$store
                .dispatch('fundPool/reinvest')
                .then((receipt) => {
                    this.$api.elogReinvest(receipt);
                    this.successMsg();
                    this.getBalance();
                    this.upDataPool();
                })
                .finally(() => (this.reinvesting = false));
        },

        fetchContract({value, next, reset}) {
            let request;
            switch (this.type) {
                case 'deposit':
                    request = this.$store.dispatch('fundPool/deposit', value);
                    break;
                case 'withdraw':
                    // console.log('submit', this.$number(this.modalConfig.slideVal).toFixed() ,this.$number(this.modalConfig.slideVal).multipliedBy(this.sliderVal).dividedBy(100).toFixed(8));
                    const val = this.$number(this.modalConfig.slideVal)
                        .multipliedBy(this.sliderVal)
                        .dividedBy(100)
                        .toFixed(8);
                    request = this.$store.dispatch(
                        'fundPool/withdraw',
                        this.sliderVal >= 100
                            ? this.$number(this.modalConfig.slideVal).toFixed(18, 1)
                            : val
                    );
                    break;
            }
            request
                .then((receipt) => {
                    reset();
                    this.successMsg();
                    this.getBalance();
                    this.closeMadel();
                    this.type === 'deposit' && this.$api.elogDeposit(receipt);
                    this.type === 'withdraw' && this.$api.elogWithdraw(receipt);
                    this.upDataPool();
                })
                .finally(next);
        },

        upDataPool() {
            this.$store.dispatch('poolList');
        },

        successMsg() {
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },

        closeMadel() {
            this.visible = false;
        },

        changeIpt($event) {
            const val = Number(
                this.$number($event)
                    .dividedBy(this.modalConfig.value)
                    .multipliedBy(100)
                    .toFixed()
            );
            this.sliderVal = Math.ceil(val) >= 100 ? 100 : val;
        },

        //滑块数量改变
        sliderAmountChange(res) {
            this.sliderVal = res;
            const val = this.$number(this.modalConfig.value);
            this.$refs.modal.amount = val
                .multipliedBy(res)
                .dividedBy(100)
                .toFixed(12, 1);
        },
        formatTooltip(val) {
            return this.$number(val).toFixed(2) + '%';
        },
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            isInstall: 'isInstall',
            account: 'account',
        }),
        ...fundPoolHelper.mapGetters({
            config: 'symbolConfig',
            symbol: 'symbol',
            supplyDes: 'supplyDes',
            borrowDes: 'borrowDes',
        }),
        walleAssets() {
            return this.$number(this.balance).shiftedBy(-this.supplyDes);
        },
        withdrawAssets() {
            return this.$number(this.info.withdrawAmount).shiftedBy(-this.supplyDes);
        },
        amountSupplyVal() {
            if (this.symbol) {
                return this.$number(this.info.amountSupply).shiftedBy(
                    -this.symbol.supplyTokenDecimals
                );
            }
        },
        getMarks() {
            this.marks = {};
            const step = 25; // this.$number(this.modalConfig.slideVal).dividedBy(4).toNumber();
            // console.log('step', step);
            let step1 = step;
            let step2 = step * 2;
            let step3 = step * 3;
            let step4 = step * 4;
            this.$set(this.marks, 0, {
                style: {
                    color: '#888B94',
                    fontSize: '12px',
                },
                label: this.$createElement('span', '0%'),
            });
            this.$set(this.marks, step1, {
                style: {
                    color: '#888B94',
                    fontSize: '12px',
                },
                label: this.$createElement('span', '25%'),
            });
            this.$set(this.marks, step2, {
                style: {
                    color: '#888B94',
                    fontSize: '12px',
                },
                label: this.$createElement('span', '50%'),
            });
            this.$set(this.marks, step3, {
                style: {
                    color: '#888B94',
                    fontSize: '12px',
                },
                label: this.$createElement('span', '75%'),
            });
            this.$set(this.marks, step4, {
                style: {
                    color: '#888B94',
                    fontSize: '12px',
                    width: '40px',
                    display: 'block',
                },
                label: this.$createElement('span', '100%'),
            });
            return this.marks;
        },
        // marksList() {
        //     const step = 4;
        //     const stepRange = this.$number(this.modalConfig.value).dividedBy(step);
        //     const steps = [];
        //     for (let i = 0; i <= step; i++) {
        //         steps.push(stepRange.multipliedBy(i).toFixed(0))
        //     }
        //     return steps.reduce((obj, d, i) => {
        //         obj[d] = {
        //             label: this.$createElement('span', {
        //                 style: {
        //                     whiteSpace: 'nowrap'
        //                 }
        //             }, `${25 * i}%`)
        //         };
        //         return obj
        //     }, {});
        // },
        modalConfig() {
            return {
                deposit: {
                    title: 'Button.Deposit',
                    value: this.walleAssets,
                    slideVal: this.walleAssets,
                },
                withdraw: {
                    title: 'Button.Extract',
                    value: this.withdrawAssets,
                    slideVal: this.amountSupplyVal,
                },
            }[this.type];
        },
        // sliderVal: {
        //     get() {
        //         return +this.$refs.modal.amount
        //     },
        //     set(val) {
        //         this.$refs.modal.amount = val
        //     }
        // }
    },
};
</script>

<style lang="less" scoped>
.label {
    color: var(--col-label60);
}

.modal-title {
    font-size: 16px;
    display: flex;
    align-items: center;
}

.container {
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 24px;
}

.title {
    font-weight: 600;
}

ul {
    width: 100%;
    padding-top: 10px;

    li {
        display: flex;
        justify-content: space-between;
    }

    li:not(:last-child) {
        margin-bottom: 20px;
    }
}

.btn-group {
    margin-top: 40px;
}

.btn-get {
    padding: 0;
}

@media (min-width: 960px) {
    .container {
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 24px;
    }

    ul {
        padding-top: 10px;
        font-size: 16px;

        li:not(:last-child) {
            margin-bottom: 20px;
        }
    }

    .btn-group {
        margin-top: 40px;
    }
}
</style>
