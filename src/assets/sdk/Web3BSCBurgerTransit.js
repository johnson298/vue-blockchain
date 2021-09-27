import {Web3Provider} from './Web3Provider.js';
import {Web3Caller} from './Web3Caller.js';
import BSCBurgerTransitABI from './abi/BSCBurgerTransitABI.js';
import {convertNormalToBigNumber} from './util/util.js';
let bscBurgerTransitContract = null;
export var Web3BSCBurgerTransit = {
    initialize() {
        bscBurgerTransitContract = new Web3Provider.web3.eth.Contract(
            BSCBurgerTransitABI,
            Web3Provider.getBscBurgerTransitAddress(),
        );
    },

    paybackTransit(token, decimals, amount, fee, callback) {
        Web3Caller.executeContract(
            bscBurgerTransitContract,
            'paybackTransit',
            fee,
            [token, convertNormalToBigNumber(amount, decimals)],
            callback,
        );
    },

    withdrawTransitToken(
        signature,
        transitId,
        amount,
        token,
        name,
        symbol,
        decimals,
        fee,
        callback,
    ) {
        Web3Caller.executeContract(
            bscBurgerTransitContract,
            'withdrawTransitToken',
            fee,
            [signature, transitId, amount, token, name, symbol, decimals],
            callback,
        );
    },

    async developFee() {
        return await bscBurgerTransitContract.methods.developFee().call();
    },

    async pairFor(address) {
        return await bscBurgerTransitContract.methods.pairFor(address).call();
    },

    async pairTo(address) {
        return await bscBurgerTransitContract.methods.pairTo(address).call();
    },

    test() {
        // console.log("sss", ethBurgerTransitContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    },
};
