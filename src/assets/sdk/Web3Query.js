import { Web3Contract } from "./Web3Contract.js";
import QueryABI from "./abi/demaxQueryABI.js";
import { Web3Provider } from './Web3Provider.js';
import { Web3Storage } from './Web3Storage.js';
import { Web3Platform } from './Web3Platform.js';
import { Constant } from './Constant.js';
import Token from "./model/token.js";
import Liquidity from "./model/liquidity.js";
import Proposal from "./model/proposal.js";
import Config from "./model/config.js";
import { convertNormalToBigNumber, convertBigNumberToNormal, calculatePercentage } from "./util/util.js"
import Pair from "./model/pair.js";
import $http from 'axios';
import BigNumber from 'bignumber.js';
import { SwapInstance } from "@/assets/swap.init";
import ERC20ABI from "./abi/ERC20ABI.js";


let queryContract = null;
export var Web3Query = {
    initialize() {
        queryContract = new Web3Provider.web3.eth.Contract(
            ERC20ABI,
            "0x9C53c277c6F4f3C3C64Fa3C484CB1875e55B27C9"
            // QueryABI,
        );
        // Web3Provider.getQueryAddress();

        // window["xxxx"] = queryContract
        // window["Web3Query"] = Web3Query
        window["Web3Query"] = Web3Query;
        console.log(
            "Web3Provider.getQueryAddress()",
            Web3Provider.getQueryAddress()
        );
    },

    queryTokenList() {
        let results
        let tokenList = []
        return new Promise((f) => {
            setTimeout(async () => {

                try {
                    results = await queryContract.methods.queryTokenList().call({ from: String(Web3Provider.currentAccount) });
                    for (let i = 0; i < results.length; i++) {
                        let item = results[i];
                        // console.log('query token item:', item);
                        let decimals = parseInt(item["decimal"]);
                        let balance = Web3Storage.isETH(item["tokenAddress"]) ? (await Web3Provider.getBalance()) : convertBigNumberToNormal(item["balance"], decimals);
                        let allowance = Web3Storage.isETH(item["tokenAddress"]) ? Web3Storage.MAXNUM : convertBigNumberToNormal(item["allowance"], decimals);
                        let symbol = Web3Storage.isETH(item["tokenAddress"]) ? Web3Provider.getZeroSymbol() : item["symbol"];
                        let totalSupply = Web3Storage.isETH(item["tokenAddress"]) ? 0 : convertBigNumberToNormal(item["totalSupply"], decimals);
                        let allowance_gov = convertBigNumberToNormal(item["allowanceGov"], decimals);
                        tokenList.push(new Token(item["tokenAddress"], symbol, totalSupply, balance, allowance, allowance_gov,
                            decimals, parseInt(item.status)))
                    }

                    Web3Storage.setupTokenList(tokenList);
                } catch (e) {

                    // console.log("queryTokenList-error=", e)
                }


                let ccd = tokenList.filter(i => i.status === 2 || i.status === 3);
                // console.log("queryTokenList 2", ccd)

                // return tokenList.filter(i => i.status === 2 || i.status === 3);
                f(ccd);

            }, 1500);

        })

        // try{
        //     // results = await queryContract.methods.queryTokenList().call({from: String(Web3Provider.currentAccount)});
        //     results = await window["xxxx"].methods.queryTokenList().call({from:"0x36db931dD3EBb57664736F2d82486dbe9EcE21DA"})
        // }catch (e) {
        //
        //     console.log("queryTokenList-error=",e)
        // }
        //
        // console.log("queryConfig 2",results)
        // for (let i = 0; i < results.length; i++) {
        //     let item = results[i];
        //     let decimals = parseInt(item["decimal"]);
        //     let balance = Web3Storage.isETH(item["tokenAddress"]) ? (await Web3Provider.getBalance()) : convertBigNumberToNormal(item["balance"], decimals);
        //     let allowance = Web3Storage.isETH(item["tokenAddress"]) ? Web3Storage.MAXNUM : convertBigNumberToNormal(item["allowance"], decimals);
        //     let symbol = Web3Storage.isETH(item["tokenAddress"]) ? "ETH" : item["symbol"];
        //     let totalSupply = Web3Storage.isETH(item["tokenAddress"]) ? 0 : convertBigNumberToNormal(item["totalSupply"], decimals);
        //     let allowance_gov = convertBigNumberToNormal(item["allowanceGov"], decimals);
        //     tokenList.push(new Token(item["tokenAddress"], symbol, totalSupply, balance, allowance, allowance_gov,
        //         decimals, parseInt(item.status)))
        // }
        //
        // Web3Storage.setupTokenList(tokenList);
        // let ccd = tokenList.filter(i => i.status === 2 || i.status === 3);
        // return ccd
    },
    async getToTalSupply() {
        let totalSupply = 0;
        try {
            totalSupply = await queryContract.methods
                .totalSupply()
                .call({ from: String(Web3Provider.currentAccount) });
            console.log("totalSupply from query");
            console.log(totalSupply);
        } catch (err) {
            console.log(err);
        }

        return convertBigNumberToNormal(totalSupply, 18);
    },
    async getName() {
        let name;
        try {
            name = await queryContract.methods
                .name()
                .call({ from: String(Web3Provider.currentAccount) });
            console.log("name from query");
            console.log(name);
        } catch (err) {
            alert(err);
        }

        return name;
    },
    async queryLiquidityList() {
        console.log('queryLiquidityList...');
        let block = await Web3Provider.getCurrentBlock();
        let liquidityList = [];
        let results = await queryContract.methods.queryLiquidityList().call({ from: Web3Provider.currentAccount });
        // console.log('queryLiquidityList results:', results);
        let address_list = [];
        for (let i = 0; i < results.length; i++) {
            let l = results[i];
            let address = l["pair"];
            let percentage = calculatePercentage(l["balance"], l["totalSupply"]);
            let canRemove = block >= parseInt(l["lastBlock"]) + Web3Storage.params.removeDuration;
            let liquidity = new Liquidity(address, parseFloat(percentage), l["balance"], canRemove);
            liquidity.liquidityShow = convertBigNumberToNormal(l["balance"]);
            liquidity.pair = l["pair"];
            liquidityList.push(liquidity);
            address_list.push(address);
        }

        results = await queryContract.methods.queryPairListInfo(address_list).call({ from: Web3Provider.currentAccount });
        for (let i = 0; i < address_list.length; i++) {
            let token0 = results.token0_list[i];
            let token1 = results.token1_list[i];
            liquidityList[i].setTokenAddress(token0, token1);

            let reserve0 = convertBigNumberToNormal(results.reserve0_list[i], Web3Storage.getDecimal(token0));
            let reserve1 = convertBigNumberToNormal(results.reserve1_list[i], Web3Storage.getDecimal(token1));
            liquidityList[i].setReserve(reserve0, reserve1);
        }

        // $http
        //     .post(Web3Provider.getOpenApiUrl()+'/market/pair/aprs', {
        //         pairIDs: address_list
        //     }).then((res) => {
        //     // console.log('aprs result:', res);
        //     if (res && res.code === 2000) {
        //         for (let i = 0; i < address_list.length; i++) {
        //             liquidityList[i].setApr(res.data[i].aprTransaction, res.data[i].aprMining);
        //         }
        //     }
        // });
        if (address_list && address_list.length > 0) {
            let res = await Web3Query.QPost(Web3Provider.getOpenApiUrl() + '/market/pair/aprs', { pairIDs: address_list });
            if (res && res.data && res.code === 2000) {
                for (let i = 0; i < address_list.length; i++) {
                    if (res.data[i]) {
                        liquidityList[i].setApr(res.data[i].aprTransaction, res.data[i].aprMining);
                    }
                }
            }
        }

        Web3Storage.setupLiquidityList(liquidityList);

        for (let i = 0; i < address_list.length; i++) {
            await Web3Platform.queryReward(address_list[i]);
        }
        // console.log('liquidityList:', liquidityList)
        return Object.values(Web3Storage.liquidityDic);
    },

    async QPost(url, params) {
        return $http.post(url, params);
    },

    async pageSliderProposalList() {
        let block = await Web3Provider.web3.eth.getBlockNumber();
        let proposalList = [];
        const total = Number(await SwapInstance.$governance.ballotCount());

        return new Promise((resolve, reject) => {
            const pageSlider = async (start, end) => {
                // console.error('ballotCount----', start, end)
                try {
                    let results = await queryContract.methods.iterateReverseProposalList(start, Math.max(end, 0)).call({ from: Web3Provider.currentAccount });
                    for (let i = 0; i < results.length; i++) {
                        let item = results[i];
                        let proposal = new Proposal(item.ballotAddress, item.tokenAddress, item.ballotType, item.subject, item.content, item.createTime, item.end,
                            convertBigNumberToNormal(item.YES), convertBigNumberToNormal(item.NO), convertBigNumberToNormal(item.totalReward), item.voted,
                            item.voteIndex, item.minted, convertBigNumberToNormal(item.weight), item.audited);
                        proposal.remainBlock = Math.max(0, parseInt(item.endBlock) - block);
                        proposal.proposer = item.proposer;
                        if (parseInt(proposal.type) === 1) {
                            let key = Web3Provider.fromByte32(item.key);
                            let decimal = Web3Storage.getConfigDecimal(key);
                            proposal.setValue(convertBigNumberToNormal(item.value, decimal));
                            proposal.key = key;
                            proposal.currentValue = (convertBigNumberToNormal(item.currentValue, decimal));
                        }
                        // console.log('iterateReverseProposalList i:', i, proposal, new Date(proposal.createTime*1000));
                        proposalList.push(proposal);

                    }
                } catch (e) {
                    resolve(proposalList)
                }


                if (end >= 0) {
                    setTimeout(_ => {
                        pageSlider(end, end - 15);
                    }, 1000)
                }
                else {
                    resolve(proposalList)
                }
            }

            pageSlider(total, total - 15);
        })

    },


    async queryProposalList() {

        let proposalList = await this.pageSliderProposalList()

        Web3Storage.setupProposalList(proposalList);
        return proposalList;
    },

    async iterateReverseProposalList(start, end) {
        let block = await Web3Provider.web3.eth.getBlockNumber();
        let proposalList = [];
        let results = await queryContract.methods.iterateReverseProposalList(start, end).call({ from: Web3Provider.currentAccount });
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            let proposal = new Proposal(item.ballotAddress, item.tokenAddress, item.ballotType, item.subject, item.content, item.createTime, item.end,
                convertBigNumberToNormal(item.YES), convertBigNumberToNormal(item.NO), convertBigNumberToNormal(item.totalReward), item.voted,
                item.voteIndex, item.minted, convertBigNumberToNormal(item.weight), item.audited);
            proposal.remainBlock = Math.max(0, parseInt(item.endBlock) - block);
            proposal.proposer = item.proposer;
            proposalList.push(proposal);

            if (parseInt(proposalList[i].type) === 1) {
                let key = Web3Provider.fromByte32(item.key);
                let decimal = Web3Storage.getConfigDecimal(key);
                proposalList[i].setValue(convertBigNumberToNormal(item.value, decimal));
                proposalList[i].key = key;
                proposalList[i].currentValue = (convertBigNumberToNormal(item.currentValue, decimal));
            }

            Web3Storage.setProposal(proposalList[i])
        }

        return proposalList;
    },

    async queryConfig() {
        let result = await queryContract.methods.queryConfig().call();
        let feePercent = parseFloat(result[0]) / 10000;
        let rewardPercent = parseFloat(result[5]) / 10000;
        Web3Storage.setParams(feePercent, parseFloat(convertBigNumberToNormal(result[1])), parseInt(result[2]),
            parseInt(result[3]), parseFloat(convertBigNumberToNormal(result[4])), rewardPercent);
    },

    async queryConfigInfo(key) {
        let result = await queryContract.methods.queryConfigInfo(Web3Provider.web3.utils.fromAscii(key)).call();
        let canDecimal = false;

        let decimal = 0;

        if (key === "PRODUCE_DGAS_RATE" || key === "LIST_DGAS_AMOUNT" || key === "PROPOSAL_DGAS_AMOUNT") {
            decimal = 18;
            canDecimal = true;
        } else if (key === "SWAP_FEE_PERCENT" || key === "TOKEN_TO_DGAS_PAIR_MIN_PERCENT"
            || key === "LIST_TOKEN_FAILURE_BURN_PRECENT" || key === "LIST_TOKEN_SUCCESS_BURN_PRECENT"
            || key === "VOTE_REWARD_PERCENT" || key === "FEE_LP_REWARD_PERCENT" || key === "FEE_GOVERNANCE_REWARD_PERCENT") {
            decimal = 4;
            canDecimal = true;
        }

        let minValue = convertBigNumberToNormal(result["minValue"], decimal);
        let maxValue = convertBigNumberToNormal(result["maxValue"], decimal);
        let currentValue = convertBigNumberToNormal(result["value"], decimal);
        let span = convertBigNumberToNormal(result["maxSpan"], decimal);
        // console.log("config item:", minValue, maxValue, currentValue, span);
        return Web3Storage.setConfigInfo(key, minValue, maxValue, currentValue, span);
    },

    async queryNewToken(address) {
        try {
            let result = await queryContract.methods.queryTokenItemInfo(address).call({ from: Web3Provider.currentAccount });
            console.log('queryNewToken:', result, address, Web3Provider.currentAccount)
            let token = Web3Storage.getToken(address);
            return {
                address: address,
                decimal: result["decimal"],
                symbol: result["symbol"],
                balance: convertBigNumberToNormal(result["balance"], parseInt(result["decimal"])),
                totalSupply: convertBigNumberToNormal(result["totalSupply"], parseInt(result["decimal"])),
                allowance: convertBigNumberToNormal(result["allowance"], parseInt(result["decimal"])),
                canList: !token || token.status === 0 || token.status === 4,
                valid: true
            };
        } catch (e) {
            // console.log('queryNewToken except:', e);
            return {
                valid: false
            }
        }
    },

    async queryStakeInfo() {
        let block = await Web3Provider.web3.eth.getBlockNumber();
        let result = await queryContract.methods.queryStakeInfo().call({ from: Web3Provider.currentAccount });
        let stakeAmount = parseFloat(convertBigNumberToNormal(result.stake_amount));
        let stakeInfo = {
            totalStake: convertBigNumberToNormal(result.total_stake),
            stakeAmount: stakeAmount,
            redeemAmount: parseInt(result.stake_block) + Web3Storage.params.unstakeDuration > block ? 0 : stakeAmount,
            remainBlock: stakeAmount > 0 ? Math.max(0, parseInt(result.stake_block) + Web3Storage.params.unstakeDuration - block) : 0
        };
        Web3Storage.setStakeInfo(stakeInfo)
        return stakeInfo;
    },

    async queryCondition(tokenList) {
        return await queryContract.methods.queryCondition(tokenList).call({ from: Web3Provider.currentAccount });
    },

    async queryReserveList(token0_list, token1_list) {
        let result = await queryContract.methods.queryPairReserve(token0_list, token1_list).call({ from: Web3Provider.currentAccount })
        for (let i = 0; i < token0_list.length; i++) {
            let reserve0 = convertBigNumberToNormal(result.reserve0_list[i], Web3Storage.getDecimal(token0_list[i]));
            let reserve1 = convertBigNumberToNormal(result.reserve1_list[i], Web3Storage.getDecimal(token1_list[i]));
            let pair = new Pair(token0_list[i], token1_list[i], parseFloat(reserve0), parseFloat(reserve1), result.exist_list[i]);
            Web3Storage.addPair(token0_list[i], token1_list[i], pair);
        }
    },

    async getTokenPrice(pair, token) {
        if (!pair || !token) {
            return '0'
        }
        let res = await queryContract.methods.getPairReserve(pair).call()
        let d0 = new BigNumber(res.decimals0)
        let d1 = new BigNumber(res.decimals1)
        let r0 = new BigNumber(res.reserve0)
        let r1 = new BigNumber(res.reserve1)
        let offset = d0.minus(d1)
        if (offset > 0) {
            r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
        } else if (offset < 0) {
            r0 = r0.multipliedBy(new BigNumber(10).pow(offset))
        }
        if (token.toLocaleLowerCase() == res.token0.toLocaleLowerCase()) {
            return r1.dividedBy(r0).toFixed()
        } else {
            return r0.dividedBy(r1).toFixed()
        }
    },

    async getBNBPrice() {
        let pair = Web3Provider.getPairAddress('USDT_WBNB')
        let token = Web3Provider.getTokenAddress('WBNB')
        return await this.getTokenPrice(pair, token)
    }
};
