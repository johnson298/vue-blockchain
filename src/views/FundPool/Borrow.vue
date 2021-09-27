<template>
    <div>
        <el-row :gutter="40">
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li">
                            <span class="label">{{ $t('FundPool.MaximumLoan') }}</span>
                            <span>{{ pledgeRate | toFixed(2) }}%</span>
                        </el-col>
                        <el-col tag="li">
                            <span class="label">{{ $t('FundPool.LiquidationRatio') }}</span>
                            <span>{{ liquidationRate | toFixed(2) }}%</span>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li">
              <span class="label"
              >{{ $t('Account.MiningRevenue') }}&nbsp;({{ $project }})</span
              >
                            <span>
                {{ cake | toFixed(4) }}
                <span
                    v-show="!$number(cake).isZero()"
                    class="__cursor"
                    style="color: var(--col-borrow)"
                    @click="mintCake"
                >{{ $t('Button.Obtain') }}</span
                >
              </span>
                        </el-col>
                        <!--                    <el-col tag="li">-->
                        <!--                        <span class="label">{{$t('Account.MiningRevenue')}}({{$project}})</span>-->
                        <!--                        <span>-->
                        <!--                            {{aaaa | toFixed(4)}}-->
                        <!--                        </span>-->
                        <!--                    </el-col>-->
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="40">
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li"><span class="title">STEP 1</span></el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.WalletBalance') }}&nbsp;({{
                      symbol | pick('collateralTokenSymbol')
                  }})</span
              >
                            <span>{{ walleAssets | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('Staking.Mortgaged') }}&nbsp;({{
                      symbol | pick('collateralTokenSymbol')
                  }})</span
              >
                            <span>{{ mortgageAssets | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label">{{
                      $t('LiquidationPage.CurrentLoanDeposit')
                  }}</span>
                            <span>{{ curRatio | toFixed(2) }}%</span>
                        </el-col>
                    </el-row>
                    <el-row class="btn-group" :gutter="20" type="flex" justify="center">
                        <el-col :span="12">
                            <ApproveGuide
                                :symbol="symbol"
                                type="collateralToken"
                                @handle="approve('borrowApprove', $event)"
                            >
                                <el-button
                                    :disabled="$number(balance).isZero() || !isConnect"
                                    class="public-button-dark __button"
                                    @click="showMadel('mortgage')"
                                >
                                    {{ $t('Button.Mortgage') }}
                                </el-button>
                            </ApproveGuide>
                        </el-col>
                        <el-col :span="12" v-show="isAmountCollateral">
                            <el-button
                                :disabled="isAmountBorrow || isCurRatio"
                                :loading="outing"
                                class="public-button-dark __button"
                                @click="deposit"
                            >{{ $t('Button.TakeOut') }}
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24">
                <div class="container __paper">
                    <el-row tag="ul">
                        <el-col tag="li"><span class="title">STEP 2</span></el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.MyRepayable') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{ repayAssets | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.LoanAmount') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{
                                    info.amountBorrow | toFixed(supplyDes, true) | toFixed(4)
                                }}</span>
                        </el-col>
                        <el-col tag="li">
              <span class="label"
              >{{ $t('FundPool.LoanInterest') }}&nbsp;({{
                      symbol | pick('supplyTokenSymbol')
                  }})</span
              >
                            <span>{{ interests | toFixed(4) }}</span>
                        </el-col>
                        <el-col tag="li">
                            <span class="label">{{ $t('FundPool.DepositTips') }}</span>
                        </el-col>
                    </el-row>
                    <el-row class="btn-group" :gutter="20" type="flex" justify="center">
                        <el-col :span="12">
                            <el-button
                                @click="showMadel('loan')"
                                class="public-button-dark __button"
                                :disabled="!isAmountCollateral || isCurRatio"
                            >
                                {{ $t('Button.Loan') }}
                            </el-button>
                        </el-col>
                        <el-col :span="12">
                            <ApproveGuide
                                :symbol="symbol"
                                type="supplyToken"
                                @handle="approve('supplyApprove', $event)"
                                :status="supplyApprove"
                            >
                                <el-button
                                    @click="showMadel('repayment')"
                                    class="public-button-dark __button"
                                    :disabled="!isAmountCollateral || !isAmountBorrow"
                                >
                                    {{ $t('Button.Repayment') }}
                                </el-button>
                            </ApproveGuide>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <ModalBase
            :open.sync="visible"
            ref="modal"
            @submit="fetchContract"
            :append="modalConfig.token"
            :type="type"
            @change="changeIpt($event)"
            @allClick="sliderAmountChange(100)"
            :max-limit="modalConfig.value"
        >
            <template v-slot:header>
                <SymbolIcon style="margin-right: 10px" :token="modalConfig.token"/>
                {{ $t(modalConfig.title) }} {{ modalConfig.token }}
            </template>
            <template v-if="type === 'repayment'">
                <div class="mb20" >
                    <el-slider
                        v-model="sliderVal"
                        :step="0.0001"
                        :marks="marks"
                        :format-tooltip="formatTooltip"
                        @change="sliderAmountChange"
                        :max="100"
                    ></el-slider>
                </div>
                <div class="mt20 mb20">
                    {{ $t('FundPool.MyRepayable') }}:
                    {{ repayAssets | toFixed(4) }}&nbsp;{{ modalConfig.token }}
                </div>
            </template>

            <div>
                {{ $t(modalConfig.label) }}：<span
            >{{ modalConfig.available | toFixed(4) }}&nbsp;{{
                    modalConfig.token
                }}</span
            >
            </div>

            <div class="mt20" v-show="type === 'loan'">
                {{ $t('FundPool.RemainSupply') }}：<span
            >{{ remainSupply | toFixed(4) }} {{ modalConfig.token }}</span
            >
            </div>
        </ModalBase>
    </div>
