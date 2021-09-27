import TokenQueryABI from './abi/TokenQueryABI.js';
import {Web3Provider} from './Web3Provider.js';
let tokenQueryContract = null;
export var Web3TokenQuery = {
    initialize() {
        tokenQueryContract = new Web3Provider.web3.eth.Contract(
            TokenQueryABI,
            Web3Provider.getTokenQueryAddress(),
        );
    },

    async queryInfo(user, tokens) {
        // console.log(Web3Provider.getTokenQueryAddress(),tokens,'Web3Provider.getTokenQueryAddress()')
        return await tokenQueryContract.methods.queryInfo(user, tokens).call();
    },
};
