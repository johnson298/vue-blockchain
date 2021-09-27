export default class Base {
    constructor(provider, abi, name) {
        this.provider = provider;
        this.abi = abi;
        this.name = name;
        this.address = '';
        provider.registerModule(this);
    }

    initialize() {
        console.log('Base initialize:', this.name);
        try {
            this.address = this.provider.getContractAddr(this.name);
            console.log('address:', this.name, this.address);
            this.contract = this.provider.getContract(this.abi, this.address);
        } catch(e) {
            console.error('fail to init contract:', this.name, e);
        }
    }
}