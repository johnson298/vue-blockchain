import {Web3Contract} from './Web3Contract.js';
import DelegateABI from './abi/DemaxDelegateABI.js';
import PairABI from './abi/demaxPairABI.js';
import DemaxLPABI from './abi/DemaxLPABI.js';
import {Web3Provider} from './Web3Provider.js';
import {Web3Storage} from './Web3Storage.js';
import {Web3Caller} from './Web3Caller.js';
import {Constant} from './Constant.js';

import {
    convertNormalToBigNumber,
    convertBigNumberToNormal,
    calculateMultiplied,
    minusBigNumber,
    getDeadLine,
} from './util/util.js';
import {Web3Query} from './Web3Query.js';
import ERC20ABI from './abi/erc20.js';
let delegateContract = null;
// let factoryContract = null;
export var Web3Delegate = {
    initialize() {
        delegateContract = new Web3Provider.web3.eth.Contract(
            DelegateABI,
            Web3Provider.getDelegateAddress(),
        );
    },


    async addLiquidity(tokenA, tokenB, amountA, amountB, slip, delay, callback) {
        await Web3Caller.updateTokenInfo(tokenA);
        await Web3Caller.updateTokenInfo(tokenB);
        let deadline = Math.floor(new Date().getTime() / 1000 + 60 * delay);
        let bigAmountA = convertNormalToBigNumber(
            amountA,
            Web3Storage.getDecimal(tokenA),
        );
        let bigAmountB = convertNormalToBigNumber(
            amountB,
            Web3Storage.getDecimal(tokenB),
        );
        let minAmountA = calculateMultiplied(bigAmountA, 1 - slip);
        let minAmountB = calculateMultiplied(bigAmountB, 1 - slip);

        if (Web3Storage.isETH(tokenA) || Web3Storage.isETH(tokenB)) {
            if (Web3Storage.isETH(tokenA)) {
                Web3Caller.executeContract(
                    delegateContract,
                    'addLiquidityETH',
                    bigAmountA,
                    [tokenB, bigAmountB, minAmountB, minAmountA, deadline],
                    callback,
                );
            } else {
                Web3Caller.executeContract(
                    delegateContract,
                    'addLiquidityETH',
                    bigAmountB,
                    [tokenA, bigAmountA, minAmountA, minAmountB, deadline],
                    callback,
                );
            }
        } else {
            Web3Caller.executeContract(
                delegateContract,
                'addLiquidity',
                0,
                [
                    tokenA,
                    tokenB,
                    bigAmountA,
                    bigAmountB,
                    minAmountA,
                    minAmountB,
                    deadline,
                ],
                callback,
            );
        }
    },

    async removeLiquidity(pairAddress, percent, slip, delay, callback) {
        console.log('removeLiquidity:', pairAddress)
        let liquidity = Web3Storage.getLiquidity(pairAddress);
        await Web3Caller.updateTokenInfo(liquidity.token0);
        await Web3Caller.updateTokenInfo(liquidity.token1);
        if (liquidity.canRemove) {
            let deadline = Math.floor(new Date().getTime() / 1000 + 60 * delay);
            let removeLiquidity = calculateMultiplied(liquidity.liquidity, percent);
            let removeAmount = this.getRemoveAmount(pairAddress, percent);
            let amountA = convertNormalToBigNumber(
                removeAmount.amountA,
                Web3Storage.getDecimal(liquidity.token0),
            );
            let amountB = convertNormalToBigNumber(
                removeAmount.amountB,
                Web3Storage.getDecimal(liquidity.token1),
            );
            amountA = calculateMultiplied(amountA, 1 - slip);
            amountB = calculateMultiplied(amountB, 1 - slip);

            if((Web3Storage.isETH(liquidity.token0) && liquidity.token1 !== "0x393B312C01048b3ed2720bF1B090084C09e408A1")
            || ((Web3Storage.isETH(liquidity.token1) && liquidity.token0 !== "0x393B312C01048b3ed2720bF1B090084C09e408A1"))
            ) {
                if (Web3Storage.isETH(liquidity.token0)) {
                    Web3Caller.executeContract(
                        delegateContract,
                        'removeLiquidityETH',
                        0,
                        [
                            liquidity.token1,
                            removeLiquidity,
                            amountB,
                            amountA,
                            deadline,
                        ],
                        callback,
                    );
                } else {
                    Web3Caller.executeContract(
                        delegateContract,
                        'removeLiquidityETH',
                        0,
                        [
                            liquidity.token0,
                            removeLiquidity,
                            amountA,
                            amountB,
                            deadline,
                        ],
                        callback,
                    );
                }
            } else {
                Web3Caller.executeContract(
                    delegateContract,
                    'removeLiquidity',
                    0,
                    [
                        liquidity.token0,
                        liquidity.token1,
                        removeLiquidity,
                        amountA,
                        amountB,
                        deadline,
                    ],
                    callback,
                );
            }
        }
    },

    async getAmountLiquidity(tokenA, tokenB, amountA) {
        await Web3Query.queryReserveList([tokenA], [tokenB]);
        let reserve = Web3Storage.getReserve(tokenA, tokenB);
        // console.log('getAmountLiquidity reserve:', reserve);
        let amountB = reserve[0] > 0 ? (amountA * reserve[1]) / reserve[0] : 0;
        let APerB = reserve[1] > 0 ? reserve[0] / reserve[1] : 0;
        let BPerA = reserve[0] > 0 ? reserve[1] / reserve[0] : 0;
        let percent = reserve[0] > 0 ? amountA / (reserve[0] + amountA) : 1;
        return {
            amountB: amountB,
            APerB: APerB,
            BPerA: BPerA,
            percent: percent,
        };
    },

    getRemoveAmount(pairAddress, removePercent) {
        let liquidity = Web3Storage.getLiquidity(pairAddress);
        let amountA = parseFloat(liquidity.reserve0) * liquidity.percent * removePercent;
        let amountB = parseFloat(liquidity.reserve1) * liquidity.percent * removePercent;
        return {
            amountA: amountA,
            amountB: amountB,
        };
    },


    async queryReward(pairAddress) {
        let pairContract = new Web3Provider.web3.eth.Contract(DemaxLPABI, pairAddress);
        let result = await pairContract.methods
            .queryReward()
            .call({from: Web3Provider.currentAccount});
    },

    mintReward(pairAddress, callback) {
        let pairContract = new Web3Provider.web3.eth.Contract(DemaxLPABI, pairAddress);
        Web3Caller.executeContract(pairContract, 'mintReward', 0, [], callback);
    },

    async getAmountOut(amount, path) {
        return delegateContract.methods
            .getAmountsOut(
                convertNormalToBigNumber(amount, Web3Storage.getDecimal(path[0])),
                path,
            )
            .call();
    },

    getAvailablePaths(tokenA, tokenB) {
        let swapPath = [];

        if (Web3Storage.existPair(tokenA, tokenB)) {
            swapPath.push([tokenA, tokenB]);
        }

        let routeList = Web3Storage.getRouteList();
        for (let i = 0; i < routeList.length; i++) {
            if (
                Web3Storage.existPair(tokenA, routeList[i]) &&
                Web3Storage.existPair(routeList[i], tokenB)
            ) {
                swapPath.push([tokenA, routeList[i], tokenB]);
            }
        }

        return swapPath;
    },

    calculateAmountIn(path, amount) {
        for (let i = path.length - 1; i > 0; i--) {
            let reserve = Web3Storage.getReserve(path[i - 1], path[i]);
            if (amount > reserve[1]) {
                return -1;
            }
            amount = (amount * reserve[0]) / (reserve[1] - amount);
            amount = amount / (1 - Web3Storage.params.feePercent);
        }

        return amount;
    },

    calculateAmountOut(path, amount) {
        for (let i = 0; i < path.length - 1; i++) {
            let reserve = Web3Storage.getReserve(path[i], path[i + 1]);
            let realAmount = amount * (1 - Web3Storage.params.feePercent);
            amount = (realAmount / (realAmount + reserve[0])) * reserve[1];
        }

        return amount;
    },
};
