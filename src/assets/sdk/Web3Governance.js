import {Web3Provider} from "./Web3Provider.js";
import {Web3Caller} from "./Web3Caller.js";
import {Web3Storage} from "./Web3Storage.js";
import {Constant} from "./Constant.js";
import GovernanceABI from "./abi/demaxGovernanceABI.js";
import BallotABI from "./abi/demaxBallotABI.js";
import ConfigABI from "./abi/demaxConfigABI.js";
import {convertNormalToBigNumber, convertBigNumberToNormal, calculateMultiplied, minusBigNumber, getDeadLine} from "./util/util.js"
let governanceContract = null;
export var Web3Governance = {
    initialize() {
        Web3Storage.setupBallotDic(Constant.BallotList);
        governanceContract = new Web3Provider.web3.eth.Contract(GovernanceABI, Web3Provider.getGovernanceAddress());
    },

    stake(amount, callback) {
        Web3Caller.executeContract(governanceContract, "deposit", 0, [convertNormalToBigNumber(amount)], callback);
    },

    redeem(amount, callback) {
        if(Web3Storage.stakeDic.redeemAmount >= amount) {
            Web3Caller.executeContract(governanceContract, "withdraw", 0, [convertNormalToBigNumber(amount)], callback);
        }
    },  

    async queryFee() {
        return convertBigNumberToNormal(await governanceContract.methods.rewardOf(Web3Provider.getPoolAddress()).call());
    },

    listToken(tokenAddress, symbol, amount, callback) {
        Web3Caller.executeContract(governanceContract, "listToken", 0, [tokenAddress, convertNormalToBigNumber(amount), true, symbol, tokenAddress], callback);
    },

    changeConfig(key, value, amount, content, callback) {
        let config = Web3Storage.getConfig(key);
        if(config && value >= config.minValue && value <= config.maxValue && Math.abs(value - config.currentValue) <= config.span) {
            let decimal = 0;
            if(key === "PRODUCE_DGAS_RATE" || key === "LIST_DGAS_AMOUNT" || key === "PROPOSAL_DGAS_AMOUNT") {
                decimal = 18;
            } else if(key === "SWAP_FEE_PERCENT" || key === "TOKEN_TO_DGAS_PAIR_MIN_PERCENT"
                || key === "LIST_TOKEN_FAILURE_BURN_PRECENT" || key === "LIST_TOKEN_SUCCESS_BURN_PRECENT"
                || key === "VOTE_REWARD_PERCENT" || key === "FEE_LP_REWARD_PERCENT" || key === "FEE_GOVERNANCE_REWARD_PERCENT") {
                decimal = 4;
            }
            Web3Caller.executeContract(governanceContract, "createConfigBallot", 0, [Web3Provider.toByte32(key), convertNormalToBigNumber(value, decimal), convertNormalToBigNumber(amount), 1, config.title, content], callback);
        } else {
            console.log("invalid change value:", config, value);
        }
    },

    auditConfig(address, callback) {
        Web3Caller.executeContract(governanceContract, "audit", 0, [address], callback);
    },

    vote(ballotAddress, index, callback) {
        let ballotContract = new Web3Provider.web3.eth.Contract(BallotABI, ballotAddress);
        Web3Caller.executeContract(ballotContract, "vote", 0, [parseInt(index)], callback);
    },

    // changeConfig(key, value, )

    async ballotCount() {
        return await governanceContract.methods.ballotCount().call();
    },

    async queryProposalReward(ballotAddress) {
        let reward = await governanceContract.methods.getReward(ballotAddress).call({from: Web3Provider.currentAccount});
        return convertBigNumberToNormal(reward);
    },

    mintProposalReward(ballotAddress, callback) {
        Web3Caller.executeContract(governanceContract, "collectReward", 0, [ballotAddress], callback);
    },

    test() {
        // console.log("sss", governanceContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    }
};
