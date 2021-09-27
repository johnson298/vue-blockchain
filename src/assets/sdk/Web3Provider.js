import { Constant } from './Constant.js';
import { convertBigNumberToNormal, convertNormalToBigNumber } from './util/util.js';
import { Web3Query } from './Web3Query.js';
import { Web3Query2 } from './Web3Query2.js';
import { Web3Query2Beta } from './Web3Query2Beta.js';
import { Web3QueryV1 } from './Web3QueryV1.js';
import { Web3Caller } from './Web3Caller.js';
import { Web3Platform } from './Web3Platform.js';
import { Web3Delegate } from './Web3Delegate.js';
import { Web3DelegateBeta } from './Web3DelegateBeta.js';
import { Web3Governance } from './Web3Governance.js';
import { Web3ETHBurgerTransit } from './Web3ETHBurgerTransit.js';
import { Web3BSCBurgerTransit } from './Web3BSCBurgerTransit.js';
import { Web3TokenQuery } from './Web3TokenQuery.js';
import { Web3Pool } from './Web3Pool.js';
import { Web3Convert } from './Web3Convert.js';
import { Web3Bounce } from './Web3Bounce.js';
import ERC20ABI from './abi/erc20.js';
import Web3 from "web3"
import { NoFragmentCyclesRule } from 'graphql';


