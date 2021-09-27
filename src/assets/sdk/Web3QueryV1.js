import {Web3Contract} from "./Web3Contract.js";
import QueryABIV1 from "./abi/demaxQueryV1ABI.js";
import { Web3Provider } from './Web3Provider.js';
import { Web3Storage } from './Web3Storage.js';
import { Web3Platform } from './Web3Platform.js';
import { Constant } from './Constant.js';
import Token from "./model/token.js";
import Liquidity from "./model/liquidity.js";
import Proposal from "./model/proposal.js";
import Config from "./model/config.js";
import {convertNormalToBigNumber, convertBigNumberToNormal, calculatePercentage} from "./util/util.js"
import Pair from "./model/pair.js";
let queryContractV1 = null;
export var Web3QueryV1 = {
    initialize() {
        // console.log('Web3Provider.getQueryV1Address()', Web3Provider.getQueryV1Address());
        queryContractV1 = new Web3Provider.web3.eth.Contract(QueryABIV1, Web3Provider.getQueryV1Address());
    },

    async queryTokenList() {
        let tokenList = [];
        let results = await queryContractV1.methods.queryTokenList().call({from: Web3Provider.currentAccount});
        for(let i = 0;i < results.length;i++) {
            let item = results[i];
            let decimals = parseInt(item["decimal"]);
            let balance = Web3Storage.isETH(item["tokenAddress"]) ? (await Web3Provider.getBalance()) : convertBigNumberToNormal(item["balance"], decimals);
            let allowance = Web3Storage.isETH(item["tokenAddress"]) ? Web3Storage.MAXNUM : convertBigNumberToNormal(item["allowance"], decimals);
            let symbol = Web3Storage.isETH(item["tokenAddress"]) ? "ETH" : item["symbol"];
            let totalSupply = Web3Storage.isETH(item["tokenAddress"]) ? 0: convertBigNumberToNormal(item["totalSupply"], decimals);
            let allowance_gov = convertBigNumberToNormal(item["allowanceGov"], decimals);
            tokenList.push(new Token(item["tokenAddress"], symbol, totalSupply, balance, allowance, allowance_gov,
                decimals, parseInt(item.status)))
        }

        Web3Storage.setupTokenList(tokenList);
        return tokenList.filter(i => i.status === 2 || i.status === 3);
    },

    async queryLiquidityList() {
        // console.log('queryLiquidityListV1...');
        let block = await Web3Provider.getCurrentBlock();
        let liquidityList = [];
        // console.log('Web3Provider.currentAccount', Web3Provider.currentAccount);
        let results = await queryContractV1.methods.queryLiquidityList().call({from: Web3Provider.currentAccount});
        let address_list = [];
        for(let i = 0;i < results.length;i++) {
            let l = results[i];
            let address = l["pair"];
            let percentage = calculatePercentage(l["balance"], l["totalSupply"]);
            let canRemove = block >= parseInt(l["lastBlock"]) + Web3Storage.params.removeDuration;
            liquidityList.push(new Liquidity(address, parseFloat(percentage), l["balance"], canRemove));
            address_list.push(address);
        }

        results = await queryContractV1.methods.queryPairListInfo(address_list).call({from: Web3Provider.currentAccount});
        for(let i = 0;i < address_list.length;i++) {
            let token0 = results.token0_list[i];
            let token1 = results.token1_list[i];
            liquidityList[i].setTokenAddress(token0, token1);

            let reserve0 = convertBigNumberToNormal(results.reserve0_list[i], Web3Storage.getDecimal(token0));
            let reserve1 = convertBigNumberToNormal(results.reserve1_list[i], Web3Storage.getDecimal(token1));
            liquidityList[i].setReserve(reserve0, reserve1);
        }
        Web3Storage.setupLiquidityList(liquidityList);

        for(let i = 0;i < address_list.length;i++) {
            await Web3Platform.queryReward(address_list[i]);
        }
        return Object.values(Web3Storage.liquidityDic);
    },

    async queryProposalList() {
        let block = await Web3Provider.web3.eth.getBlockNumber();
        let proposalList = [];
        let results = await queryContractV1.methods.queryProposalList().call({from: Web3Provider.currentAccount});
        for(let i = 0;i < results.length;i++) {
            let item = results[i];
            let proposal = new Proposal(item.ballotAddress, item.tokenAddress, item.ballotType, item.subject, item.content, item.createTime, item.end,
                convertBigNumberToNormal(item.YES), convertBigNumberToNormal(item.NO), convertBigNumberToNormal(item.totalReward), item.voted,
                item.voteIndex, item.minted, convertBigNumberToNormal(item.weight), item.audited);
            proposal.remainBlock = Math.max(0, parseInt(item.endBlock) - block);
            proposal.proposer = item.proposer;
            proposalList.push(proposal);

            if(parseInt(proposalList[i].type)  === 1) {
                let key = Web3Provider.fromByte32(item.key);
                let decimal = Web3Storage.getConfigDecimal(key);
                proposalList[i].setValue(convertBigNumberToNormal(item.value, decimal));
                proposalList[i].key = key;
                proposalList[i].currentValue = (convertBigNumberToNormal(item.currentValue, decimal));
            }
        }

        Web3Storage.setupProposalList(proposalList);
        return proposalList;
    },

    async queryConfig() {
        let result = await queryContractV1.methods.queryConfig().call();
        let feePercent = parseFloat(result[0]) / 10000;
        let rewardPercent = parseFloat(result[5]) / 10000;
        Web3Storage.setParams(feePercent, parseFloat(convertBigNumberToNormal(result[1])), parseInt(result[2]),
            parseInt(result[3]), parseFloat(convertBigNumberToNormal(result[4])), rewardPercent);
    },

    async queryConfigInfo(key) {
        let result = await queryContractV1.methods.queryConfigInfo(Web3Provider.web3.utils.fromAscii(key)).call();
        let canDecimal = false;

        let decimal = 0;

        if(key === "PRODUCE_DGAS_RATE" || key === "LIST_DGAS_AMOUNT" || key === "PROPOSAL_DGAS_AMOUNT") {
            decimal = 18;
            canDecimal = true;
        } else if(key === "SWAP_FEE_PERCENT" || key === "TOKEN_TO_DGAS_PAIR_MIN_PERCENT"
            || key === "LIST_TOKEN_FAILURE_BURN_PRECENT" || key === "LIST_TOKEN_SUCCESS_BURN_PRECENT"
            || key === "VOTE_REWARD_PERCENT" || key === "FEE_LP_REWARD_PERCENT" || key === "FEE_GOVERNANCE_REWARD_PERCENT") {
            decimal = 4;
            canDecimal = true;
        }

        let minValue = convertBigNumberToNormal(result["minValue"], decimal);
        let maxValue = convertBigNumberToNormal(result["maxValue"], decimal);
        let currentValue = convertBigNumberToNormal(result["value"], decimal);
        let span = convertBigNumberToNormal(result["maxSpan"], decimal);
        return Web3Storage.setConfigInfo(key, minValue, maxValue, currentValue, span);
    },

    async queryNewToken(address) {
        try {
            let result = await queryContractV1.methods.queryTokenItemInfo(address).call({from: Web3Provider.currentAccount});
            let token = Web3Storage.getToken(address);
            return {
                decimal: result["decimal"],
                symbol: result["symbol"],
                balance: convertBigNumberToNormal(result["balance"], parseInt(result["decimal"])),
                totalSupply: convertBigNumberToNormal(result["totalSupply"], parseInt(result["decimal"])),
                allowance: convertBigNumberToNormal(result["allowance"], parseInt(result["decimal"])),
                canList: !token || token.status === 0 || token.status === 4,
                valid: true
            };
        } catch (e) {
            return {
                valid: false
            }
        }
    },

    async queryStakeInfo() {
        let block = await Web3Provider.web3.eth.getBlockNumber();
        let result = await queryContractV1.methods.queryStakeInfo().call({from: Web3Provider.currentAccount});
        let stakeAmount = parseFloat(convertBigNumberToNormal(result.stake_amount));
        let stakeInfo = {
            totalStake: convertBigNumberToNormal(result.total_stake),
            stakeAmount: stakeAmount,
            redeemAmount: parseInt(result.stake_block) + Web3Storage.params.unstakeDuration > block ? 0: stakeAmount,
            remainBlock:  stakeAmount > 0 ? Math.max(0, parseInt(result.stake_block) + Web3Storage.params.unstakeDuration - block): 0
        };
        Web3Storage.setStakeInfo(stakeInfo)
        return stakeInfo;
    },

    async queryCondition(tokenList) {
        return await queryContractV1.methods.queryCondition(tokenList).call({from: Web3Provider.currentAccount});
    },

    async queryReserveList(token0_list, token1_list) {
        let result = await queryContractV1.methods.queryPairReserve(token0_list, token1_list).call({from: Web3Provider.currentAccount})
        for(let i = 0; i < token0_list.length;i++) {
            let reserve0 = convertBigNumberToNormal(result.reserve0_list[i], Web3Storage.getDecimal(token0_list[i]));
            let reserve1 = convertBigNumberToNormal(result.reserve1_list[i], Web3Storage.getDecimal(token1_list[i]));
            let pair = new Pair(token0_list[i], token1_list[i], parseFloat(reserve0), parseFloat(reserve1), result.exist_list[i]);
            Web3Storage.addPair(token0_list[i], token1_list[i], pair);
        }
    }
};
