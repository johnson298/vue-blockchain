import {createNamespacedHelpers} from 'vuex';
import {AddList, tokenSort, WhiteListMap} from "@/assets/js/tokenMap.js";
import {SwapInstance} from '@/assets/swap.init';
import {tap} from 'rxjs/operators';
import {ChainCoin} from '@/assets/js/coin';
import BigNumber from "bignumber.js";

export const swap = {
    namespaced: true,
    state: {
        baseToken: null,
        baseTokenAddress: '',
        tokenList: [],
        SwapState: {
            fromToken: null,
            toToken: null,
            loading: false,
            disabled: true,
            direct: false,
            showApprove: false,
            swapInfo: undefined,
        },
        liquidityList: [],
        claims: [
            {
                symbol: ChainCoin,
                address: () => SwapInstance.$provider.getWETHAddress(),
                isExist: false,
                canSwap: false,
            },
            {
                symbol: 'USDT',
                address: () => SwapInstance.$provider.getUSDTAddress(),
                isExist: false,
                canSwap: false,
            },
        ],
        ver: 2,
        loadTokenStatus: false,
        liquidityLoading: false,
    },
    mutations: {
        setClaims(state, val) {
            state.claims = val;
        },
        setDirect(state, val) {
            state.SwapState.direct = val;
        },
        setBaseTokenAddress(state, val) {
            state.baseTokenAddress = val;
        },
        setTokenList(state, val) {
            state.tokenList = val;
        },
        setSwapState(state, val) {
            Object.assign(state.SwapState, val);
        },
        setBaseToken(state, val) {
            state.baseToken = val;
            state.baseTokenAddress = val.address;
        },
        setLiquidityList(state, val) {
            state.liquidityList = val;
        },
        setVer(state, v) {
            state.ver = v;
        },
        setLiquidityLoading(state, load) {
            state.liquidityLoading = load;
        },
    },
    getters: {
        tokenMap(state) {
            return state.tokenList.reduce((obj, d) => {
                obj[d.address.toLowerCase()] = d;
                return obj;
            }, {});
        },
        getToken(state, getters) {
            return address => getters.tokenMap[address?.toLowerCase()];
        },
        ver(state) {
            return state.ver;
        },
        liquidityLoading(state) {
            return state.liquidityLoading;
        },
    },
    actions: {

        async fetchTokens({commit, state, rootState}, ver) {
            const adds = AddList[parseInt(rootState.chainId)] || [];
            let queryTokenList = ver === '2beta' ? SwapInstance.$query2Beta.queryTokenList() : ver === 2 ? SwapInstance.$query2.queryTokenList() : SwapInstance.$query.queryTokenList();
            let spenderAddress = ver === '2beta' ? SwapInstance.$provider.getQuery2BetaAddress() :ver === 2 ? SwapInstance.$provider.getDelegateAddress() : SwapInstance.$provider.getPlatformAddress();

            commit('setTokenList', adds.map(e =>{ e.isDefaultData = true; return e }));
            return Promise.all([
                SwapInstance.$query.queryConfig(),
                queryTokenList,
            ])
                .then(([, data]) => {
                    return Promise.all(
                        adds
                            .filter(d => {
                                return !data.find(el => {
                                    return (
                                        el.address.toLowerCase() === d.address.toLowerCase()
                                    );
                                });
                            })
                            .map(d => {
                                return SwapInstance.getTokenInfo({
                                    token: d.address,
                                    wallet: SwapInstance.$provider.currentAccount,
                                    spender: spenderAddress,
                                }).then(data => {
                                    data.address = d.address;
                                    return data;
                                });
                            }),
                    ).then(([...coins]) => {

                        let addresses = []
                        adds.map(d => {
                            addresses.push(d.address.toLowerCase())
                        })
                        let fiterData = data.filter(d => d.balance > 0 || addresses.includes(d.address.toLowerCase()));
                        return coins.concat(fiterData);
                    });
                })
                .then(list => {
                    const matched =
                        SwapInstance.$constant.ContractAddress[
                            SwapInstance.$provider.currentChainId
                            ];
                    list.forEach(d => {
                        if (d.address.toLowerCase() === matched.WETH.toLowerCase()) {
                            d.title = d.symbol = 'BNB';
                            commit('setBaseToken', d);
                            if (!state.SwapState.fromToken) {
                                commit('setSwapState', {fromToken: d});
                            }
                        }
                        if (
                            state.SwapState.fromToken &&
                            state.SwapState.fromToken.address === d.address
                        ) {
                            commit('setSwapState', {fromToken: d});
                        }
                        if (
                            state.SwapState.toToken &&
                            state.SwapState.toToken.address === d.address
                        ) {
                            commit('setSwapState', {toToken: d});
                        }
                        const idx = tokenSort.findIndex(el => el === d.symbol);
                        d.idx = idx > -1 ? idx : tokenSort.length + 1;
                    });

                    Object.freeze(list);
                    commit('setTokenList', list);
                    return list;
                });
        },
        queryLiquidityList({commit, state}, callback) {
            commit('setLiquidityLoading', true);
            commit('setLiquidityList', []);
            return SwapInstance.queryLiquidityList(state.ver)
                .pipe(
                    tap((res) => {
                        res.getResultCb().then(data => {
                            commit('setLiquidityList', []);
                            if(state.ver == res.ver) {
                                const arr = [...data];
                                const resArr = arr.filter(d => {
                                    return new BigNumber(d.percent).multipliedBy(d.reserve0).isGreaterThan(0) ||
                                        new BigNumber(d.percent).multipliedBy(d.reserve1).isGreaterThan(0) ||
                                        new BigNumber(d.reward).isGreaterThan(0)
                                });
                                commit('setLiquidityList', Object.freeze(resArr));
                                commit('setLiquidityLoading', false );
                                callback && callback(resArr);
                            }
                        }).catch(error => {
                            commit('setLiquidityLoading', false );
                        });
                    }),
                )
                .subscribe(res => {

                });
        },
    },
};

export const swapHelper = createNamespacedHelpers('swap');
