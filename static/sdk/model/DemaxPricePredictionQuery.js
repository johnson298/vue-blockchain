import DemaxPricePredictionQueryABI from '../abi/DemaxPricePredictionQuery.json';
import Base from './Base';
import {DemaxPricePredictionPools} from '../config/DemaxPricePrediction.js';

export default class DemaxPricePredictionQuery extends Base {
    constructor(provider) {
        super(provider, DemaxPricePredictionQueryABI, 'DemaxPricePredictionQuery');
    }

    async getPools() {
        return DemaxPricePredictionPools[this.provider.chainId];
    }

    async getRound(_prediction, _epoch) {
        return await this.contract.methods.getRound(_prediction, _epoch).call();
    }

    async getRounds(_prediction, _epochs) {
        return await this.contract.methods.getRounds(_prediction, _epochs).call();
    }

    async getUserRound(_prediction, _epoch, _user) {
        if(!_user) {
            _user = this.provider.account
        }
        return await this.contract.methods.getUserRound(_prediction, _epoch, _user).call();
    }

    async getUserRounds(_prediction, _epochs, _user) {
        if(!_user) {
            _user = this.provider.account
        }
        return await this.contract.methods.getUserRounds(_prediction, _user, _epochs).call();
    }

    async iterateUserRounds(_prediction, _cursor, _size, _user) {
        if(!_user) {
            _user = this.provider.account
        }
        return await this.contract.methods.iterateUserRounds(_prediction, _user, _cursor, _size).call();
    }

    async iterateRevestUserRounds(_prediction, _cursor, _size, _user) {
        if(!_user) {
            _user = this.provider.account
        }
        return await this.contract.methods.iterateRevestUserRounds(_prediction, _user, _cursor, _size).call();
    }
}
