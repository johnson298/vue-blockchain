<template>
    <div class="BTrade">
        <div class="tradeList TBorder">
            <div class="nav">
                <div class="navContainer">
                    <button :class="['navbtn', active === 'trade' ? 'navbtn-on' : '']" @click="checkNav('trade')">
                        {{ $t('MyData.Trade') }}
                    </button>
                    <button :class="['navbtn', active === 'revenue' ? 'navbtn-on' : '']" @click="checkNav('revenue')">
                        {{ $t('MyData.Revenue') }}
                    </button>
                </div>
                <div class="">
                    <button :class="['btn', timeActive === 'week' ? 'btn-on' : 'btn-off']"
                            @click="check('week')">1 week
                    </button>
                    <button :class="['btn', timeActive === 'month' ? 'btn-on' : 'btn-off']"
                            @click="check('month')">1 month
                    </button>
                </div>
            </div>
            <div class="chart_container" id="chart_container"></div>
        </div>


        <div class="governance TBorder">
            <div class="title">Governance</div>
            <div class="pane pane1">
                <div class="paneLeft">
                    <p class="p1">Participation Vote</p>
                    <p class="p2">{{ myInfo.balletCount + '/' + myInfo.totalBalletCount }}</p>
                    <p class="p1">Vote Revenue (BURGER)</p>
                    <p class="p2">{{ myInfo.accRewardsValue }}</p>
                </div>
                <div class="paneRight">
                    <span class="per trade-cirque">
                        <div class="left">
                            <span class="semi-circle"></span>
                        </div>
                        <div class="right">
                            <span class="semi-circle"></span>
                        </div>
                        <div class="progress">{{ myInfo.governancePer + '%' }}</div>
                    </span>
                    <div class="circleTextCon">
                        <span class="text">
                            <span class="circle"></span>
                            <span>Voted</span>
                        </span>

                        <span class="text">
                            <span class="circle1"></span>
                            <span>Unvoted</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bridge TBorder">
            <div class="title">Bridge</div>
            <div class="pane2">
                <div class="listTitle"> Cosschain assets</div>

                <div class="paginatePane">

                </div>
            </div>
            <div class="croTotals">
                <!--                <img src={ICON_USD}/>-->
                <span class="croAss">Crosschain assets value</span>
                <span class="croAssUSD">{{ totalUSDTtokens }} USD</span>

            </div>

        </div>


    </div>
</template>

<script>
import {Chart, registerShape} from '@antv/g2';
import {getIcon} from '@/assets/js/tokenMap';

