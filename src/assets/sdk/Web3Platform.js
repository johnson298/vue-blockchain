import {Web3Contract} from './Web3Contract.js';
import PlatformABI from './abi/demaxPlatformABI.js';
import FactoryABI from './abi/demaxFactoryABI.js';
import PairABI from './abi/demaxPairABI.js';
import DemaxLPABI from './abi/DemaxLPABI.js';
import {Web3Provider} from './Web3Provider.js';
import {Web3Storage} from './Web3Storage.js';
import {Web3Caller} from './Web3Caller.js';
import {Constant} from './Constant.js';
import Pair from './model/pair.js';
import {
    convertNormalToBigNumber,
    convertBigNumberToNormal,
    calculateMultiplied,
    minusBigNumber,
    getDeadLine,
} from './util/util.js';
import {Web3Query} from './Web3Query.js';
import ERC20ABI from './abi/erc20.js';
let platformContract = null;
// let factoryContract = null;
export var Web3Platform = {
    initialize() {
        platformContract = new Web3Provider.web3.eth.Contract(
            PlatformABI,
            Web3Provider.getPlatformAddress(),
        );
        // factoryContract = new Web3Provider.web3.eth.Contract(FactoryABI, Web3Provider.getFactoryAddress())
    },

    async swapPrecondition(token) {
        return await platformContract.methods.swapPrecondition(token).call();
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
                    platformContract,
                    'addLiquidityETH',
                    bigAmountA,
                    [tokenB, bigAmountB, minAmountB, minAmountA, deadline],
                    callback,
                );
            } else {
                Web3Caller.executeContract(
                    platformContract,
                    'addLiquidityETH',
                    bigAmountB,
                    [tokenA, bigAmountA, minAmountA, minAmountB, deadline],
                    callback,
                );
            }
        } else {
            Web3Caller.executeContract(
                platformContract,
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
                        platformContract,
                        'removeLiquidityETH',
                        0,
                        [
                            liquidity.token1,
                            removeLiquidity,
                            amountB,
                            amountA,
                            Web3Provider.currentAccount,
                            deadline,
                        ],
                        callback,
                    );
                } else {
                    Web3Caller.executeContract(
                        platformContract,
                        'removeLiquidityETH',
                        0,
                        [
                            liquidity.token0,
                            removeLiquidity,
                            amountA,
                            amountB,
                            Web3Provider.currentAccount,
                            deadline,
                        ],
                        callback,
                    );
                }
            } else {
                Web3Caller.executeContract(
                    platformContract,
                    'removeLiquidity',
                    0,
                    [
                        liquidity.token0,
                        liquidity.token1,
                        removeLiquidity,
                        amountA,
                        amountB,
                        Web3Provider.currentAccount,
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

    async swapIn(tokenA, tokenB, amountOut, slip, delay, callback) {
        await Web3Caller.updateTokenInfo(tokenA);
        await Web3Caller.updateTokenInfo(tokenB);
        let swapInfo = await this.getSwapInInfo(tokenA, tokenB, amountOut, slip);

        if (swapInfo) {
            let path = swapInfo.path;
            let length = path.length;
            let result;
            let bigAmountOut = convertNormalToBigNumber(
                amountOut,
                Web3Storage.getDecimal(tokenB),
            );
            let bigMaxAmountIn = convertNormalToBigNumber(
                swapInfo.maxAmountIn,
                Web3Storage.getDecimal(tokenA),
            );

            console.log(
                'execute swap in',
                tokenA,
                tokenB,
                amountOut,
                slip,
                delay,
                swapInfo,
                bigAmountOut,
                bigMaxAmountIn,
            );
            if (Web3Storage.isETH(path[0])) {
                Web3Caller.executeContract(
                    platformContract,
                    'swapETHForExactTokens',
                    bigMaxAmountIn,
                    [bigAmountOut, path, Web3Provider.currentAccount, getDeadLine(delay)],
                    callback,
                );
            } else if (Web3Storage.isETH(path[length - 1])) {
                Web3Caller.executeContract(
                    platformContract,
                    'swapTokensForExactETH',
                    0,
                    [
                        bigAmountOut,
                        bigMaxAmountIn,
                        path,
                        Web3Provider.currentAccount,
                        getDeadLine(delay),
                    ],
                    callback,
                );
            } else {
                Web3Caller.executeContract(
                    platformContract,
                    'swapTokensForExactTokens',
                    0,
                    [
                        bigAmountOut,
                        bigMaxAmountIn,
                        path,
                        Web3Provider.currentAccount,
                        getDeadLine(delay),
                    ],
                    callback,
                );
            }
        }
    },

    async swapOut(tokenA, tokenB, amountIn, slip, delay, callback) {
        await Web3Caller.updateTokenInfo(tokenA);
        await Web3Caller.updateTokenInfo(tokenB);
        let swapInfo = await this.getSwapOutInfo(tokenA, tokenB, amountIn, slip);
        // console.log('execute swap out', tokenA, tokenB, amountIn, slip, delay, swapInfo);
        if (swapInfo) {
            let path = swapInfo.path;
            let length = path.length;
            let result;
            let bigAmountIn = convertNormalToBigNumber(
                amountIn,
                Web3Storage.getDecimal(tokenA),
            );
            let bigMinAmountOut = convertNormalToBigNumber(
                swapInfo.minAmountOut,
                Web3Storage.getDecimal(tokenB),
            );

            if (Web3Storage.isETH(path[0])) {
                Web3Caller.executeContract(
                    platformContract,
                    'swapExactETHForTokens',
                    bigAmountIn,
                    [
                        bigMinAmountOut,
                        path,
                        Web3Provider.currentAccount,
                        getDeadLine(delay),
                    ],
                    callback,
                );
            } else if (Web3Storage.isETH(path[length - 1])) {
                Web3Caller.executeContract(
                    platformContract,
                    'swapExactTokensForETH',
                    0,
                    [
                        bigAmountIn,
                        bigMinAmountOut,
                        path,
                        Web3Provider.currentAccount,
                        getDeadLine(delay),
                    ],
                    callback,
                );
            } else {
                Web3Caller.executeContract(
                    platformContract,
                    'swapExactTokensForTokens',
                    0,
                    [
                        bigAmountIn,
                        bigMinAmountOut,
                        path,
                        Web3Provider.currentAccount,
                        getDeadLine(delay),
                    ],
                    callback,
                );
            }
        }
    },

    async checkCondition(tokenA, tokenB) {
        let result = await Web3Query.queryCondition([tokenA, tokenB]);
        if (parseInt(result) !== 0) {
            return result;
        }
        let allPair = Web3Storage.generateAllPair(tokenA, tokenB);
        let token0_list = allPair.map(a => a[0]);
        let token1_list = allPair.map(a => a[1]);
        await Web3Query.queryReserveList(token0_list, token1_list);

        return this.getAvailablePaths(tokenA, tokenB).length > 0 ? 0 : 3;
    },

    getSwapInInfo(tokenA, tokenB, amountOut, slip) {
        let swapPath = this.getAvailablePaths(tokenA, tokenB);

        if (swapPath.length > 0) {
            let path = swapPath[0];
            let amountIn = this.calculateAmountIn(swapPath[0], amountOut);
            for (let i = 1; i < swapPath.length; i++) {
                let currentAmountIn = this.calculateAmountIn(swapPath[i], amountOut);
                if (currentAmountIn < amountIn) {
                    amountIn = currentAmountIn;
                    path = swapPath[i];
                }
                // console.log(i, swapPath[i], currentAmountIn);
            }

            if (amountIn < 0) {
                return {
                    canSwap: 0,
                };
            } else {
                let length = path.length;
                let reserve = Web3Storage.getReserve(path[length - 2], path[length - 1]);
                let reserve0 = Web3Storage.getReserve(path[0], path[1]);
                let percent = Math.max(amountIn / reserve0[0], amountOut / reserve[1]);
                return {
                    canSwap: 1,
                    amountIn: amountIn,
                    APerB: amountIn / amountOut,
                    BPerA: amountOut / amountIn,
                    percent: percent,
                    maxAmountIn: amountIn * (1 + slip),
                    path: path,
                };
            }
        }
    },

    getSwapOutInfo(tokenA, tokenB, amountIn, slip) {
        let swapPath = this.getAvailablePaths(tokenA, tokenB);

        if (swapPath.length > 0) {
            let path = swapPath[0];
            let amountOut = this.calculateAmountOut(swapPath[0], amountIn);
            for (let i = 1; i < swapPath.length; i++) {
                let currentAmountOut = this.calculateAmountOut(swapPath[i], amountIn);
                if (currentAmountOut > amountOut) {
                    amountOut = currentAmountOut;
                    path = swapPath[i];
                }
                // console.log(i, swapPath[i], currentAmountOut);
            }

            let length = path.length;
            let reserve = Web3Storage.getReserve(path[length - 2], path[length - 1]);
            let reserve0 = Web3Storage.getReserve(path[0], path[1]);
            let percent = Math.max(amountIn / reserve0[0], amountOut / reserve[1]);


            return {
                canSwap: 1,
                amountOut: amountOut,
                APerB: amountIn / amountOut,
                BPerA: amountOut / amountIn,
                percent: percent,
                minAmountOut: amountOut * (1 - slip),
                path: path,
            };
        }
    },

    async queryPairInfo(tokenA, tokenB) {
        await Web3Caller.updateTokenInfo(tokenA);
        await Web3Caller.updateTokenInfo(tokenB);
        let exist = await platformContract.methods.existPair(tokenA, tokenB).call();
        let reserveA = 0;
        let reserveB = 0;
        let pair = new Pair(tokenA, tokenB, reserveA, reserveB, exist);
        if (exist) {
            let reserve = await platformContract.methods
                .getReserves(tokenA, tokenB)
                .call();

            // pair.address = await platformContract.methods.pairFor(tokenA, tokenB).call();
            //
            // let pairContract = new Web3Provider.web3.eth.Contract(PairABI, pair.address);
            // console.log("pair contract:", await pairContract.methods.totalSupply().call(), pair.address);
            //
            // let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, Web3Storage.getDGASAddress());
            // let balance = await tokenContract.methods.balanceOf(pair.address).call();
            // console.log("dgas token balance", balance);
            // console.log('reserve', reserve);
            pair.reserveA = parseFloat(
                convertBigNumberToNormal(reserve[0], Web3Storage.getDecimal(tokenA)),
            );
            pair.reserveB = parseFloat(
                convertBigNumberToNormal(reserve[1], Web3Storage.getDecimal(tokenB)),
            );
            // pair.address = await factoryContract.methods.getPair(tokenA, tokenB).call();
            Web3Storage.addPair(tokenA, tokenB, pair);
        }

        return pair;
    },

    async queryReward(pairAddress) {
        console.log('queryReward:', pairAddress)
        let pairContract = new Web3Provider.web3.eth.Contract(PairABI, pairAddress);
        let result = await pairContract.methods
            .queryReward()
            .call({from: Web3Provider.currentAccount});

        console.log('queryReward res:', result)

        Web3Storage.setLiquidityReward(
            pairAddress,
            parseFloat(convertBigNumberToNormal(result[0])),
            parseInt(result[1]),
        );
    },

    async query2Reward(pairAddress) {
        // console.log('query2Reward:', pairAddress)
        let pairContract = new Web3Provider.web3.eth.Contract(DemaxLPABI, pairAddress);
        let result = await pairContract.methods
            .queryReward()
            .call({from: Web3Provider.currentAccount});

        // console.log('query2Reward res:', result)

        Web3Storage.setLiquidityReward(
            pairAddress,
            parseFloat(convertBigNumberToNormal(result)),
            0,
        );
    },

    mintReward(pairAddress, callback) {
        let pairContract = new Web3Provider.web3.eth.Contract(PairABI, pairAddress);
        Web3Caller.executeContract(pairContract, 'mintReward', 0, [], callback);
    },

    async getAmountOut(amount, path) {
        return platformContract.methods
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
