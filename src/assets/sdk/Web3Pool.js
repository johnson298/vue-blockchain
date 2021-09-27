import {Web3Provider} from './Web3Provider.js';
import {Web3Caller} from './Web3Caller.js';
import DemaxPoolABI from './abi/DemaxPoolABI.js';
import {convertNormalToBigNumber, convertBigNumberToNormal} from "./util/util.js"
let poolContract = null;
export var Web3Pool = {
    initialize() {
        poolContract = new Web3Provider.web3.eth.Contract(
            DemaxPoolABI,
            Web3Provider.getPoolAddress(),
        );
    },

    claimReward(pair, token, callback) {
        Web3Caller.executeContract(
            poolContract,
            'claimReward',
            0,
            [pair, token],
            callback,
        );
    },

    async queryReward(pair, user) {
        return await poolContract.methods.queryReward(pair, user).call({from: user});
    },

    async feeCumulation() {
        let res = await poolContract.methods.feeCumulation().call();
        return {
            total: convertBigNumberToNormal(res[0]),
            liquidity: convertBigNumberToNormal(res[1]),
            governance: convertBigNumberToNormal(res[2]),
            burn: convertBigNumberToNormal(res[3]),
        }
    },


    test() {
        // console.log("sss", ethBurgerTransitContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    },
};
