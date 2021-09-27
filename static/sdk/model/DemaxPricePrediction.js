import DemaxPricePredictionABI from '../abi/DemaxPricePrediction.json';
import ERC20Token from './ERC20Token.js';
import BigNumber from "bignumber.js"
import BaseInstance from './BaseInstance';

export default class DemaxPricePrediction extends BaseInstance {
    constructor(provider, address) {
        super(provider, DemaxPricePredictionABI, address);
        if(address) {
            this.initSubscribe(['BetBull', 'BetBear', 'StartRound', 'Pause', 'Unpause']);
        }
        this.token = '';
        this.tokenIns = null;
        this.tokenInfo = {
            symbol: '',
            totalSupply: 0,
            decimals: 18
        };
        this.currentEpoch = 0;
        this.intervalBlocks = 0;
        this.minBetAmount = 0;

    }

    async getToken() {
        if(!this.token) {
            this.token = await this.contract.methods.token().call();
            this.tokenIns = new ERC20Token(this.provider, this.token);
            this.tokenInfo = await this.tokenIns.info();
        }
        return this.token;
    }

    async getCurrentEpoch() {
        return await this.contract.methods.currentEpoch().call();
    }

    async treasuryRate() {
        return await this.contract.methods.treasuryRate().call();
    }

    async getIntervalBlocks() {
        if(!this.intervalBlocks) {
            this.intervalBlocks = await this.contract.methods.intervalBlocks().call();
        }
        return this.intervalBlocks;
    }

    async getMinBetAmount() {
        if(!this.minBetAmount) {
            this.minBetAmount = await this.contract.methods.minBetAmount().call();
        }
        return this.minBetAmount;
    }

    async getUserRounds(cursor, size) {
        return await this.contract.methods.getUserRounds(this.provider.account, cursor, size).call();
    }

    async getRevestUserRounds(cursor, size) {
        return await this.contract.methods.getRevestUserRounds(this.provider.account, cursor, size).call();
    }

    async betBear(amount) {
        let value = 0
        let _token = await this.getToken();
        amount = new BigNumber(amount).shiftedBy(1*this.tokenInfo.decimals).toFixed();
        if(_token === this.provider.ZERO_ADDR) {
            value = amount;
        }
        return await this.provider.executeContract(this.contract, 'betBear', value, [amount]);
    }

    async betBull(amount) {
        let value = 0
        let _token = await this.getToken();
        amount = new BigNumber(amount).shiftedBy(1*this.tokenInfo.decimals).toFixed();
        if(_token === this.provider.ZERO_ADDR) {
            value = amount;
        }
        return await this.provider.executeContract(this.contract, 'betBull', value, [amount]);
    }

    async claim(epoch) {
        return await this.provider.executeContract(this.contract, 'claim', 0, [epoch]);
    }

    async claimAll() {
        return await this.provider.executeContract(this.contract, 'claimAll', 0, []);
    }

    async getRound(epoch) {
        await this.getToken();
        let res = await this.contract.methods.rounds(epoch).call();
        let data = {...res};
        data.oracleDecimals = 8;
        data.tokenDecimals = this.tokenInfo.decimals
        data.tokenSymbol = this.tokenInfo.symbol
        return data;
    }

    async paused() {
        return await this.contract.methods.paused().call();
    }

    async getLedger(epoch) {
        return await this.contract.methods.ledger(epoch, this.provider.account).call();
    }

    async approve() {
        await this.getToken();
        return await this.tokenIns.approve(this.address);
    }

    async allowance() {
        await this.getToken();
        return await this.tokenIns.allowance(this.address);
    }

    async balance() {
        await this.getToken();
        return await this.tokenIns.balanceOf(this.provider.account);
    }
}
