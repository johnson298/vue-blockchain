import ChainApi from '../../static/sdk/ChainApi';
import BigNumber from 'bignumber.js';

export default {
    data() {
        return {
            commonLoad: false,
            commonBalance: null,
        }
    },
    methods: {
        comApprove(lpToken, pool) {
            this.commonLoad = true;
            return ChainApi.approve(lpToken, pool).then(tx => {
                console.log(tx)
                this.$store.dispatch('recordCallback', {
                    key: 'Approve',
                    action: 'Approve',
                    params: {describe: 'Approve'},
                    code: 1,
                    result: tx.transactionHash,
                });
                this.$notify({
                    title: 'Approve',
                    message: 'Approve Success',
                    type: 'success'
                });
                return Promise.resolve('success');
            }).finally(() => {
                this.commonLoad = false;
            })
        },

        comBalance(lpToken, walletAddress) {
            ChainApi.tokenBalanceOf(lpToken, walletAddress).then(res => {
                if (res) {
                    this.commonBalance = res.toFixed();
                    console.error('this is balance....', this.commonBalance);
                }
            })
        }

    },
};