</template>

<script>
import {fundPoolHelper} from '../../store/fundPool.module';
import {mapState} from 'vuex';
import ApproveGuide from './ApproveGuide';
import ModalBase from './ModalBase';
import SymbolIcon from '../../components/SymbolIcon';

export default {
    name: 'Borrow',
    components: {
        SymbolIcon,
        ModalBase,
        ApproveGuide,
    },
    data() {
        return {
            sliderVal: 0,
            visible: false,
            type: 'mortgage',
            balance: '',
            info: {},
            approving: false,
            pledgeRate: '0', //最大借存比
            liquidationRate: '0', //清算比例
            outing: false,
            minting: false,
            maxBorrow: 0,
            repayAmount: 0,
            interests: 0,
            curRatio: 0,
            aaaa: '--',
            cake: '--',
            walleAssetsNumber: '',
            marks: {},
        };
    },
    watch: {
        symbol: {
            handler(val) {
                console.log(val, 'symbol');
                if (val) {
                    this.getBalance();
                    this.takeBorrowPair();
                }
            },
            immediate: true,
        },
    },
    methods: {
        getMaxBorrow() {
            this.$store.dispatch('fundPool/getMaxBorrowAmount').then((res) => {
                this.maxBorrow = this.$number(res).shiftedBy(-this.supplyDes);
                console.log(res, 'getMaxBorrowAmount');
            });
        },
        mintCake() {
            if (this.isConnect) {
                this.minting = true;
                this.$store
                    .dispatch('fundPool/mintCake')
                    .then(() => {
                        this.msg();
                        this.getBalance();
                    })
                    .finally(() => (this.minting = false));
            }
        },
        msg() {
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },
        queryCake() {
            this.$store.dispatch('fundPool/queryCake').then((res) => {
                this.cake = this.$number(res).shiftedBy(-18);
            });
        },
        approve(type, val) {
            console.log('val...approve::', val);
            this.$store.commit(`fundPool/${type}`, val);
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
                this.$store.dispatch('fundPool/borrows', this.symbol.pair),
                this.$store.dispatch('balance', this.symbol.collateralToken),
                this.$api.getPairConf(this.symbol.pair),
            ]).then(([borrows, balance, rate]) => {
                console.log(borrows, 'borrows');

                this.info = {
                    ...borrows,
                };

                this.interests = this.$number(borrows.interests).shiftedBy(
                    -this.supplyDes
                );
                console.log('this.interests:', this.interests.toFixed());
                this.balance = balance;

                this.$store.commit(
                    'fundPool/borrowBalance',
                    this.$number(balance).shiftedBy(-this.borrowDes)
                );

                this.liquidationRate = this.$number(rate.liquidationRate)
                    .shiftedBy(-18)
                    .multipliedBy(100);
                this.pledgeRate = this.$number(rate.pledgeRate)
                    .shiftedBy(-18)
                    .multipliedBy(100);

                if (!this.$number(borrows.amountCollateral).isZero()) {
                    this.$api
                        .getRepayAmount(this.symbol.pair, borrows.amountCollateral)
                        .then((res) => {
                            console.log(res, '==getRepayAmount', this.supplyDes, this.symbol);
                            this.repayAmount = res;
                            // this.interests = this.$number(res).shiftedBy(-this.supplyDes).minus(this.info.amountBorrow);
                            this.curRatioFn();
                            this.getMarks();
                        });
                } else {
                    this.repayAmount = 0;
                }
            });
            this.getMaxBorrow();
            this.queryCake();
            this.getSupplyTokenBalance();
        },
        getSupplyTokenBalance() {
            this.$store.dispatch('balance', this.symbol.supplyToken).then((res) => {
                this.walleAssetsNumber = this.$number(res).shiftedBy(-this.supplyDes);
            });
        },
        takeBorrowPair() {
            this.$store.dispatch('fundPool/takeBorrowPair').then((res) => {
                this.aaaa = this.$number(res);
            });
        },
        //borrow/deposit
        curRatioFn() {
            Promise.all([
                this.$api.getPrice(this.symbol.supplyToken),
                this.$api.getPrice(this.symbol.collateralToken),
            ]).then(([supplyPrice, collateralPrice]) => {
                if (supplyPrice == 0 && collateralPrice == 0) {
                    this.curRatio = 0;
                } else if (this.info.amountCollateral == 0) {
                    this.curRatio = 0;
                } else {
                    this.curRatio = this.$number(this.repayAmount)
                        .multipliedBy(supplyPrice)
                        .dividedBy(
                            this.$number(this.info.amountCollateral).multipliedBy(
                                collateralPrice
                            )
                        )
                        .multipliedBy(100);
                }
            });
        },

        deposit() {
            this.outing = true;
            const val = this.mortgageAssets.toString();
            this.$store
                .dispatch('fundPool/repay', {value: val})
                .then((receipt) => {
                    this.$api.elogRepay(receipt);
                    this.msg();
                    this.getBalance();
                    this.upDataPool();
                })
                .finally(() => {
                    this.outing = false;
                });
        },
        fetchContract({value, next, reset}) {
            console.log('fetchContract value:', value, this.type);
            let request;
            switch (this.type) {
                case 'mortgage':
                    request = this.$store.dispatch('fundPool/borrow', {
                        amountCollateral: value,
                        expectBorrow: 0,
                    });
                    break;
                case 'loan':
                    request = this.$store.dispatch('fundPool/borrow', {
                        amountCollateral: 0,
                        expectBorrow: value,
                    });
                    break;
                case 'repayment':
                    const val = this.$number(this.info?.amountCollateral).shiftedBy(
                        -this.borrowDes
                    );
                    let cValue =
                        this.sliderVal >= 100
                            ? val.toFixed(18, 1)
                            : val.multipliedBy(this.sliderVal).dividedBy(100).toFixed(18, 1);
                    // console.log('repayment:', cValue, value)
                    request = this.$store.dispatch('fundPool/repay', {
                        value: cValue,
                        lendValue: value,
                    });
                    break;
            }

            request
                .then(() => {
                    this.msg();
                    this.getBalance();
                    this.getSupplyTokenBalance();
                    reset();
                    this.visible = false;
                    this.upDataPool();
                })
                .finally(next);
        },

        upDataPool() {
            this.$store.dispatch('poolList');
        },
        changeIpt($event) {
            const number = this.$number(this.repayAmount).shiftedBy(-this.supplyDes);
            const val = Number(
                this.$number($event).dividedBy(number).multipliedBy(100).toFixed()
            );
            this.sliderVal = Math.ceil(val) >= 100 ? 100 : val;
        },
        //滑动条分段设定
        getMarks() {
            this.marks = {};
            const step = 25; // this.$number(this.info?.amountCollateral).shiftedBy(-this.borrowDes) / 4;
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
        },
        //滑块数量改变
        sliderAmountChange(res) {
            this.sliderVal = res;

            const val = this.$number(this.repayAmount).shiftedBy(-this.supplyDes);
            // console.error('//滑块数量改变',res,  this.modalConfig.available.toFixed(), val.multipliedBy(res).dividedBy(100).toFixed())

            const realAmount = val.multipliedBy(res).dividedBy(100).toFixed()
            let amount = '';
            if(this.$comparedTo(realAmount, this.modalConfig.available) === 1){
                amount = this.modalConfig.available
            }else amount = realAmount
            this.$refs.modal.amount = amount;
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
        ...fundPoolHelper.mapState(['supplyBalance', 'supplyApprove']),

        ...fundPoolHelper.mapGetters({
            config: 'symbolConfig',
            symbol: 'symbol',
            supplyDes: 'supplyDes',
            borrowDes: 'borrowDes',
        }),
        walleAssets() {
            return this.$number(this.balance).shiftedBy(-this.borrowDes);
        },
        mortgageAssets() {
            return this.$number(this.info?.amountCollateral).shiftedBy(
                -this.borrowDes
            );
        },
        repayAssets() {
            return this.$number(this.repayAmount).shiftedBy(-this.supplyDes);
        },
        remainSupply() {
            return this.$number(this.symbol?.remainSupply || 0).shiftedBy(
                -this.supplyDes
            );
        },
        modalConfig() {
            const val = this.symbol
                ? Math.min(this.remainSupply, this.maxBorrow)
                : this.maxBorrow;
            return {
                mortgage: {
                    title: 'Button.Mortgage',
                    value: this.walleAssets,
                    label: 'Staking.AvailableAsset',
                    token: this.symbol?.collateralTokenSymbol || '--',
                    available: this.walleAssets,
                },
                repayment: {
                    title: 'Button.Repayment',
                    value: this.$number(this.info?.amountCollateral).shiftedBy(
                        -this.borrowDes
                    ), // this.repayAssets, // this.walleAssetsNumber,// this.repayAssets,
                    label: 'Staking.AvailableAsset',
                    token: this.symbol?.supplyTokenSymbol || '--',
                    available: this.walleAssetsNumber,
                },
                loan: {
                    title: 'Button.Loan',
                    label: 'FundPool.canLoan',
                    value: val,
                    token: this.symbol?.supplyTokenSymbol || '--',
                    available: val,
                },
            }[this.type];
        },

        isAmountCollateral() {
            return (
                this.$number(this.info.amountCollateral).isGreaterThan(0) &&
                this.isConnect
            );
        },
        isCurRatio() {
            return (
                this.$number(this.curRatio).isGreaterThanOrEqualTo(60) && this.isConnect
            );
        },
        isAmountBorrow() {
            return (
                this.$number(this.info.amountBorrow).isGreaterThan(0) && this.isConnect
            );
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
        // sliderVal: {
        //     get() {
        //         console.log('get sliderVal',this.sliderVal);
        //         return +this.$refs.modal.amount
        //     },
        //     set(val) {
        //         console.log('set sliderVal', this.sliderVal);
        //         this.$refs.modal.amount = val
        //     }
        // }
    },
};
</script>

<style>
    .el-slider__marks-text:last-child{
        width: 50px !important;
    }
</style>
<style lang="less" scoped>


.label {
    color: var(--col-label);
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
