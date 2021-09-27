<template>
    <a-chart class="chart" :options="options"/>
</template>

<script>
export default {
    name: 'ChartOfPie',
    props: {
        symbol: null,
    },
    data() {
        return {
            options: null,
        };
    },
    watch: {
        symbol: {
            handler(value) {
                this.setOption();
            },
            immediate: true,
        },
    },
    methods: {
        setOption() {
            if (this.symbol) {
                const totalBorrow = this.$number(this.symbol.totalBorrow)
                    .shiftedBy(-this.symbol.supplyTokenDecimals)
                    .toString();
                const remainSupply = this.$number(this.symbol.remainSupply)
                    .shiftedBy(-this.symbol.supplyTokenDecimals)
                    .toString();
                this.options = {
                    series: [
                        {
                            type: 'pie',
                            radius: ['50%', '70%'],
                            clockwise: false,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center',
                                formatter: (data) => {
                                    // 设置圆饼图中间文字排版
                                    let text = this.$t(
                                        data.dataIndex === 0
                                            ? 'Account.AmountLoan'
                                            : 'Account.AmountDeposits'
                                    );
                                    return (
                                        text + '\n\r\n\r' + this.$number(data.value).toFixed(4)
                                    );
                                },
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontWeight: 'bold',
                                },
                            },
                            labelLine: {
                                show: false,
                            },
                            data: [
                                {value: totalBorrow, name: '借款数量'},
                                {value: remainSupply, name: '存款数量'},
                            ],
                        },
                    ],
                    color: [
                        this.$store.getters.rootStyles('--col-borrow'),
                        this.$store.getters.rootStyles('--col-deposit'),
                    ],
                };
            }
        },
    },
    mounted() {
        this.setOption();
    },
};
</script>

<style scoped>
</style>
