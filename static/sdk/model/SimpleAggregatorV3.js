import SimpleAggregatorV3ABI from '../abi/SimpleAggregatorV3.json';

export default class SimpleAggregatorV3 {
    constructor(provider, address) {
        this.address = address;
        this.provider = provider;
        this.abi = SimpleAggregatorV3ABI;
        this.contract = this.provider.getContract(this.abi, address);
    }

    async getLatestRoundData() {
        return await this.contract.methods.latestRoundData().call();
    }

    async updateRoundData(amount) {
        return await this.provider.executeContract(this.contract, 'updateRoundData', 0, [amount]);
    }
}