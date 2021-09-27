<template>
    <a-chart class="chart" :options="options"/>
</template>

<script>
import {fundPoolHelper} from '../../store/fundPool.module';

export default {
    name: 'ChartOfDeposit',
    props: {
        symbol: null,
    },
    data() {
        return {
            options: null,
        };
    },
    computed: {
        ...fundPoolHelper.mapState(['dataOfSupplyChart']),
        color() {
            return this.$store.getters.rootStyles('--col-chart-label');
        },
    },
    watch: {
        dataOfSupplyChart: {
            handler(val) {
                if (val.value.length) {
                    this.options = {
                        title: {
                            text: this.$t('FundPool.DepositInterestRate'),
                            textStyle: {
                                color: this.color,
                            },
                        },
                        tooltip: {},
                        xAxis: {
                            axisLine: {
                                lineStyle: {
                                    color: this.color,
                                },
                            },
                            nameTextStyle: {
                                color: this.color,
                            },
                            data: val.title,
                        },
                        color: [this.$store.getters.rootStyles('--col-main')],
                        yAxis: {
                            axisLine: {
                                lineStyle: {
                                    color: this.color,
                                },
                            },
                            axisLabel: {
                                formatter: '{value} %',
                            },
                            nameTextStyle: {
                                color: this.color,
                            },
                        },
                        series: [
                            {
                                // name: "销量",
                                type: 'line',
                                data: val.value,
                            },
                        ],
                    };
                }
            },
        },
    },
};
</script>

<style scoped>
.chart {
    height: 410px;
    overflow: hidden;
    padding: 10px;
    background-color: var(--col-card-background-default);
    border-radius: 8px;
}

@media (min-width: 960px) {
    .chart {
        height: 310px;
    }
}
</style>
