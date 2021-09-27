<template>
    <el-row type="flex" :gutter="20">
        <el-col :span="12">
            <div class="container-type container-type-1">
                <header>{{ $t('FundPool.FloatingRateLoan') }}</header>
                <el-row tag="ul">
                    <el-col tag="li">
            <span class="left">{{
                    $t('FundPool.Table.AnnuaLisationLoans')
                }}</span>
                        <span class="right"
                        >{{ symbol | pick('apr') | toFixed(2) | moreLessThan }} %</span
                        >
                    </el-col>
                    <el-col tag="li">
                        <span class="left">{{ $t('FundPool.Past30DAvg') }}</span>
                        <span class="right">--%</span>
                    </el-col>
                    <!--                <el-col tag="li">-->
                    <!--                    <span>{{$t('FundPool.PercentageTotal')}}</span>-->
                    <!--                    <span>0.03%</span>-->
                    <!--                </el-col>-->
                </el-row>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="container-type container-type-2">
                <header>{{ $t('Account.DepositText') }}</header>
                <el-row tag="ul">
                    <el-col tag="li">
                        <span class="left">{{ $t('FundPool.Table.AnnualDeposit') }}</span>
                        <span class="right2"
                        >{{ symbol | pick('apy') | toFixed(2) | moreLessThan }} %</span
                        >
                    </el-col>
                    <el-col tag="li">
                        <span class="left">{{ $t('FundPool.Past30DAvg') }}</span>
                        <span class="right2">--%</span>
                    </el-col>
                </el-row>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {fundPoolHelper} from '../../store/fundPool.module';

export default {
    name: 'ContentDesc',
    computed: {
        ...fundPoolHelper.mapGetters(['symbol']),
    },
};
</script>

<style lang="less" scoped>
.container-type {
    height: 100%;
}

.left {
    color: var(--col-label);
}

.right {
    color: var(--col-borrow);
}

.right2 {
    color: var(--col-deposit);
}

.container-type-1 {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    color: var(--col-borrow);

    header {
        color: var(--col-main-active);
        background: rgba(255, 255, 255, 0.05);;
        border-radius: 8px 8px 0px 0px;
    }
}

.container-type-2 {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    color: var(--col-deposit);

    header {
        color: var(--col-main-active);
        background: rgba(255, 255, 255, 0.05);;
        border-radius: 8px 8px 0px 0px;
    }
}

header {
    line-height: 48px;
    padding: 0 20px;
    font-size: 16px;
}

ul {
    padding: 20px;
    font-size: 14px;

    li {
        display: flex;
        justify-content: space-between;

        &:not(:last-child) {
            padding-bottom: 20px;
        }
    }
}
</style>