let chart = Chart;
export default {
    name: 'BTrade',
    data() {
        return {
            active: 'trade',
            timeActive: 'week',
            tradeList: [],
            address: '',
            tokens: null,
            pageLen: null,
            curtokens: [],
            totalUSDTtokens: '',
            myInfo: {
                balletCount: '--',
                totalBalletCount: '--',
                accRewardsValue: '--',
                governancePer: '--',
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$swap.accountStatusObservable.subscribe(account => {
                if (account) {
                    this.address = account.toLocaleLowerCase();
                    this.getTotalData();
                }
            });
        },
        check(type) {
            if (this.timeActive === type) {
                return;
            }
            this.timeActive = type;
            if (this.tradeList.length === 0) {
                return;
            }
            if (this.timeActive === 'time') {
                if (this.active === 'trade') {
                    // @ts-ignore
                    this.renderChart(this.tradeList.slice(-7), this.tradeList[0].expected);
                } else {
                    // @ts-ignore
                    this.renderChartRevenue(this.tradeList.slice(-7), this.tradeList[0].expected);
                }
            } else {
                if (this.active === 'trade') {
                    // @ts-ignore
                    this.renderChart(this.tradeList, this.tradeList[0].expected);
                } else {
                    // @ts-ignore
                    this.renderChartRevenue(this.tradeList, this.tradeList[0].expected);
                }
            }


        },
        checkNav(type) {
            if (type === this.active && window['chart1']) {
                return;
            }

            this.active = type;
            if (this.tradeList.length === 0) {
                return;
            }
            // @ts-ignore
            if (window['chart1']) {
                // @ts-ignore
                window['chart1'].destroy();
                // @ts-ignore
                window['chart1'] = null;
            }
            if (this.active === 'trade') {
                if (this.timeActive === 'week') {
                    // @ts-ignore
                    this.renderChart(this.tradeList.slice(-7), this.tradeList[0].expected);
                } else {
                    // @ts-ignore
                    this.renderChart(this.tradeList, this.tradeList[0].expected);
                }


            } else {
                if (this.timeActive === 'week') {
                    // @ts-ignore
                    this.renderChartRevenue(this.tradeList.slice(-7), this.tradeList[0].expected);
                } else {
                    // @ts-ignore
                    this.renderChartRevenue(this.tradeList, this.tradeList[0].expected);
                }
            }
        },
        renderChartRevenue(activeData = [], max = 1200) {
            // @ts-ignore
            if (!window['chart1'] || (!document.body.contains(window['chart1'].ele))) {
                chart = new Chart({
                    container: 'chart_container',
                    autoFit: true,
                    height: 330,
                    padding: [10, 30, 50, 50],
                });
                // @ts-ignore
                window['chart1'] = chart;

                chart.scale({
                    date: {
                        range: [0, 1],
                    },
                    Revenue: {
                        min: 0,
                        nice: true,
                    },
                });


                chart.tooltip({
                    showCrosshairs: true, // 展示 Tooltip 辅助线
                    shared: true,
                });
                chart
                    .line()
                    .position('date*Revenue')
                    .color('#F0B80B')
                    .label('value');

                // chart.line().position('date*Revenue').label('value');
                chart
                    .point()
                    .position('date*Revenue')
                    .color('#F0B80B');


            } else {
                // @ts-ignore
                chart = window['chart1'];
                // chart.clear();
            }

            chart.data(activeData);
            chart.render();


        },
        renderChart(activeData = [], max = 1200) {
            registerShape('interval', 'border-radius', {
                draw(cfg, container) {
                    const points = cfg.points;
                    let path = [];
                    // @ts-ignore
                    path.push(['M', points[0].x, points[0].y]);
                    // @ts-ignore
                    path.push(['L', points[1].x, points[1].y]);
                    // @ts-ignore
                    path.push(['L', points[2].x, points[2].y]);
                    // @ts-ignore
                    path.push(['L', points[3].x, points[3].y]);
                    path.push('Z');
                    // @ts-ignore
                    path = this.parsePath(path); // 将 0 - 1 转化为画布坐标

                    const group = container.addGroup();
                    //cfg.color
                    group.addShape('rect', {
                        attrs: {
                            x: path[1][1], // 矩形起始点为左上角
                            y: path[1][2],
                            width: path[2][1] - path[1][1],
                            height: path[0][2] - path[1][2],
                            fill: cfg.color,
                            radius: (path[2][1] - path[1][1]) / 2,
                        },
                    });

                    return group;
                },
            });
            //{date: '2017年3月34日', actual: 69.1, expected: 1200},
            // @ts-ignore
            if (!window['chart1'] || (!document.body.contains(window['chart1'].ele))) {
                chart = new Chart({
                    container: 'chart_container',
                    autoFit: true,
                    height: 330,
                    padding: [15, 15, 50, 50],
                });
                // @ts-ignore
                window['chart1'] = chart;
                chart.scale({
                    expected: {
                        min: 0,
                        max: max,
                        sync: 'value',
                    },
                    Trade: {
                        sync: 'value',
                    },
                });

                // chart.axis('date', false);
                chart.axis('Trade', false);
                chart.axis('expected', {
                    line: null,
                    tickLine: null,
                    title: null,
                    position: 'left',
                    label: {
                        formatter: (val) => {
                            if (val === '1200') {
                                return '1200';
                            }
                            return val;
                        },
                    },
                });
                chart.legend(false);
                chart.tooltip({
                    shared: true,
                    showMarkers: false,
                });

                chart
                    .interval()
                    .position('date*expected')
                    .color('#F0B80B0C')
                    .shape('border-radius')
                    .tooltip('')
                    .style({
                        opacity: 0.6,
                    });
                chart
                    .interval()
                    .position('date*Trade')
                    .color('#F0B80B')
                    .tooltip('Trade')
                    .style({
                        color: '#F0B80B',
                    })
                    // @ts-ignore
                    .shape('date*Trade', (_date, val) => {
                        // if (val/max <= 0.06) {
                        //     return;
                        // }
                        // return 'border-radius';
                    });

                chart.interaction('active-region');

            } else {
                // @ts-ignore
                chart = window['chart1'];
                // chart.clear();
            }

            chart.data(activeData);
            chart.render();


        },
        getTotalData() {
            console.log('address::>', this.address);
            if (this.address.length < 5) {
                return;
            }
            this.$store.dispatch('home/getRewards', this.address).then(data => {
               console.log(data, "home/getRewards");
                //tokenlist
                if (data?.data?.crossTokenEntities) {
                    let data1 = data?.data?.crossTokenEntities;
                    let totalUSDT = '0.00';
                    let _tokens = {};
                    data1.map((item) => {
                        if (item.id.toLocaleLowerCase() === address) {
                            totalUSDT = this.$number(item.amountUSDT).toFormat(4, 1);
                        } else {
                            if (_tokens[item.token.id]) {
                                _tokens[item.token.id].amount += Number(item.amount);
                            } else {
                                _tokens[item.token.id] =
                                    {
                                        icon: getIcon(item.token.address),
                                        symbol: item.token.symbol,
                                        id: item.token.id,
                                        amount: Number(item.amount),
                                    };
                            }
                        }
                    });

                    _tokens = Object.values(_tokens);
                    this.tokens = _tokens;

                    this.pageLen = Math.max(1, Math.floor(_tokens.length / 3));
                    this.curtokens = _tokens.slice(0, 3);
                    this.totalUSDTtokens = totalUSDT;
                }
                console.log('success set token list');

                //trade+revenue
                if (data?.data?.dailyRewardsEntities) {
                    let data1 = data?.data?.dailyRewardsEntities;

                    data1.map((item) => {
                        item.expected = 100;
                        item.Trade = Number(Number(item.accSwapValue).toFixed(4));
                        item.Revenue = Number(Number(item.rewardsAmount).toFixed(4));
                        item.n = item.date;
                        let dd = new Date(Number(item.date) * 1000);
                        item.date = (dd.getMonth() + 1) + '/' + (dd.getDate());

                        return item;
                    });

                    data1.sort((a, b) => {
                        return a.n - b.n;
                    });

                    for (let i = data1.length - 1; i >= 1; i--) {
                        data1[i].Trade = Number((data1[i].Trade - data1[i - 1].Trade).toFixed(4));
                        data1[i].Revenue = Number((data1[i].Revenue - data1[i - 1].Revenue).toFixed(4));
                    }
                    let maxp = 10;
                    data1.map((item) => {
                        maxp = Math.max(maxp, Number(item.Trade));
                    });
                    maxp = Math.floor(maxp * 1.25);
                    data1.map((item) => {
                        item.expected = maxp;
                        delete item.accRewardsValue;
                        delete item.accSwapValue;
                        return item;
                    });

                    let curd = Math.floor(Math.floor(Date.now() * 0.001) / 86400) * 86400;
                    let monthlist = [];
                    for (let i = 0; i < 31; i++) {
                        let dd = new Date(Number(curd - (86400) * i) * 1000);
                        monthlist.push(
                            {
                                n: curd - (86400) * (i),
                                date: (dd.getMonth() + 1) + '/' + (dd.getDate()),
                                expected: maxp,
                                Trade: 0,
                                Revenue: 0,
                            },
                        );
                    }

                    console.log('loop-length', data1.length, monthlist);

                    monthlist = monthlist.map((item) => {
                        // @ts-ignore
                        let ele = data1.find(i => {
                            return i.n === item.n;
                        });
                        if (ele) {
                            return ele;
                        }
                        return item;
                    });
                    monthlist.sort((a, b) => {
                        return a.n - b.n;
                    });

                    console.log('loop-length2', data1.length, monthlist);
                    this.tradeList = monthlist;
                }
                console.log('success set monthlist');
                //governance data
                if (data?.data?.playerRewardsEntities) {
                    let data1 = data?.data?.playerRewardsEntities;
                    if (data1.length >= 2) {
                        data1.balletCount = Number(data1[0].balletCount);
                        data1.totalBalletCount = Number(data1[1].balletCount);
                        data1.accRewardsValue = this.$number(data1[0].govAmount).toFormat(2, 1);

                        data1.governancePer = this.$number(100 * data1[0].balletCount / data1[1].balletCount).toFormat(2, 1);
                        this.myInfo = data1;

                        // console.log("finished-set-myInfo=", myInfo,data1.governancePer,data1)
                        this.upGovernanceVotePer(Number(data1.governancePer));
                        console.log('success set myInfo', this.myInfo);
                    }
                }

                this.checkNav('trade');
                // document.getElementsByClassName('btnContainer')[0].firstElementChild.click();

                console.log('success set data');

            });
        },
        upGovernanceVotePer(per = 0) {   //0-100
            per = per * 0.01;
            if (per <= 0.5) {
                // @ts-ignore
                document.getElementsByClassName('trade-cirque')[0].children[1].firstElementChild.style.transform = 'rotateZ(' + (180 + 360 * per) + 'deg)';
            } else {
                // @ts-ignore
                document.getElementsByClassName('trade-cirque')[0].children[1].firstElementChild.style.transform = 'rotateZ(0deg)';
                // @ts-ignore
                document.getElementsByClassName('trade-cirque')[0].firstElementChild.firstElementChild.style.transform = 'rotateZ(' + (-180 + 360 * (per - 0.5)) + 'deg)';
            }
        }
    }
};
</script>

<style lang="less" scoped>
.BTrade {
    width: 100%;
    position: relative;
    font-size: 14px;

    .TBorder {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }


    .tradeList {
        height: 460px;
        margin-bottom: 48px;
        padding: 24px;

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .navbtn {
                color: #fff;
                padding: 3px 0;
                font-size: 24px;
                min-width: auto;
                min-height: 40px;
                font-weight: 700;
                line-height: 1;
                margin-right: 40px;
                text-transform: none;
                background-color: transparent;
                border: 0;
                outline: none;
                cursor: pointer;
            }

            .navbtn:focus, .navbtn:hover {
                color: #f0b80b;
            }

            .navbtn-on {
                color: #f0b80b;
                font-weight: 500;
                border-bottom: 4px solid #f0b80b;
            }

        }

        .chart_container {
            height: 80%;
        }

        .btn {
            width: 80px;
            height: 34px;
            border-radius: 16px;
            font-size: 12px;

            letter-spacing: 0px;
            text-align: center;
            cursor: pointer;
            margin-left: 24px;
            outline: none;
        }


        .btn-off {
            background: rgba(240, 184, 11, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.5);
            color: rgba(255, 255, 255, 0.5);
        }

        .btn-on {
            background: rgba(240, 184, 11, 0.05);
            border: 1px solid rgba(240, 184, 11, 1);
            color: #F0B80B;
        }

    }

    .title {
        color: #F0B80B;
        font-family: Inter;
        font-weight: bold;
        font-size: 18px;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        padding: 24px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .pane {
        position: relative;
        display: flex;
        flex-direction: row;
        padding: 24px 0;
    }

    .tokenItem {
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.05);
        padding: 14px 24px;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;

        .panmin {
            display: flex;
            align-items: center;
        }

        img {
            width: 32px;
            height: 32px;
        }

        .span1 {
            color: rgba(240, 184, 11, 1);
            font-family: Roboto;
            font-weight: bold;
            font-size: 16px;
            line-height: 14px;
            letter-spacing: 0px;
            text-align: left;
            margin-left: 9px;
        }

        .span2 {
            color: rgba(240, 184, 11, 1);
            font-family: Roboto;
            font-weight: bold;
            font-size: 14px;
            line-height: 14px;
            letter-spacing: 0px;
            text-align: right;
        }
    }

    .governance {
        margin-bottom: 48px;

        .pane1 {
            padding: 24px;
        }
    }

    .croTotals {
        border-radius: 10px;
        border: 1px #F0B80B dashed;
        display: flex;
        flex-direction: column;
        padding: 24px;
        align-items: center;

        img {
            width: 24px;
            height: auto;
        }
    }

    .croAss {
        color: #FFFFFF;
        font-family: Inter;
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        margin-top: 5px;
        margin-bottom: 14px;
    }

    .croAssUSD {
        color: #F0B80B;
        font-family: Inter;
        font-weight: bold;
        font-size: 36px;
        line-height: normal;
        letter-spacing: 0px;
        text-align: left;

    }

    .paneLeft {
        width: 50%;
    }

    .paneRight {
        width: 50%;
        display: flex;
        position: relative;

        .circleTextCon {
            display: flex;
            flex-direction: column;
        }

        .text {
            color: white;
        }

        .circle {
            background: #F0790B;
            border: 1px solid #FFFFFF;
            width: 8px;
            height: 8px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 8px;
        }

        .circle1 {
            background: #f0b80b;
            border: 1px solid #FFFFFF;
            width: 8px;
            height: 8px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 8px;
        }

        .per {
            margin: 30px;
            width: 10em;
            height: 10em;
            position: relative;


            .progress {
                position: absolute;
                width: 70%;
                height: 70%;
                background-color: #1e2226;
                border-radius: 50%;
                left: 15%;
                top: 15%;
                line-height: 6rem;
                text-align: center;
                color: #f0790b;
                font-weight: bold;
                align-items: center;
                justify-content: center;
                display: flex;
            }

            .left, .right {
                width: 5em;
                height: 10em;
                overflow: hidden;
                position: relative;
                float: left;
                background-color: rgba(240, 184, 11, 1);
            }

            .left {
                border-radius: 10em 0 0 10em;
            }

            .right {
                border-radius: 0 10em 10em 0;
            }

            .semi-circle {
                position: absolute;
                display: block;
                width: 5em;
                height: 10em;
                background-color: white;
                border-radius: 10em 0 0 10em;
                background-color: rgba(240, 121, 11, 1);
            }

            //.left:after,
            //.right:after {
            //  content: "";
            //  position: absolute;
            //  display: block;
            //  width: 5em;
            //  height: 10em;
            //  background-color: white;
            //  border-radius: 10em 0 0 10em;
            //  background-color: rgba(240, 121, 11, 1);
            //}

            .right .semi-circle {
                content: "";
                position: absolute;
                display: block;
                border-radius: 0 10em 10em 0;
            }

            .left .semi-circle {
                transform-origin: right center;
                transform: rotateZ(-180deg);
                //  -180+
            }

            .right .semi-circle {
                transform-origin: left center;
                transform: rotateZ(180deg);
                //  180+
            }
        }
    }

    .bridge {
        padding: 24px;

        .pane2 {
            margin: 24px 0;
        }

        .listTitle {
            color: rgba(255, 255, 255, 1);
            font-family: Inter;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0px;
            text-align: left;

        }

        .paginatePane {

            .MuiPaginationItem-root:hover {
                border-radius: 4px;
                background: #F0B80B;
            }

            .MuiPagination-ul {
                justify-content: center;

                .Mui-selected {
                    border-radius: 4px;
                    background: #F0B80B;
                }
            }
        }
    }


    .p1 {
        color: #FFFFFF;
        font-family: Inter;
        font-weight: 200;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        padding-bottom: 12px;
    }

    .p2 {
        color: #F0B80B;
        font-family: Inter;
        font-weight: bold;
        font-size: 36px;
        line-height: normal;
        letter-spacing: 0px;
        text-align: left;
        padding-bottom: 16px;
    }
}


@media (max-width: 768px) {
    .BTrade {
        padding: 0 10px;

    }
}
</style>
