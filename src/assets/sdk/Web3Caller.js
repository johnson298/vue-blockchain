import {Web3Contract} from './Web3Contract.js';
import ERC20ABI from './abi/erc20.js';
import ConfigABI from './abi/demaxConfigABI.js';
import DGasABI from './abi/dgas.js';
import {Web3Provider} from './Web3Provider.js';
import {Constant} from './Constant.js';
import {getGasLimit} from './GasLimit.js';
import {Web3Storage} from './Web3Storage.js';
import {convertNormalToBigNumber, convertBigNumberToNormal} from './util/util.js';
let dgasContract = null;
export var Web3Caller = {
    initialize() {
        dgasContract = new Web3Provider.web3.eth.Contract(
            DGasABI,
            Constant.ContractAddress.DGas,
        );
    },

    async updateTokenInfo(address) {
        if(!Web3Storage.tokenDic[address]) {
            await this.queryTokenInfo(address);
        }
    },

    async queryTokenInfo(address) {
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, address);
        let symbol = await tokenContract.methods.symbol().call();
        let name = await tokenContract.methods.name().call();
        let decimals = await tokenContract.methods.decimals().call();
        let totalSupply = await tokenContract.methods.totalSupply().call();

        let result = {
            symbol: symbol,
            name: name,
            decimals: decimals,
            totalSupply: totalSupply,
        };

        Web3Storage.updateToken(address, result);
        return result;
    },

    async callListToken(tokenAddress, dGaxAmount) {
        let configContract = new Web3Provider.web3.eth.Contract(
            ConfigABI,
            Constant.ContractAddress.DemaxConfig,
        );
        try {
            configContract.methods
                .listToken(tokenAddress, convertNormalToBigNumber(dGaxAmount))
                .send({from: Web3Provider.currentAccount});
            // console.log('success');
            return true;
        } catch (e) {
            // console.log(e);
            return false;
        }
    },

    async balanceOf(token_address) {
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, token_address);
        let balance = await tokenContract.methods
            .balanceOf(Web3Provider.currentAccount)
            .call();
        return convertBigNumberToNormal(balance);
    },

    async approveToken(token_address, amount, callback) {
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, token_address);
        let pf_address = Web3Provider.getPlatformAddress();
        let bigAmount = convertNormalToBigNumber(
            amount,
            Web3Storage.getDecimal(token_address),
        );
        // console.log(bigAmount);

        Web3Caller.executeContract(
            tokenContract,
            'approve',
            0,
            [pf_address, bigAmount],
            callback,
        );
    },

    async approveTokenGOV(
        amount,
        callback,
        token_address = Web3Provider.getDGASAddress(),
    ) {
        await this.updateTokenInfo(token_address);
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, token_address);
        let bigAmount = convertNormalToBigNumber(
            amount,
            Web3Storage.getDecimal(token_address),
        );

        Web3Caller.executeContract(
            tokenContract,
            'approve',
            0,
            [Web3Provider.getGovernanceAddress(), bigAmount],
            callback,
        );
    },

    async sendCallback(callback, code, data) {
        if (callback) {
            callback(code, data);
        }
    },
    async executeContract(contract, methodName, value, params, callback) {
        value = Web3Provider.web3.utils.numberToHex(value);
        let sendParams = {from: Web3Provider.currentAccount, value: value};
        let gas = getGasLimit(methodName);
        if(gas) {
            sendParams['gas'] = gas;
        }
        console.log('contract:', contract._address, 'params:', params, ' sendParams:', sendParams);
        contract.methods[methodName](...params)
            .send(sendParams)
            .on('transactionHash', function (hash) {
                Web3Caller.sendCallback(callback, 0, hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                if (confirmationNumber === 1) {
                    Web3Caller.sendCallback(callback, 1, receipt.transactionHash);
                    // console.log('confirm transaction', methodName);
                } else if (confirmationNumber === 12) {
                    Web3Caller.sendCallback(callback, 4, receipt.transactionHash);
                    // console.log('confirm transaction 12', methodName);
                }
            })
            .on('error', function (error, message) {
                if (message && message.transactionHash) {
                    Web3Caller.sendCallback(callback, 3, message.transactionHash);
                } else {
                    Web3Caller.sendCallback(callback, 2, error.message);
                }
            });
    },
};
