import {createNamespacedHelpers} from 'vuex';
import {Ajax as $http} from "../axios/http";

export const klineStore = {
    namespaced: true,
    state: {
        kline: []
    },
    getters: {
        kline(state) {
            return state.list;
        },
    },
    mutations: {
        setKList(state, list) {
            state.kline = list;
        },
    },
    actions: {
        getList({store, commit}){
            $http("get", this.getApiUrl() + "/api/v3/klines", {
                symbol: 'BNBUSDT',
                interval: '1m',
                startTime: '',
                endTime: '',
                limit: 500
            }).then(res =>{
                console.error('res---》', res)
                commit('setKList', res)
            })
        }
    },
};

export const klineHelper = createNamespacedHelpers('klineStore');
