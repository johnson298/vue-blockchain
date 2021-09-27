import {Web3Provider} from './Web3Provider.js';
import {Web3Caller} from './Web3Caller.js';
import DemaxConvertABI from './abi/DemaxConvertABI.js';
import {convertNormalToBigNumber, convertBigNumberToNormal} from './util/util.js';
let convertContract = null;
export var Web3Convert = {
    initialize() {
        convertContract = new Web3Provider.web3.eth.Contract(
            DemaxConvertABI,
            Web3Provider.getConvertAddress(),
        );
    },

    convertTokenForBNB(token, decimals, amount, callback) {
        console.log(token, decimals, amount);
        Web3Caller.executeContract(
            convertContract,
            'convertTokenForBNB',
            0,
            [token, convertNormalToBigNumber(amount, decimals)],
            callback,
        );
    },

    convertETHForBNB(amount, callback) {
        Web3Caller.executeContract(
            convertContract,
            'convertETHForBNB',
            convertNormalToBigNumber(amount),
            [],
            callback,
        );
    },

    async tokenLimits(token, decimals) {
        return convertBigNumberToNormal(await convertContract.methods.tokenLimits(token).call(), decimals);
    },

    async isConvert(user) {
        return await convertContract.methods.users(user).call();
    },

    async validTokens() {
        return await convertContract.methods.validTokens().call();
    },

    test() {
        // console.log("sss", convertContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    },
};
