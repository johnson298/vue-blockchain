<template>
    <div class="mining-revenue">
        <el-table
            :empty-text="$t('Public.NotData')"
            class="__table"
            :data="list"
            style="width: 100%"
        >
            <el-table-column :label="$t('Parameter.Name')">
                <template slot-scope="scope">
                    <div class="logo">
                        <Logo/>
                        <span style="margin-left: 10px">{{ $project }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('Account.AccountBalance')">
                <template slot-scope="scope">
                    <span>{{ scope.row.cumulative | toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column align="right" :label="$t('Account.MiningRevenue')">
                <template slot-scope="scope">
                    <span>{{ scope.row.takeAllValue | toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.takeAllValue <= 0"
                        :loading="scope.row.loading"
                        @click="miningClick(scope.row)"
                        class="public-button-dark"
                    >
                        {{ $t('Mobility.Receive') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import ChainApi from '../../../static/sdk/ChainApi';
import Logo from '../../components/Logo';

export default {
    name: 'mining-revenue',
    components: {Logo},
    props: {
        symbol: null,
    },
    watch: {
        symbol: {
            handler(value) {
                this.init();
            },
            immediate: true,
        },
    },
    data() {
        return {
            loading: false,
            list: [
                {
                    takeAllValue: '',
                    cumulative: '',
                    loading: false,
                },
            ],
        };
    },
    mounted() {
    },
    methods: {
        init() {
            if (this.symbol) {
                Promise.all([
                    this.$api.take(this.symbol.pair),
                    this.$store.dispatch(
                        'tokenBalance',
                        this.$api.getTokenAddress(this.$project)
                    ),
                ]).then(([takeAll, tokenBalance]) => {
                    console.log('takeA:', takeAll, this.symbol);
                    this.list = [
                        {
                            takeAllValue: this.$number(takeAll).shiftedBy(-18),
                            cumulative: tokenBalance,
                            loading: false,
                        },
                    ];
                });
            }
        },
        miningClick(data) {
            if (this.symbol) {
                data.loading = true;
                ChainApi.mint(this.symbol.pair).then(hash => {
                    return ChainApi.awaitTransactionMined(hash);
                }).then(receipt => {
                    this.$message({
                        message: this.$t('Public.OperationSuccess'),
                        showClose: true,
                        type: 'success',
                    });
                    this.init();
                    ChainApi.elogMint(receipt);
                }).finally(() => {
                    data.loading = false;
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.mining-revenue {
    margin-top: 20px;
    //padding: 0 30px;
}

.logo {
    height: 26px;
    display: flex;
    align-items: center;
    color: var(--col-main);
}

@media (max-width: 960px) {
    .mining-revenue {
        //padding: 0 30px;
    }
}
</style>
