import {Web3Contract} from "./Web3Contract.js";
import PlatformABI from "./abi/demaxPlatformABI.js";
import { Web3Provider } from './Web3Provider.js';
import { Constant } from './Constant.js';
import Pair from "./model/pair.js"
import Config from "./model/config.js"
import {convertNormalToBigNumber, convertBigNumberToNormal} from "./util/util.js"
let platformContract = null;
export var Web3Storage = {
    tokenDic: {},
    pairDic: {},
    liquidityDic: {},
    params: {},
    stakeDic: {},
    proposalDic: {},
    configDic: {},
    MAXNUM: 9999 * 99999 * 100000,

    setupTokenList(list) {
        this.tokenDic = {};
        for(let i = 0;i < list.length;i++) {
            this.tokenDic[list[i].address] = list[i];
        }
    },

    updateToken(address, value) {
        this.tokenDic[address] = value;
    },

    setupLiquidityList(list) {
        this.liquidityDic = {};
        for(let i = 0;i < list.length;i++) {
            this.liquidityDic[list[i].address] = list[i];
        }
    },

    setupProposalList(list) {
        this.proposalDic = {};
        for(let i = 0;i < list.length;i++) {
            this.proposalDic[list[i].address] = list[i];
        }
    },

    setProposal(d) {
        this.proposalDic[d.address] = d;
    },

    setupBallotDic(ballotList) {
        this.configDic = {};
        for(let i = 0;i < ballotList.length;i++) {
            this.configDic[ballotList[i].key] = new Config(ballotList[i].key, ballotList[i].subject, ballotList[i].title);
        }
    },

    setParams(feePercent, proposalAmount, unstakeDuration, removeDuration, listTokenAmount, rewardPercent) {
        this.params = {
            feePercent: feePercent,
            proposalAmount: proposalAmount,
            unstakeDuration: unstakeDuration,
            removeDuration: removeDuration,
            listTokenAmount: listTokenAmount,
            rewardPercent: rewardPercent
        }
        console.log(this.params);
    },

    setConfigInfo(key, minValue, maxValue, currentValue, span) {
        let config = this.configDic[key];
        if(config) {
            config.setInfo(parseFloat(minValue), parseFloat(maxValue), parseFloat(currentValue), parseFloat(span));
            return config;
        }
    },

    getConfigDecimal(key) {
        if(key === "PRODUCE_DGAS_RATE" || key === "LIST_DGAS_AMOUNT" || key === "PROPOSAL_DGAS_AMOUNT") {
            return 18;
        } else if(key === "SWAP_FEE_PERCENT" || key === "TOKEN_TO_DGAS_PAIR_MIN_PERCENT"
            || key === "LIST_TOKEN_FAILURE_BURN_PRECENT" || key === "LIST_TOKEN_SUCCESS_BURN_PRECENT"
            || key === "VOTE_REWARD_PERCENT" || key === "FEE_LP_REWARD_PERCENT" || key === "FEE_GOVERNANCE_REWARD_PERCENT") {
            return 4;
        }
        return 0;
    },

    setStakeInfo(stakeInfo) {
        this.stakeDic = stakeInfo;
    },

    getDecimal(token) {
        return this.tokenDic[token] ? this.tokenDic[token].decimals: 18;
    },

    isETH(token) {
        return token.toLocaleLowerCase() === Web3Provider.getWETHAddress().toLocaleLowerCase();
    },

    addPair(tokenA, tokenB, pair) {
        if(pair.exist) {
            this.pairDic[this.getKey(tokenA, tokenB)] = pair
        }
    },

    existPair(tokenA, tokenB) {
        let pair = this.getKey(tokenA, tokenB);
        console.log('existPair:', pair);
        if(!pair) return false;
        if(this.pairDic[pair]) return true;
        return false;
        // return this.pairDic.hasOwnProperty(pair);
    },

    getReserve(tokenA, tokenB) {
        let tokenName = tokenA < tokenB ? `${tokenA}_${tokenB}`: `${tokenB}_${tokenA}`;
        let pair = this.pairDic[tokenName];
        if(!pair) {
            return [0, 0]
        } else {
            return pair.tokenA === tokenA ? [pair.reserveA, pair.reserveB]: [pair.reserveB, pair.reserveA];
        }
    },

    getKey(tokenA, tokenB) {
        return tokenA < tokenB ? `${tokenA}_${tokenB}`: `${tokenB}_${tokenA}`;
    },

    getRouteList() {
        return [Web3Provider.getWETHAddress(), Web3Provider.getDGASAddress()];
    },

    getConfig(key) {
        return this.configDic[key];
    },

    getToken(address) {
        return this.tokenDic[address];
    },

    generateAllPair(tokenA, tokenB) {
        let routeList = this.getRouteList();
        let set = new Set([this.getKey(tokenA, tokenB)]);
        for(let i = 0;i < routeList.length;i++) {
            set.add(this.getKey(tokenA, routeList[i]));
            set.add(this.getKey(routeList[i], tokenB));
        }
        let list = [...set];
        list = list.map(a => a.split("_"));
        list = list.filter(a => a[0] !== a[1]);
        return list;
    },

    getAllowance(token) {
        if(this.tokenDic[token]) {
            return this.tokenDic[token].allowance
        }

        return 0;
    },

    setLiquidityReward(pair_address, reward, block) {
        if(this.liquidityDic[pair_address]) {
            this.liquidityDic[pair_address].setReward(reward, block);
        }
    },

    getLiquidity(address) {
        return this.liquidityDic[address];
    }
};
