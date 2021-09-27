import {createNamespacedHelpers} from 'vuex';
import ChainApi from '../../static/sdk/ChainApi.js';
import BigNumber from 'bignumber.js';

export const myAccount = {
    namespaced: true,
    state: {
        USDTTotal: '',
        BUSDTotal: '',
        LPTotal: '',
    },
    mutations: {
        USDTTotal(state, val) {
            state.USDTTotal = val;
        },
        BUSDTotal(state, val) {
            state.USDTTotal = val;
        },
        LPTotal(state, val) {
            state.USDTTotal = val;
        },
    },
    getters: {

    },
    actions: {

    },
};

export const myAccountHelper = createNamespacedHelpers('myAccount');
