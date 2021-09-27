import DemaxClaimABI from '../abi/Claim.json';
import ERC20Token from './ERC20Token.js';
import BigNumber from "bignumber.js"
import Base from './Base';

export default class DemaxClaim extends Base {
    constructor(provider) {
        super(provider, DemaxClaimABI, 'DemaxClaim');
    }

    async getRewardLength() {
        return await this.contract.methods.rewardLength().call();
    }

    async getRewardInfo(pid) {
        return await this.contract.methods.rewardInfo(pid).call();
    }

    async getPendingReward() {
        let length = await this.getRewardLength();
        if (length == 0) {
            return { result: false, amount: '0', symbol: '' };
        }
        return await this.getPendingRewardWithPid(length - 1);
    }

    async claim() {
        let length = await this.getRewardLength();
        if (length == 0) {
            throw ('no reward to claim');
        }
        return await this.claimWithPid(length - 1);
    }

    async getPendingRewardWithPid(pid) {
        let res = await this.contract.methods.pendingReward(pid).call({ from: this.provider.account });
        let rewardInfo = await this.getRewardInfo(pid);
        let tokenIns = new ERC20Token(this.provider, rewardInfo[0]);
        let tokenInfo = await tokenIns.info();
        if (rewardInfo.endTimestamp * 1000 < new Date().getTime()) {
            return { result: false, amount: '0', symbol: '' };
        }
        if (rewardInfo.balance <= 0) {
            return { result: false, amount: '0', symbol: tokenInfo.symbol };
        }
        return {
            result: res[0],
            amount: new BigNumber(res[1]).shiftedBy(-1 * tokenInfo.decimals).toFixed(0),
            symbol: tokenInfo.symbol,
        };
    }

    async claimWithPid(pid) {
        return await this.provider.executeContract(this.contract, 'claim', 0, [pid]);
    }
}
