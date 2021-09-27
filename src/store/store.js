import {$storage} from '@/assets/storage';
import {SwapInstance} from '@/assets/swap.init';
import {governance} from '@/store/gove.module';
import {transit} from '@/store/transit.module';
import Vue from 'vue';
import Vuex from 'vuex';
import ChainApi from '../../static/sdk/ChainApi.js';
import {fundPool} from './fundPool.module';
import {myAccount} from './my.module';
import {swap} from './swap.module';
import {home} from '@/store/home.module';
import {ifoStore} from './ifo.module';
import { klineStore } from './kline.module';

Vue.use(Vuex);

const account = sessionStorage.getItem('account');
const THEMES = ['global__light_theme', 'global__dark_theme'];
const INCLUDES = process.env.VUE_APP_INCLUDES
    ? process.env.VUE_APP_INCLUDES.split(',')
    : [];

export default new Vuex.Store({
    modules: {
        fundPool,
        myAccount,
        governance,
        swap,
        transit,
        home,
        ifoStore,
        klineStore
    },
    state: {
        theme: 1,
        rootEl: document.documentElement,
        chainId: sessionStorage.getItem('chainId') ? Number(sessionStorage.getItem('chainId')) : 0,
        account: account,
        isConnect: Boolean(account),
        isInstall: false, //是否安装
        //矿池数组
        poolList: [],
        drawer: false,
        phone: false,
        curStartTime: '2020-10-31 15:00:00', //倒计时日期
        loading: false,
        tolerance: 0.5,
        minute: 15,
        actionCache: $storage.get('RecordList') || {},
        language: localStorage.lang || 'en',

        /**
         * Prediction Modules
         */
        chartData: [],
        currentPrice: 0,
        poolIndex: -1,
        poolInfo: {}
    },
    getters: {
        getLoginStatus(state){
            return state.isConnect;
        },
        actionCache(state) {
            return Object.values(state.actionCache).sort((a, b) => {
                return b.timestamp - a.timestamp;
            });
        },
        tolerance(state) {
            return state.tolerance * 0.01;
        },
        rootStyles(state) {
            const styles = getComputedStyle(state.rootEl);
            return styleName => styles.getPropertyValue(styleName);
        },
        poolsMap(state) {
            return state.poolList.reduce((obj, d) => {
                const {supplyTokenSymbol} = d;
                if (supplyTokenSymbol) {
                    if (Reflect.has(obj, supplyTokenSymbol)) {
                        obj[supplyTokenSymbol].push(d);
                    } else {
                        Reflect.set(obj, supplyTokenSymbol, [d]);
                    }
                }
                return obj;
            }, {});
        },
        findPool: (state, getters) => {
            return (supply, symbol) => {
                return state.poolList.find(res => {
                    return (
                        `${res.lpToken0Symbol}-${res.lpToken1Symbol}` === symbol &&
                        res.supplyTokenSymbol === supply
                    );
                });
            };
        },
        total(state) {
            return state.poolList.reduce((sum, d) => {
                sum += +d.lockUpValue;
                return sum;
            }, 0);
        },
        theme(state) {
            return THEMES[state.theme];
        },
        language(state) {
            return state.language;
        },

        chartData(state) {
            return state.chartData
        },
        currentPrice(state){
            return state.currentPrice
        },
        getPoolIndex(state){
            return state.poolIndex
        },
        getPoolInfo(state) {
            return state.poolInfo
        }
    },
    mutations: {
        chainId(state, id) {
            state.chainId = id;
            sessionStorage.setItem('chainId', id);
        },
        setLanguage(state, l) {
            state.language = l;
        },
        setTolerance(state, val) {
            state.tolerance = val;
        },
        setMinute(state, val) {
            state.minute = val;
        },
        isConnect(state, obj) {
            state.isConnect = obj;
        },
        isInstall(state, obj) {
            state.isInstall = obj;
        },
        account(state, obj) {
            state.account = obj;
            sessionStorage.setItem('account', obj);
        },
        drawer(state, val) {
            if (typeof val === 'boolean') {
                state.drawer = val;
            } else {
                state.drawer = !state.drawer;
            }
        },
        poolList(state, list) {
            state.poolList = list.filter(d => {
                return !INCLUDES.length || INCLUDES.includes(d.supplyTokenSymbol);
            });
        },
        theme(state, val) {
            state.theme = Number(val);
        },
        poolLoading(state, load) {
            state.loading = load;
        },
        clearActionCache(state) {
            $storage.remove('RecordList');
            state.actionCache = {};
        },
        pushActionCache(state, data) {
            Object.keys(state.actionCache).forEach(d => {
                if (state.actionCache[d].result === data.result) {
                    delete state.actionCache[d];
                }
            });
            state.actionCache = {
                ...state.actionCache,
                [data.key]: data
            };
            $storage.set('RecordList', state.actionCache);
        },


        /**
         * Prediction Modules
         * Prediction Modules
         * Prediction Modules
         */
        UPDATE_CHART_DATA(state, val) {
            state.chartData = val;
        },
        setCurrentPrice(state, val) {
            state.currentPrice = val;
        },
        setPoolIndex(state, val) {
            state.poolIndex = val || -1;
        },
        setPoolInfo(state, val) {
            state.poolInfo = val;
        }
    },
    actions: {
        connect({commit}, data) {
            return ChainApi.connect(data).then(acc => {
                console.error('connect account:', acc);
                let is = acc && acc.length > 0;
                let account = is ? acc[0] : '';
                let isConnect = ChainApi.isConnected();
                commit('account', account);
                commit('isConnect', isConnect);
                // SwapInstance.onInit(ChainApi.web3());
                return isConnect;
            });
        },
        isConnect({commit}, data) {
            commit('isConnect', data);
        },
        account({commit}, data) {
            commit('account', data);
        },
        poolList({commit}) {
            commit('poolLoading', true);
            return ChainApi.queryPoolList().then(pools => {
                commit(
                    'poolList',
                    pools.map((d, i) => {
                        // d.lpToken0Symbol = d.collateralTokenSymbol;
                        // d.lpToken1Symbol = d.supplyTokenSymbol;
                        d.idx = i;
                        return d;
                    })
                );

                commit('poolLoading', false);
            });
        },
        getCurrentPool({state}, poolName) {
            if (poolName) {
                return state.poolList.find(res => {
                    return (
                        `${res.collateralTokenSymbol}-${res.supplyTokenSymbol}` === poolName
                    );
                });
            }
        },
        tokenBalance({state}, token) {
            return ChainApi.tokenBalanceOf(token, state.account);
        },
        balance({state}, token) {
            return ChainApi.balanceOf(token, state.account);
        },
        ETHBalance({state}) {
            return ChainApi.getBalance();
        },
        allowance({state}, {token, pair}) {
            return ChainApi.allowance(token, pair);
        },
        approve({state}, {token, pair}) {
            return ChainApi.approve(token, pair);
        },
        recordCallback({commit, getters}, {key, action, params, code, result}) {
            const callBackParams = {
                action: key,
                params: params
            };
            SwapInstance._callback(callBackParams, () => {
            })(code, result);
        },
        bsc({store}, {account}) {
            return SwapInstance.getBscscanTrade(account);
        },

        updateChartData(context, data) {
            context.commit('UPDATE_CHART_DATA', data);
        },

    }
});