let web3Provider = null;
export var Web3Provider = {
    connectCallback: null,
    connected: false,
    currentWallet: '',
    currentAccount: '',
    currentChainId: '',
    currentBalance: '',
    web3: null,

    handleCallback(type, data) {
        if (this.connectCallback) {
            this.connectCallback(type, data);
        }
    },

    newConnect(web3, walletType = Constant.WalletType.MetaMask) {
        web3Provider = this;
        web3Provider.web3 = web3;
        this.currentWallet = walletType;
    },

    connect: function (walletType, callback) {
        web3Provider = this;
        if (walletType === Constant.WalletType.MetaMask) {
            console.log('connect new ethereum')
            web3Provider.web3 = new Web3(window['ethereum']);
            this.currentWallet = Constant.WalletType.MetaMask;
            this.connectMetaMask();
        } else if (walletType === Constant.WalletType.BinanceWallet) {
            console.log('connect new BinanceChain')
            web3Provider.web3 = new Web3(window['BinanceChain']);
            this.currentWallet = Constant.WalletType.BinanceWallet;
            this.connectBinanceWallet();
        }

        this.connectCallback = callback;
    },

    async initialize() {
        console.log('initialize, web3:', web3Provider.web3);
        web3Provider.currentChainId = await web3Provider.web3.eth.getChainId();
        // console.log('initialize chainid:', web3Provider.currentChainId);
        const accounts = await web3Provider.web3.eth.getAccounts();
        // console.log(accounts,'accounts');
        web3Provider.currentAccount = web3Provider.web3.utils.toChecksumAddress(
            (await web3Provider.web3.eth.getAccounts())[0],
        );
        // console.log(web3Provider.currentAccount, web3Provider.currentChainId);

        // eth
        // console.log('is eth net:', web3Provider.isEthNet());
        if (web3Provider.isEthNet() === false) {
            Web3Platform.initialize();
            Web3Governance.initialize();
            Web3Pool.initialize();
        }
        Web3Caller.initialize();
        Web3Query.initialize();
        Web3Query2.initialize();
        Web3Query2Beta.initialize();
        Web3QueryV1.initialize();
        Web3ETHBurgerTransit.initialize();
        Web3BSCBurgerTransit.initialize();
        Web3TokenQuery.initialize();
        Web3Convert.initialize();
        Web3Bounce.initialize();
        Web3Delegate.initialize();
        Web3DelegateBeta.initialize();

        return web3Provider.currentChainId;
    },

    connectMetaMask() {
        if (!window.ethereum) {
            this.handleCallback(Constant.ConnectType.NotInstall);
        } else if (!window.ethereum.isConnected()) {
            console.log('ethereum isConnected');
            this.handleCallback(Constant.ConnectType.NotLogin);
        } else {
            console.log('ethereum Connected');
            window.ethereum.on('accountsChanged', accounts => {
                web3Provider.currentAccount = web3Provider.web3.utils.toChecksumAddress(
                    accounts[0],
                );
                web3Provider.handleCallback(Constant.ConnectType.AccountChange, {
                    account: web3Provider.currentAccount,
                });
            });

            window.ethereum.on('chainChanged', async chainId => {
                // web3Provider.currentChainId = chainId;
                await web3Provider.initialize();
                console.log(chainId, 'chainChanged');
                web3Provider.handleCallback(Constant.ConnectType.ChainChanged, chainId);
            });

            // window.ethereum.on('connect', (connectInfo) => {
            //     console.log(connectInfo);
            // });
            //
            window.ethereum.enable().then(_ => {
                web3Provider.handleCallback(Constant.ConnectType.ConnectSuccess, null);
            });
            // window.ethereum.request({ method: 'eth_requestAccounts' }).then(
            //     _ => {
            //         web3Provider.handleCallback(Constant.ConnectType.ConnectSuccess, null);
            //     }
            // );
            // window.ethereum.enable()
        }
    },

    connectBinanceWallet() {
        if (!window.BinanceChain) {
            console.log('window.BinanceChain is not found');
            this.handleCallback(Constant.ConnectType.NotInstall);
        } else if (!window.BinanceChain.on) {
            console.log('window.BinanceChain is not connect');
            this.handleCallback(Constant.ConnectType.NotLogin);
        } else {
            console.log('window.BinanceChain is connected');
            window.BinanceChain.on('accountsChanged', accounts => {
                web3Provider.currentAccount = web3Provider.web3.utils.toChecksumAddress(
                    accounts[0],
                );
                web3Provider.handleCallback(Constant.ConnectType.AccountChange, {
                    account: web3Provider.currentAccount,
                });
                console.log('window.BinanceChain currentAccount:', web3Provider.currentAccount);
            });

            window.BinanceChain.on('chainChanged', async chainId => {
                // web3Provider.currentChainId = chainId;
                await web3Provider.initialize();
                console.log(chainId, 'chainChanged');
                web3Provider.handleCallback(Constant.ConnectType.ChainChanged, chainId);
            });

            // window.ethereum.on('connect', (connectInfo) => {
            //     console.log(connectInfo);
            // });
            //
            window.BinanceChain.enable().then(_ => {
                web3Provider.handleCallback(Constant.ConnectType.ConnectSuccess, null);
            });
            // window.ethereum.request({ method: 'eth_requestAccounts' }).then(
            //     _ => {
            //         web3Provider.handleCallback(Constant.ConnectType.ConnectSuccess, null);
            //     }
            // );
            // window.ethereum.enable()
        }
    },

    async getBalance() {
        if (!this.currentAccount) {
            return 0;
        }
        let result = await web3Provider.web3.eth.getBalance(this.currentAccount);
        // console.log('result', result);
        web3Provider.currentBalance = convertBigNumberToNormal(result);
        // console.log(web3Provider.currentBalance,'web3Provider.currentBalance');
        return web3Provider.currentBalance;
    },

    getChainName() {
        return Constant.ChainDic[parseInt(web3Provider.currentChainId)];
    },

    getChainBrowser() {
        return Constant.ChainBrowser[parseInt(web3Provider.currentChainId)];
    },

    isMainNet() {
        return web3Provider.currentChainId === 1;
    },

    isEthNet(chainId = web3Provider.currentChainId) {
        return [1, 3, 42].includes(parseInt(chainId))
    },

    isBscNet(chainId = web3Provider.currentChainId) {
        return [56, 97].includes(parseInt(chainId))
    },

    get0Address() {
        return "0x0000000000000000000000000000000000000000"
    },

    getPairAddress(name) {
        return Constant.PairAddress[Web3Provider.currentChainId][name];
    },

    getTokenAddress(name) {
        return Constant.TokenAddress[Web3Provider.currentChainId][name];
    },
    
    getContractAddress(id) {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxQuery;
    },

    getPlatformAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxPlatform;
    },

    getFactoryAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxFactory;
    },

    getGovernanceAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxGovernance;
    },

    getQueryAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxQuery;
    },

    getQuery2Address() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxQuery2;
    },

    getQuery2BetaAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxQuery2_beta;
    },

    getQueryV1Address() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxQueryV1;
    },

    getConfigAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxConfig;
    },

    getWETHAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].WETH;
    },

    isWethAddress(address) {
        return address.toLocaleLowerCase() == Web3Provider.getWETHAddress().toLocaleLowerCase();
    },

    getDGASAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DGAS;
    },
    isDGASAddress(address) {
        return address.toLocaleLowerCase() == Web3Provider.getDGASAddress().toLocaleLowerCase();
    },
    getUSDTAddress() {
        return Web3Provider.getTokenAddress('USDT');
    },
    getHUSDAddress() {
        return Web3Provider.getTokenAddress('HUSD');
    },
    getZeroSymbol() {
        return Constant.ZeroToken[Web3Provider.currentChainId]
    },

    getETHBurgerTransitAddress() {
        // console.log('getETHBurgerTransitAddress currentChainId:', Web3Provider.currentChainId+'.')
        return Constant.ContractAddress[Web3Provider.currentChainId].ETHBurgerTransit;
    },

    getBscBurgerTransitAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].BSCBurgerTransit;
    },

    getTokenQueryAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].TokenQuery;
    },

    getPoolAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxPool;
    },

    getConvertAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxConvert;
    },

    getBounceAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].Bounce;
    },

    getDelegateAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxDelegate;
    },

    getDelegateBetaAddress() {
        return Constant.ContractAddress[Web3Provider.currentChainId].DemaxDelegate_beta;
    },

    getCurrentBlock() {
        return Web3Provider.web3.eth.getBlockNumber();
    },

    toByte32(str) {
        return Web3Provider.web3.utils.fromAscii(str);
    },

    fromByte32(byte32) {
        return Web3Provider.web3.utils.hexToUtf8(byte32);
    },

    async getTokenInfo(token, user, spender = '') {
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, token);
        let balance = await tokenContract.methods.balanceOf(user).call();
        let allowance = 0;
        if (spender !== '') {
            allowance = await tokenContract.methods.allowance(user, spender).call();
        }
        let totalSupply = await tokenContract.methods.totalSupply().call();
        let decimals = await tokenContract.methods.decimals().call();
        let symbol = await tokenContract.methods.symbol().call();
        let name = await tokenContract.methods.name().call();
        return {
            balance: convertBigNumberToNormal(balance, decimals),
            allowance: convertBigNumberToNormal(allowance, decimals),
            totalSupply: totalSupply,
            decimals: decimals,
            symbol: symbol,
            name: name,
        };
    },

    async approveToken(spender, token_address, amount, decimals, callback) {
        console.log(
            spender,
            token_address,
            amount,
            decimals,
            // callback,
            'spender, token_address, amount, decimals, callback',
        );
        let tokenContract = new Web3Provider.web3.eth.Contract(ERC20ABI, token_address);
        let bigAmount = convertNormalToBigNumber(amount, decimals);
        // console.log(bigAmount);
        Web3Caller.executeContract(
            tokenContract,
            'approve',
            0,
            [spender, bigAmount],
            callback,
        );
    },
    getOpenApiUrl() {
        let url = "https://openapi.burgerswap.org";
        if (
            Web3Provider.currentChainId &&
            Constant.OpenApiUrl[Web3Provider.currentChainId]
        ) {
            url = Constant.OpenApiUrl[Web3Provider.currentChainId];
        }
        return url;
    },
};
