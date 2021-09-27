<template>
    <div>
        <h5>{{symbol}} 最新价格：{{price}}  区间： {{cycle}}</h5>
        <div id="chart_container"></div>
    </div>
</template>

<script>
    import {Ajax as $http} from "../../../axios/http";

    const LastPrice = 1234.2365
    import store from '../../../store/store';
    import { Tv } from '../../../assets/js/tradview';

    import { kData } from '../data'
    export default {
        name: "Chart",
        data(){
            return{
                price: '',
                wsCline: '',
                feed: null,
                chart: null,
                symbol: 'BTC/USDT',
                cycle: '5',
                hTPeriod: '5min',
                bnbPeriod: '5m',
                bars: [],
                subscribe: [],
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        },

        created() {
            // this.resetKline({ symbol: this.symbol, period: '1min', size: 1000})
        },

        mounted() {
            // this.initTV()
            // this.connectWs()
        },

        methods:{

            resetKline(params){

                params.symbol = params.symbol.replace('/', '').toLowerCase()
                $http("GET", "/market/history/kline", params).then(res =>{
                    if(res.status != 'ok') return
                    const kline = res.data.reverse().map(item => {
                        return {
                            time: item.id * 1000,
                            close: item.close,
                            open: item.open,
                            high: item.high,
                            low: item.low,
                            volume: item.vol
                        }
                    })
                    store.dispatch('updateChartData', kline)
                    this.changePair()
                })

                return
                let res = kData;
                if(res.status != 'ok') return
                const kline = res.data.reverse().map(item => {
                    return {
                        time: item.id,
                        close: item.close,
                        open: item.open,
                        high: item.high,
                        low: item.low,
                        volume: item.vol
                    }
                })

                store.dispatch('updateChartData', [])
                this.changePair()

                store.dispatch('updateChartData', kline)
                this.changePair()
            },

            wsSend(option){
                option.params = option.params.map(item => {
                    let _ary = item.split('@');
                    _ary[0] = _ary[0].replace('/', '').toLowerCase()
                    return _ary.join('@')
                })
                this.subscribe = option.params;
                this.wsCline.send(JSON.stringify(option));
            },
            connectWs(){
                const _that = this;
                if ("WebSocket" in window)
                {
                    this.wsCline = new WebSocket("wss://stream.binance.com:9443/stream");

                    this.wsCline.onopen = function()
                    {
                        _that.wsSend({
                            "method": "SUBSCRIBE",
                            "params":
                                [
                                    `${_that.symbol}@kline_${_that.bnbPeriod}`
                                ],
                            "id": 1
                        })
                    };

                    this.wsCline.onmessage = function (evt)
                    {
                        var received_msg = JSON.parse(evt.data);
                        if(received_msg?.data?.e === 'kline' && received_msg.data.k?.i === _that.bnbPeriod){
                            const item = received_msg.data.k
                            let data = store.getters.chartData
                            data.push({
                                time: Number(item.T),
                                close: Number(item.c),
                                open: Number(item.o),
                                high: Number(item.h),
                                low: Number(item.l),
                                volume: Number(item.v)
                            })
                            _that.price = item.c;
                            store.dispatch('updateChartData', data)
                            _that.changePair()
                        }else if(received_msg?.data?.e === '24hrTicker'){
                            // const item = received_msg.data
                            // _that.price = item.c;
                        }
                    };

                    this.wsCline.onclose = function()
                    {
                        // alert("连接已关闭...");
                    };
                }

                else
                {
                    // 浏览器不支持 WebSocket
                    alert("您的浏览器不支持 WebSocket!");
                }
            },

            initTV(){
                this.$nextTick(() => {
                    this.feed = this.createFeed();
                    this.chart = new TradingView.widget({
                        theme: 'Dark',
                        style: 3,
                        fullscreen: false,
                        autosize: true,
                        symbol:this.symbol,
                        container_id: "chart_container",
                        datafeed: this.feed,
                        library_path: "/custom_scripts/",
                        locale: "en",
                        timezone: this.timezone,
                        withdateranges: true,
                        charts_storage_api_version: "1.1",
                        client_id: 'tradingview.com',
                        user_id: 'public_user_id',
                        debug: true,
                        interval: this.cycle,
                        timeframe: this.cycle,
                        toolbar_bg: "#19212D",
                        allow_symbol_change: true,
                        drawings_access: {
                            type: 'black',
                            tools: [{name: "Trend Line", grayed: true}, {name: "Trend Angle", grayed: true}] //todo: bb
                        },
                        disabled_features: Tv.getDisFeatures(),
                        enabled_features: Tv.getEnFeature(),
                        time_frames: [],//左侧底部时间格式化
                        studies_overrides: Tv.getOverrides('Dark').dark_studies_overrides,
                        overrides: Tv.getOverrides('Dark').dark_overrides,
                        custom_css_url: 'chartc.css'
                    });

                    var chartType = 1, _this=this;
                    this.chart.onChartReady(function () {
                        //设置均线种类 均线样式
                        Tv.createStudy(_this.chart);
                        //生成时间按钮
                        _this.createButton();
                        _this.chart.chart().setChartType(chartType);
                        // toggleStudy(chartType);
                    });
                })
            },

            createData() {
                setInterval(() => {
                    let data = store.getters.chartData
                    data.push({
                        time: new Date().getTime(),
                        close: 640 + Math.random() * 5,
                        open: 640 + Math.random() * 5,
                        high: 640 + Math.random() * 5,
                        low: 640 + Math.random() * 5,
                        volume: 10000 * Math.random()
                    })
                    store.dispatch('updateChartData', data)
                    this.changePair()
                }, 3000)
            },

            changePair() {
                if(this.chart && this.feed){
                    this.feed._fireEvent('pair_change');
                    this.chart.activeChart().resetData();
                    this.chart.activeChart().setSymbol(this.symbol, () => {});
                }
            },

            createButton(){
                var thats = this.chart, _this = this;

                var buttons = [
                    { title: '分时', resolution: '1', chartType: 3 },
                    { title: `1分钟`, resolution: '1', chartType: 1 },
                    // { title: `3分钟`, resolution: '3', chartType: 1 },
                    { title: `5分钟`, resolution: '5', chartType: 1 },
                    { title: `15分钟`, resolution: '15', chartType: 1 },
                    { title: `30分钟`, resolution: '30', chartType: 1 },
                    // { title: `1小时`, resolution: '60', chartType: 1 },
                    { title: `1天`, resolution: 'D', chartType: 1 },
                    // { title: `1周`, resolution: 'W', chartType: 1 },
                    // { title: `1月`, resolution: 'M', chartType: 1 },
                ];
                var resolution = this.cycle, chartType = 1;

                for (var i = 0; i < buttons.length; i++) {
                    (function (button) {
                        thats.createButton()
                            .attr('title', button.title).addClass("mydate")
                            .text(button.title)
                            .on('click', function (e) {
                                if ($(e.target).parent().hasClass('active')) {
                                    return false;
                                }
                                _this.cycle = button.resolution;

                                switch (button.resolution) {
                                    case "1": _this.hTPeriod = '1min', _this.bnbPeriod = '1m'; break;
                                    case "5": _this.hTPeriod = '5min', _this.bnbPeriod = '5m'; break;
                                    case "15": _this.hTPeriod = '15min', _this.bnbPeriod = '15m'; break;
                                    case "30": _this.hTPeriod = '30min', _this.bnbPeriod = '30m'; break;
                                    case "D": _this.hTPeriod = '1day', _this.bnbPeriod = '1h'; break;
                                }

                                // const symbol = _this.symbol.replace('/', '').toLowerCase()
                                _this.changeKline({
                                    ws: [`${_this.symbol}@kline_${_this.bnbPeriod}`],
                                    resetKline: {
                                        symbol: _this.symbol,
                                        period: _this.hTPeriod,
                                        size: 1000
                                    }
                                })

                                localStorage.setItem('tradingview.resolution', button.resolution);
                                localStorage.setItem('tradingview.chartType', button.chartType);
                                $(e.target).parent().addClass('active').siblings('.active').removeClass('active');
                                thats.chart().setResolution(button.resolution, function onReadyCallback() { });
                                if (button.chartType != thats.chart().chartType()) {
                                    thats.chart().setChartType(button.chartType);
                                    toggleStudy(button.chartType);
                                }
                            }).parent().addClass('my-group' + (button.resolution == resolution && button.chartType == chartType ? ' active' : ''));
                    })(buttons[i]);
                }

                function toggleStudy(chartType) {
                    if (chartType == 3) {
                        for (let item of _this.chart.chart().getAllStudies()) {
                            if (item.name === 'Moving Average') {
                                _this.chart.chart().removeEntity(item.id)
                            }
                        }
                    } else {
                        Tv.createStudy(_this.chart);
                    }
                }
            },

            createFeed() {
                let Datafeed = {};
                let _that = this;
                Datafeed.DataPulseUpdater = function(datafeed, updateFrequency) {
                    this._datafeed = datafeed;
                    this._subscribers = {};

                    this._requestsPending = 0;
                    var that = this;

                    var update = function() {
                        if (that._requestsPending > 0) {
                            return;
                        }

                        for (var listenerGUID in that._subscribers) {
                            var subscriptionRecord = that._subscribers[listenerGUID];
                            var resolution = subscriptionRecord.resolution;

                            var datesRangeRight = parseInt(((new Date().valueOf()) / 1000).toFixed());

                            //	BEWARE: please note we really need 2 bars, not the only last one
                            //	see the explanation below. `10` is the `large enough` value to work around holidays
                            var datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 10);

                            that._requestsPending++;

                            (function(_subscriptionRecord) { // eslint-disable-line
                                that._datafeed.getBars(_subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, function(bars) {
                                        that._requestsPending--;

                                        //	means the subscription was cancelled while waiting for data
                                        if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                                            return;
                                        }

                                        if (bars.length === 0) {
                                            return;
                                        }

                                        var lastBar = bars[bars.length - 1];
                                        if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                                            return;
                                        }

                                        var subscribers = _subscriptionRecord.listeners;

                                        //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                                        //	_subscriptionRecord.lastBarTime = NaN
                                        var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;

                                        //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
                                        //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
                                        if (isNewBar) {
                                            if (bars.length < 2) {
                                                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
                                            }

                                            var previousBar = bars[bars.length - 2];
                                            for (var i = 0; i < subscribers.length; ++i) {
                                                subscribers[i](previousBar);
                                            }
                                        }

                                        _subscriptionRecord.lastBarTime = lastBar.time;

                                        for (var j = 0; j < subscribers.length; ++j) {
                                            subscribers[j](lastBar);
                                        }
                                    },

                                    //	on error
                                    function() {
                                        that._requestsPending--;
                                    });
                            })(subscriptionRecord);
                        }
                    };

                    if (typeof updateFrequency != 'undefined' && updateFrequency > 0) {
                        setInterval(update, updateFrequency);
                    }
                };

                Datafeed.DataPulseUpdater.prototype.periodLengthSeconds = function(resolution, requiredPeriodsCount) {
                    var daysCount = 0;
                    // console.error('Datafeed.DataPulseUpdater.prototype.periodLengthSeconds')
                    if (resolution === 'D') {
                        daysCount = requiredPeriodsCount;
                    } else if (resolution === 'M') {
                        daysCount = 31 * requiredPeriodsCount;
                    } else if (resolution === 'W') {
                        daysCount = 7 * requiredPeriodsCount;
                    } else {
                        daysCount = requiredPeriodsCount * resolution / (24 * 60);
                    }

                    return daysCount * 24 * 60 * 60;
                };

                Datafeed.DataPulseUpdater.prototype.subscribeDataListener = function(symbolInfo, resolution, newDataCallback, listenerGUID) {
                    this._datafeed._logMessage('Subscribing ' + listenerGUID);
                    // console.error('Datafeed.DataPulseUpdater.prototype.subscribeDataListener')
                    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
                        this._subscribers[listenerGUID] = {
                            symbolInfo: symbolInfo,
                            resolution: resolution,
                            lastBarTime: NaN,
                            listeners: []
                        };
                    }

                    this._subscribers[listenerGUID].listeners.push(newDataCallback);
                };

                Datafeed.DataPulseUpdater.prototype.unsubscribeDataListener = function(listenerGUID) {
                    this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
                    delete this._subscribers[listenerGUID];
                };

                Datafeed.Container = function(updateFrequency){
                    this._configuration = {
                        supports_search: false,
                        supports_group_request: false,
                        // supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '3D', '1W', '1M'],
                        supports_marks: true,
                        supports_timescale_marks: true,
                        exchanges: ['Binance']
                    };

                    this._barsPulseUpdater = new Datafeed.DataPulseUpdater(this, updateFrequency || 10 * 1000);
                    // this._quotesPulseUpdater = new Datafeed.QuotesPulseUpdater(this);

                    this._enableLogging = true;
                    this._callbacks = {};

                    this._initializationFinished = true;
                    this._fireEvent('initialized');
                    this._fireEvent('configuration_ready');
                };

                Datafeed.Container.prototype._fireEvent = function(event, argument) {
                    if (this._callbacks.hasOwnProperty(event)) {
                        var callbacksChain = this._callbacks[event];
                        for (var i = 0; i < callbacksChain.length; ++i) {
                            callbacksChain[i](argument);
                        }

                        this._callbacks[event] = [];
                    }
                };

                Datafeed.Container.prototype._logMessage = function(message) {
                    if (this._enableLogging) {
                        var now = new Date();
                    }
                };

                Datafeed.Container.prototype.on = function(event, callback) {
                    if (!this._callbacks.hasOwnProperty(event)) {
                        this._callbacks[event] = [];
                    }

                    this._callbacks[event].push(callback);
                    return this;
                };

                Datafeed.Container.prototype.onReady = function(callback) {
                    let that = this;
                    if (this._configuration) {
                        setTimeout(function() {
                            callback(that._configuration);
                        }, 0);
                    }
                    else {
                        this.on('configuration_ready', function() {
                            callback(that._configuration);
                        });
                    }
                };

                Datafeed.Container.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
                    this._logMessage("GOWNO :: resolve symbol "+ symbolName);
                    // console.error('Datafeed.Container.prototype.resolveSymbol')
                    Promise.resolve().then(() => {
                        // this._logMessage("GOWNO :: onResultReady inject "+this.currency1 + ":"+ this.currency2);
                        // console.error('this.symbol=====>', _that.symbol)
                        onSymbolResolvedCallback({
                            "name": _that.symbol,
                            "timezone": _that.timezone,
                            "pricescale": LastPrice > 1000 ? 100 : 100000000,
                            "minmov": 1,
                            "minmov2": 0,
                            "ticker": _that.symbol,
                            "description": "",
                            "session": "24x7",
                            "type": "bitcoin",
                            "exchange-traded": "Binance",
                            "exchange-listed": "Binance",
                            "has_intraday": true,
                            "intraday_multipliers": [_that.cycle], //It is an array containing intraday resolutions (in minutes) the datafeed wants to build by itself. E.g., if the datafeed reported he supports resolutions ["1", "5", "15"], but in fact it has only 1 minute bars for symbol X, it should set intraday_multipliers of X = [1]. This will make Charting Library to build 5 and 15 resolutions by itself.
                            "has_weekly_and_monthly": false,
                            "has_no_volume": false,
                            "regular_session": "24x7"
                        });
                    })
                };

                Datafeed.Container.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
                    // console.error(rangeStartDate > 0 && (rangeStartDate + '').length > 10,  symbolInfo, resolution, rangeStartDate, rangeEndDate)
                    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
                        throw new Error();
                    }

                    // console.error('Datafeed.Container.prototype.getBars')



                    /**
                     * 测试数据
                     */
                    // const res = kData;
                    // if(res.length === 0){
                    //     if (!!onErrorCallback) {
                    //         onErrorCallback();
                    //     }
                    //     return;
                    // }
                    //
                    // if (res.length !== 0) {
                    //     window['kLineNodata'] = false;
                    // }else{
                    //     window['kLineNodata'] = true;
                    // }
                    //
                    // const kline = res.map(item => {
                    //     return {
                    //         time: Number(item[0]),
                    //         close: Number(item[4]),
                    //         open: Number(item[1]),
                    //         high: Number(item[2]),
                    //         low: Number(item[3]),
                    //         volume: Number(item[5])
                    //     }
                    // })
                    //
                    // localStorage.setItem('kline', JSON.stringify(res))
                    // // store.dispatch('updateChartData', kline)
                    //
                    // onDataCallback(kline, { noData: false})


                    onDataCallback([], { noData: true });
                    return

                    $http("GET", "/api/v3/klines", {
                        symbol: symbolInfo.ticker.toUpperCase().replace('/', ''),
                        interval: '5m',
                        // startTime: rangeStartDate,
                        // endTime: rangeEndDate,
                        limit: 1000
                    }).then(res => {
                        alert(12)
                        if(res.length === 0){
                            if (!!onErrorCallback) {
                                onErrorCallback();
                            }
                            return;
                        }

                        if (res.length !== 0) {
                            window['kLineNodata'] = false;
                        }else{
                            window['kLineNodata'] = true;
                        }

                        const kline = res.map(item => {
                            return {
                                time: Number(item[0]),
                                close: Number(item[4]),
                                open: Number(item[1]),
                                high: Number(item[2]),
                                low: Number(item[3]),
                                volume: Number(item[5])
                            }
                        })

                        localStorage.setItem('kline', JSON.stringify(res))
                        store.dispatch('updateChartData', kline)

                        onDataCallback(kline, { noData: false, nextTime: data.nb || data.nextTime })
                    }).catch(function(arg) {
                        console.warn(['getBars(): HTTP error', arg]);

                        if (!!onErrorCallback) {
                            onErrorCallback('network error: ' + JSON.stringify(arg));
                        }
                    });

                    // this._send(this._datafeedURL + this._historyURL, {
                    //     symbol: symbolInfo.ticker.toUpperCase(),
                    //     resolution: resolution,
                    //     from: rangeStartDate,
                    //     to: rangeEndDate
                    // })
                    // .done(function(response) {
                    //     var data = parseJSONorNot(response);
                    //
                    //     var nodata = data.s === 'no_data';
                    //
                    //     if (data.s !== 'ok' && !nodata) {
                    //         if (!!onErrorCallback) {
                    //             onErrorCallback(data.s);
                    //         }
                    //
                    //         return;
                    //     }
                    //
                    //     var bars = [];
                    //
                    //     //	data is JSON having format {s: "status" (ok, no_data, error),
                    //     //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
                    //     var barsCount = nodata ? 0 : data.t.length;
                    //
                    //     var volumePresent = typeof data.v != 'undefined';
                    //     var ohlPresent = typeof data.o != 'undefined';
                    //
                    //     for (var i = 0; i < barsCount; ++i) {
                    //         var barValue = {
                    //             time: data.t[i] * 1000,
                    //             close: +data.c[i]
                    //         };
                    //
                    //         if (ohlPresent) {
                    //             barValue.open = +data.o[i];
                    //             barValue.high = +data.h[i];
                    //             barValue.low = +data.l[i];
                    //         } else {
                    //             barValue.open = barValue.high = barValue.low = +barValue.close;
                    //         }
                    //
                    //         if (volumePresent) {
                    //             barValue.volume = +data.v[i];
                    //         }
                    //
                    //         bars.push(barValue);
                    //     }
                    //     /*k线图没有数据处理*/
                    //     if (!nodata) {
                    //         window['kLineNodata'] = false;
                    //     }else{
                    //         window['kLineNodata'] = true;
                    //     }
                    //
                    //     onDataCallback(bars, { noData: nodata, nextTime: data.nb || data.nextTime });
                    // })
                    // .fail(function(arg) {
                    //     console.warn(['getBars(): HTTP error', arg]);
                    //
                    //     if (!!onErrorCallback) {
                    //         onErrorCallback('network error: ' + JSON.stringify(arg));
                    //     }
                    // });

                    // onDataCallback([], { noData: true });
                    // onDataCallback(bars, { noData: true , nextTime: data.nb || data.nextTime });
                };

                Datafeed.Container.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
                    store.getters.chartData.forEach(function (bar) { // in subscribeBars
                        onRealtimeCallback(bar)
                    });
                    this.on('pair_change', function() {
                        onResetCacheNeededCallback();
                    });
                    //this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
                };

                Datafeed.Container.prototype.unsubscribeBars = function(listenerGUID) {
                    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
                };

                return new Datafeed.Container;
            },

            /**
             * Change Kline
             * @param option : { ws: [], resetKline: {symbol: 'BTC/USDT', period: '1min'}}
             */
            changeKline(option){
                this.wsSend({
                    "method": "UNSUBSCRIBE",
                    "params": this.subscribe,
                    "id": 312
                });

                this.wsSend({
                    "method": "SUBSCRIBE",
                    "params": option.ws ,
                    "id": 1
                });

                this.resetKline(option.resetKline)
            },
        },
        beforeDestroy() {
            this.wsSend({
                "method": "UNSUBSCRIBE",
                "params": this.subscribe,
                "id": 312
            });
        }
    }
</script>

<style scoped>
    #chart_container{
        width: 110%;
        /*margin-left: -25%;*/
        height: 600px;
    }
    h5{
        color: #fff;
    }
</style>
