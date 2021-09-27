import {Web3Provider} from './Web3Provider.js';
import {Web3Caller} from './Web3Caller.js';
import BounceABI from './abi/BounceABI.js';
import ERC20ABI from './abi/erc20.js';
import BigNumber from 'bignumber.js';
import {convertNormalToBigNumber, convertBigNumberToNormal} from './util/util.js';

let bounceContract = null;
export var Web3Bounce = {
    initialize() {
        bounceContract = new Web3Provider.web3.eth.Contract(
            BounceABI,
            Web3Provider.getBounceAddress(),
        );
    },

    async getFSPoolDetail(id) {
        let result = {
            name: '',
            symbol: '',
            address: '',
            decimals: '',
            onlyBOT: '',
            password: '',
            toAmount: '',
            toBidAmount: '',
            toSymbol: '',
            toAddress: '',
            toDecimals: '',
            fromAmount: '',
            limit: '',
            fromBidAmount: '',
            status: '',
            time: '',
            isMine: '',
        }

        result.password = await bounceContract.methods.passwordFP(id).call()

        result.time = await bounceContract.methods.closeAtFP(id).call()
        const date = new Date(result.time * 1000);
        const now = new Date();
        const leftTime = date - now;
        // console.log('query fs closeAt:', result.time, leftTime)
        result.status = leftTime > 0 ? 'Live': 'Closed'

        
        result.toBidAmount = await bounceContract.methods.amountSwap1FP(id).call()
        result.toAmount = await bounceContract.methods.amountTotal1FP(id).call()
        if(result.toBidAmount === result.toAmount){
            result.status = 'Filled'
        }
        result.name = await bounceContract.methods.nameFP(id).call()
        result.onlyBOT = await bounceContract.methods.onlyBotHolder(id).call()

        result.address = await bounceContract.methods.token0FP(id).call()
        const tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, result.address)
        result.symbol = await tokenContract.methods.symbol().call()
        result.decimals = await tokenContract.methods.decimals().call()

        let Psymbol = 'ETH'
        if (Web3Provider.currentChainId === 97 || Web3Provider.currentChainId === 56) {
            Psymbol = 'BNB'
        }
        result.toDecimals = "18"
        result.toAddress = await bounceContract.methods.token1FP(id).call()
        if(new BigNumber(result.toAddress).isEqualTo('0')){
            result.toAddress = Web3Provider.get0Address()
            result.toSymbol = Psymbol
        }else if(result.toAddress.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7'.toLowerCase() || result.toAddress.toLowerCase() === '0x101194a3FF67f83A05B3E15AfA52D45D588614ca'.toLowerCase()) {
            result.toDecimals = "6"
            result.toSymbol = 'USDT'
        }else if(result.toAddress.toLowerCase() === '0x55d398326f99059ff775485246999027b3197955'.toLowerCase()){
            result.toSymbol = 'USDT'
        }else {
            result.toSymbol = 'ETH'
        }

        result.fromAmount = await bounceContract.methods.amountTotal0FP(id).call()
        result.fromBidAmount = await bounceContract.methods.amountSwap0FP(id).call()
        result.limit = await bounceContract.methods.maxEthPerWalletFP(id).call()
        let creator = await  bounceContract.methods.creatorFP(id).call()
        result.isMine = creator.toLowerCase() === Web3Provider.currentAccount.toLowerCase()

        return result
    },

    fixPoolSwapV2(id, ethAmount, password, callback) {
        let value = convertNormalToBigNumber(ethAmount)
        Web3Caller.executeContract(
            bounceContract,
            'fixPoolSwapV2',
            value,
            [id, value, password],
            callback,
        );
    },

    test() {
        // console.log("sss", bounceContract.methods.ballotTypes("0x67ce63493A3E8D72DDe1f9215Be5A4643cE34176").call());
    },
};
