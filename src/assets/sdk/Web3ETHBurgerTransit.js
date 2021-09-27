import {Web3Provider} from './Web3Provider.js';
import {Web3Caller} from './Web3Caller.js';
import {Web3Storage} from './Web3Storage.js';
import ETHBurgerTransitABI from './abi/ETHBurgerTransitABI.js';
import ERC20ABI from './abi/erc20.js';
import {convertNormalToBigNumber, convertBigNumberToNormal} from './util/util.js';
let ethBurgerTransitContract = null;
export var Web3ETHBurgerTransit = {
    initialize() {
        ethBurgerTransitContract = new Web3Provider.web3.eth.Contract(
            ETHBurgerTransitABI,
            Web3Provider.getETHBurgerTransitAddress(),
        );
    },

    transitForBSC(token, decimals, amount, callback) {
        console.log(token, decimals, amount);
        Web3Caller.executeContract(
            ethBurgerTransitContract,
            'transitForBSC',
            0,
            [token, convertNormalToBigNumber(amount, decimals)],
            callback,
        );
    },

    transitETHForBSC(amount, callback) {
        Web3Caller.executeContract(
            ethBurgerTransitContract,
            'transitETHForBSC',
            convertNormalToBigNumber(amount),
            [],
            callback,
        );
    },

    withdrawFromBSC(signature, paybackId, token, amount, callback) {
        Web3Caller.executeContract(
            ethBurgerTransitContract,
            'withdrawFromBSC',
            0,
            [signature, paybackId, token, amount],
            callback,
        );
    },

    test() {
        // console.log("sss", ethBurgerTransitContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    },
};
