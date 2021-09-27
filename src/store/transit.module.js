import {createNamespacedHelpers} from 'vuex';
import {Ajax as $http, Ajax} from '@/axios/http';
import {ethers} from 'ethers';
import {ETHConfig, KOVAN_TOKENS} from '@/assets/js/tokenMap';
import {SwapInstance} from '@/assets/swap.init';

export const transit = {
    namespaced: true,
    state: {
        convertList: [],
        isConvert: false,
    },
    getters: {
        convertList(state) {
            return state.convertList;
        },
        isConvert(state) {
            return state.isConvert;
        }
    },
    mutations: {
        setConvertList(state, list) {
            state.convertList = list;
        },
        isConvert(state, is) {
            state.isConvert = is;
        }
    },
    actions: {
        uniSwap() {
            const getCoin = (address) => {
                return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
                    address.toLowerCase(),
                )}/logo.png`;
            };
            console.log('uniSwap chainid:', Number(SwapInstance.$provider.currentChainId));
            if(Number(SwapInstance.$provider.currentChainId) == 42){
                return KOVAN_TOKENS;
            }
            return Ajax('GET', 'https://tokens.coingecko.com/uniswap/all.json').then(token => {
                token.tokens.forEach((token) => {
                    token.icon = getCoin(token.address);
                });
                token.tokens.unshift(ETHConfig);
                return token.tokens;
            });
        },
        checkConvert({commit}) {
            return SwapInstance.isConvert().subscribe(res => {
                commit('isConvert', res);
                return res;
            });
        },
        fetchConvertList({commit}) {
            return SwapInstance.getConvertList().subscribe(data => {
                commit('setConvertList', data);
                return data;
            });
        },
        getBalance() {
            return SwapInstance.$provider.getBalance();
        },
        getTokenInfo({store}, address, spender) {
            return SwapInstance.getTokenInfo({
                token: address,
                spender,
            });
        },
        symbolPrice({store}, symbol) {
            return SwapInstance.getConvertPrice(symbol);
        },
        getTransitList() {
            return Ajax('POST', SwapInstance.getApiUrl() + '/getTransitList', {
                address: SwapInstance.$provider.currentAccount
            });
        }

    },
};

export const transitHelper = createNamespacedHelpers('transit');
