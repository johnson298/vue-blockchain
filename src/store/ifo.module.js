import {createNamespacedHelpers} from 'vuex';
import ChainApi from '../../static/sdk/ChainApi';

export const ifoStore = {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        list(state) {
            return state.list;
        },
    },
    mutations: {
        setList(state, list) {
            state.list = list;
        },
    },
    actions: {
        getList({store, commit}){
            return ChainApi.ifoList().then(res =>{
                commit('setList')
                return res;
            });
        }
    },
};

export const ifoHelper = createNamespacedHelpers('ifoStore');
