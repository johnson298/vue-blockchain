<template>
    <div class="fund-pool">
        <header>
            <router-link to="/lending">
                <div class="back">
                    <a-icon class="icon-back" type="icon-back" :space="true"/>
                    {{ $t('Button.Return') }}
                </div>
            </router-link>
        </header>
        <main>
            <div class="content">
                <div class="title between-center">
                    <h3>{{ $t('Account.FundPool') }}</h3>
                    <el-switch
                        class="__switch"
                        v-model="isBorrow"
                        :active-text="`${$t('Button.Loan')} ${
              symbol ? symbol.supplyTokenSymbol : '--'
            }`"
                        :inactive-text="`${$t('FundPool.Charging')} ${
              symbol ? symbol.supplyTokenSymbol : '--'
            }`"
                    >
                    </el-switch>
                </div>
                <el-row class="row-title">
                    <el-col :sm="24">
                        <div class="title between-center __paper">
                            <LPSymbol :pool="symbol"/>
                            <el-dropdown trigger="click" @command="command">
                                <div class="el-dropdown-link">
                                    {{
                                        $t('FundPool.Switch')
                                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="(item, index) in poolList"
                                        :command="item"
                                        :key="index"
                                    >
                                        <LPSymbol
                                            :select="true"
                                            :pool="item"
                                            :space="index < poolList.length - 1"
                                        />
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                    <el-col :sm="24">
                        <div class="title between-center __paper">
                            <template v-if="!isBorrow">
                                <span>{{ $t('FundPool.APY') }}</span>
                                <span style="color: var(--col-main)"
                                >{{ symbol | pick('apy') }} %</span
                                >
                            </template>
                            <template v-else>
                                <span>{{ $t('FundPool.APR') }}</span>
                                <span style="color: var(--col-main)"
                                >{{ symbol | pick('apr') }} %</span
                                >
                            </template>
                        </div>
                    </el-col>
                </el-row>
                <div class="">
                    <Deposit v-if="!isBorrow"/>
                    <Borrow v-if="isBorrow"/>
                </div>
            </div>

            <div class="content">
                <div class="title between-center">
                    <h3>{{ $t('FundPool.Survey') }}</h3>
                    <LPSymbol :pool="symbol"/>
                </div>
                <!-- <el-row :gutter="40">
                        <el-col :xs="24" :sm="24" :md="12">
                            <ChartOfDeposit class="chart" :symbol="symbol"/>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12">
                            <ChartOfBorrow class="chart" :symbol="symbol"/>
                        </el-col>
                    </el-row> -->
            </div>

            <div class="content pd-20">
                <h3 class="title-pie">
                    ${{ symbol | pick('totalSupplyValue') | toFixed(2) | toFormat }}
                </h3>
                <el-row type="flex" align="middle">
                    <el-col :span="8">
                        <Legend
                            :title="$t('Account.AmountLoan')"
                            :value="
                symbol
                  | pick('totalBorrow')
                  | toFixed(symbol ? symbol.supplyTokenDecimals : 0, true)
                  | toFixed(2)
                  | toFormat
              "
                            :token="symbol | pick('supplyTokenSymbol')"
                        />
                    </el-col>
                    <el-col :span="8">
                        <ChartOfPie :symbol="symbol"/>
                    </el-col>
                    <el-col :span="8">
                        <Legend
                            :title="$t('Account.AmountDeposits')"
                            :value="
                symbol
                  | pick('remainSupply')
                  | toFixed(symbol ? symbol.supplyTokenDecimals : 0, true)
                  | toFixed(2)
                  | toFormat
              "
                            style="color: var(--col-deposit)"
                            :token="symbol | pick('supplyTokenSymbol')"
                        />
                    </el-col>
                </el-row>
                <ContentDesc/>
                <MiningRevenue :symbol="symbol"></MiningRevenue>
            </div>
        </main>
    </div>
</template>

<script>
import Deposit from './Deposit.vue';
import Borrow from './Borrow';
import ChartOfBorrow from './ChartOfBorrow';
import ChartOfDeposit from './ChartOfDeposit';
import ChartOfPie from './ChartOfPie';
import ContentDesc from './ContentDesc';
import Legend from './Legend';
import {mapGetters, mapState} from 'vuex';
import {fundPoolHelper} from '@/store/fundPool.module';
import LPSymbol from '../../components/LPSymbol';
import MiningRevenue from '../account/mining-revenue';

export default {
    name: 'FundPool',
    components: {
        LPSymbol,
        Legend,
        ContentDesc,
        ChartOfPie,
        ChartOfDeposit,
        ChartOfBorrow,
        Borrow,
        Deposit,
        // MiningRevenue,
    },
    data() {
        return {
            isBorrow: this.$route.query.type !== '0',
        };
    },
    computed: {
        // ...mapState(['poolList']),
        ...mapGetters(['poolsMap']),
        ...fundPoolHelper.mapGetters(['symbol']),
        poolList() {
            return this.poolsMap[this.$route.params.supply];
        },
    },
    methods: {
        command(res) {
            this.$router.push({
                name: 'FundPool',
                query: {
                    type: this.$route.query.type || '0',
                },
                params: {
                    supply: res.supplyTokenSymbol,
                    currency: `${res.lpToken0Symbol}-${res.lpToken1Symbol}`,
                },
            });
        },
    },
    watch: {
        $route: {
            handler() {
                this.$store.commit('fundPool/routeParams', this.$route.params);
            },
            immediate: true,
        },
        symbol: {
            handler(val) {
                if (val) {
                    console.log('fundPool/chartData');
                    this.$store.dispatch('fundPool/chartData');
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less" scoped>
.between-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.fund-pool {
    color: var(--col-label);
}

.pd-20 {
    padding: 0 20px;
}

.fund-pool {
    //background-color: var(--col-background);
    border-radius: 12px;

    main {
        padding-bottom: 20px;
    }

    .content {
        margin-bottom: 30px;
    }

    header {
        height: 80px;
        font-size: 24px;
        border-bottom: 1px solid var(--col-border);
        display: flex;
        align-items: center;

        & .icon-back {
            font-size: 24px;
            margin-right: 5px;
        }

        .back {
            cursor: pointer;
            display: flex;
            align-items: center;
            color: var(--col-label);
        }
    }

    .title {
        height: 112px;
        font-size: 24px;
    }

    .el-dropdown-link {
        cursor: pointer;
        font-size: 24px;
    }

    .title-pie {
        font-weight: 600;
        font-size: 48px;
        line-height: 48px;
        text-align: center;
        color: var(--col-borrow);
    }

    .chart {
        margin-bottom: 30px;
    }

    .row-title {
        //padding: 0 20px;
    }
}

@media (min-width: 960px) {
    .fund-pool {
        padding-bottom: 50px;
        font-size: 16px;

        .content {
            margin-bottom: 30px;
        }

        header {
            font-size: 16px;

            & .icon-back {
                font-size: 18px;
                margin-right: 5px;
            }
        }

        .title {
            font-size: 20px;
            //padding: 0 20px;
        }

        .row-title {
            font-size: 20px;
            height: auto;
            //margin-bottom: 20px;

            .title {
                height: 90px;
                margin-bottom: 20px;
                //padding: 0 20px;
            }
        }

        .title-pie {
            font-weight: 600;
            font-size: 48px;
            line-height: 48px;
        }
    }
}
</style>
