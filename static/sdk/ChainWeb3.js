import Web3 from "web3"
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import web3Util from './Web3Util.js'
import { CHAIN_RPC, CHAIN_BROWSER, CHAIN_NAME, ContractsAddr, ChainSymbol } from './ChainConfig.js'
import {Constant} from '../../src/assets/sdk/Constant';

function transactionReceiptAsync(web3, hash, resolve, reject) {
    web3.eth.getTransactionReceipt(hash).then(receipt => {
        if (!receipt) {
            setTimeout(function () {
                transactionReceiptAsync(web3, hash, resolve, reject)
            }, 1000);
        } else {
            if (receipt && !receipt.status) {
                reject(receipt)
            } else {
                resolve(receipt)
            }
        }
    }).catch(reject)
}

let chainStatusHandles = [];
let accountsHandles = [];
let chainHandles = [];
let apiModules = [];
let accounts = [];
let tokens = [];
class ChainWeb3 {
    constructor() {
        this.tryCount = 0;
        this.chainInstalled = false;
        this.connector = null;
        this.ethereum = null;
        this.ZERO_ADDR = '0x0000000000000000000000000000000000000000';
        this.account = '';
        this.chainId = 0;
        this.tokens = tokens;
        this.web3 = null;
        this.web3Util = web3Util;
    }

    async setupNetwork(chainId) {
        const provider = this.ethereum
        if (provider) {
            if(chainId) {
                chainId = Number(chainId)
            } else if(process.env.VUE_APP_CHAIN_ID) {
                chainId = Number(process.env.VUE_APP_CHAIN_ID)
            } else {
                return true
            }
            const REACT_APP_NODE_1 = "https://bsc-dataseed1.ninicoin.io"

            const REACT_APP_NODE_2 = "https://bsc-dataseed1.defibit.io"

            const REACT_APP_NODE_3 = "https://bsc-dataseed.binance.org"
            const nodes = [REACT_APP_NODE_1, REACT_APP_NODE_2, REACT_APP_NODE_3]

            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${chainId.toString(16)}`,
                            chainName: CHAIN_NAME[chainId],
                            nativeCurrency: {
                                name: ChainSymbol.ZeroToken[chainId],
                                symbol: ChainSymbol.ZeroToken[chainId].toLowerCase(),
                                decimals: 18,
                            },
                            rpcUrls: nodes,
                            blockExplorerUrls: [CHAIN_BROWSER[chainId]],
                        },
                    ],
                })
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        } else {
            console.error("Can't setup the Block network on metamask because window.ethereum is undefined")
            return false
        }
    }

    setSession(key, val) {
        if (val !== undefined) {
            sessionStorage.setItem(key, val);
        }
    }

    getSession(key) {
        return sessionStorage.getItem(key);
    }

    handleChainStatus(status) {
        console.log('handleChainStatus:', status)
        for (const cb of chainStatusHandles) {
            cb(status)
        }
    }

    registerModule(module) {
        apiModules.push(module);
    }

    handleModules() {
        for (let module of apiModules) {
            module.initialize();
        }
    }

    handleNewChain(chainId) {
        console.log('handleNewChain:', chainId)
        if (!chainId) {
            return
        }
        let cid = Number(chainId)
        console.log('handleNewChain id:', cid)
        this.setupNetwork().then(res => {
            if(res){
                this.chainId = cid
                for (const cb of chainHandles) {
                    cb(chainId)
                }
            }
        })
    }

    walletConnectInit() {
        const bridge = "https://bridge.walletconnect.org";
        this.connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
        // check if already connected
        let newAccounts = []
        if (!this.connector.connected) {
            console.log('walletConnectInit connect...');
            // create new session
            this.connector.createSession()
            // Subscribe to connection events
            this.connector.on("connect", (error, payload) => {
                console.log(`this.connector.on("connect")`);
                console.log(JSON.stringify(payload));
                const { accounts, chainId } = payload.params[0];
                newAccounts = accounts
                this.handleNewAccounts(accounts)
                this.handleNewChain(chainId)
                this.handleChainStatus(true)
            })
            // this.handleNewAccounts(newAccounts)
            this.connector.on("session_update", (error, payload) => {
                const { accounts, chainId } = payload.params[0];
                console.log('walletConnectInit session_update:', accounts);
                this.handleNewAccounts(accounts)
                this.handleNewChain(chainId)
            });
            this.connector.on("disconnect", (error, payload) => {
                console.log(`this.connector.on("disconnect")`);
                console.log('walletConnectInit disconnect');
                this.handleNewAccounts([])
            });
        } else {
            newAccounts = this.connector.accounts
            console.log('walletConnectInit connected:', newAccounts);
            this.handleNewAccounts(newAccounts)
            this.handleChainStatus(true)

        }

        console.log('walletConnectInit account:', newAccounts)
        return newAccounts
    }

    connectMetamask() {
        if (!window.ethereum) {
            console.log('not found Metamask')
            if (this.tryCount < 1) {
                setTimeout(() => {
                    this.connectMetamask()
                    this.tryCount++
                }, 2000)
            }
            else {
                console.log('not found Metamask, timeout')
                this.handleChainStatus(false)
            }
        } else {
            this.ethereum = window.ethereum
            this.chainConnected()
        }
    }

    connectBinance() {
        if (!window.BinanceChain) {
            console.log('not found Binance')
            if (this.tryCount < 1) {
                setTimeout(() => {
                    this.connectBinance()
                    this.tryCount++
                }, 2000)
            }
            else {
                console.log('not found Binance, timeout')
                this.handleChainStatus(false)
            }
        } else {
            this.ethereum = window.BinanceChain
            this.chainConnected()
        }
    }

    chainConnected() {
        console.log('chain connected...')
        this.chainInstalled = true
        console.log('ethereum:', this.ethereum)
        console.log('ethereum chainId:', this.ethereum.chainId)
        this.web3 = new Web3(this.ethereum)

        this.ethereum.autoRefreshOnNetworkChange = false
        if(navigator.userAgent.indexOf('BitKeep') == -1) {
            this.ethereum.on('chainChanged', this.handleNewChain)
            this.ethereum.on('accountsChanged', this.handleNewAccounts)
        }

        this.handleChainStatus(true)
        console.log('this.chainInstalled:', this.chainInstalled)
        console.log('this.ethereum:', this.ethereum)

        console.log('chainClient:', this.getSession('chainClient'))


        if(this.ethereum.chainId) {
            console.log('ethereum chainid', this.ethereum.chainId)
            this.handleNewChain(this.ethereum.chainId)
            this.handleModules()
        } else {
            this.web3.eth.getChainId().then((chainId)=>{
                console.log('web chainid', chainId)
                this.handleNewChain(chainId)
                this.handleModules()
            }).catch(e=>{
                console.log('web3 chainid except:',e)
            })
        }
    }

    handleNewAccounts(newAccounts) {
        console.log('handleNewAccounts:', newAccounts, accountsHandles)
        accounts = newAccounts
        if (newAccounts && newAccounts.length > 0) {
            this.account = newAccounts[0]
        } else {
            this.account = ''
        }
        for (const cb of accountsHandles) {
            cb(newAccounts)
        }
    }

    connectChain = (to = '') => {
        this.tryCount = 0
        if (!to) {
            to = this.getSession('chainClient')
            if (!to) {
                to = 'm'
            }
        }
        console.log('connectChain:', to)
        this.setSession('chainClient', to)
        if (to == 'b') {
            this.connectBinance()
        } else if (to == 'm') {
            this.connectMetamask()
        } else if (to == 'w') {
            this.walletConnectInit()
        }
    }

    connect = (to = '') => {
        console.log('ChainWeb3 ...')
        if (!to) {
            to = this.getSession('chainClient')
            if (!to) {
                to = 'm'
            }
        }
        if (this.isConnected()) {
            console.log('ChainWeb3 isConnected')
            return Promise.resolve(accounts)
        }
        console.log('ChainWeb3 connect to:', to)
        this.setSession('chainClient', to)
        this.tryCount = 0
        if (to === 'm') {
            this.connectMetamask()
            if (!this.chainInstalled) {
                console.log('No Provider!')
                return Promise.reject('No Provider!')
            }
        } else if (to === 'b') {
            this.connectBinance()
            if (!this.chainInstalled) {
                console.log('No Provider!')
                return Promise.reject('No Provider!')
            }
        } else if (to === 'w') {
            return Promise.resolve(this.walletConnectInit())
        }

        if (this.chainInstalled) {
            console.log('connect...')
            return this.ethereum.request({
                method: 'eth_requestAccounts',
            }).then(newAccounts => {
                console.log('connect accounts', newAccounts)
                this.handleNewAccounts(newAccounts)
                return newAccounts
            })
        }

    }

    disconnect() {
        if (this.connector && this.connector.connected) {
            console.log('disconnect this.connector')
            this.connector.killSession()
        }
        this.chainInstalled = false
        this.handleNewAccounts([])
    }

    handleEventLog(abi, receipt, contractName, eventName) {
        if (!receipt) {
            console.warn('handleEventLog receipt is null ', contractName, eventName)
            return
        }
        let result = web3Util.parseEventLog(this.web3, abi, receipt, eventName)
        // console.log('handleEventLog:', contractName, eventName, result)
        let hash = result.hash
        let type = contractName.toLocaleUpperCase() + '_' + eventName.toLocaleUpperCase()
        let tableName = this.chainId + this.getSelectedAddress();
        const item = { hash: hash, time: new Date().getTime(), type: type, data: result.data, address: result.address };
        // console.log('handleEventLog item:', item)
        const local = localStorage.getItem(tableName);
        if (local) {
            const list = JSON.parse(local);
            list.unshift(item);
            localStorage.setItem(tableName, JSON.stringify(list));
        } else {
            const list = [];
            list.unshift(item);
            localStorage.setItem(tableName, JSON.stringify(list));
        }
    }

    onChainStatus(handleChainStatus) {
        chainStatusHandles.push(handleChainStatus)
    }

    onAccountsChanged(handleNewAccounts) {
        console.log('onAccountsChanged:', accountsHandles)
        accountsHandles.push(handleNewAccounts)
    }

    onChainChanged(handleChain) {
        chainHandles.push(handleChain)
    }

    on(event, handler) {
        this.ethereum.on(event, handler)
    }

    getAccounts() {
        console.log('getAccounts')
        if (accounts.length > 0) {
            return Promise.resolve(accounts)
        }
        if (this.connector && this.connector.connected) {
            return Promise.resolve(this.connector.accounts)
        }
        if (this.chainInstalled) {
            return this.ethereum.request({
                method: 'eth_accounts',
            })
        }
        return Promise.resolve([])
    }

    isChainConnected() {
        console.log('isChainConnected')
        if (this.connector && this.connector.connected) {
            return true
        }
        if (window.ethereum) {
            this.chainInstalled = true
            return true
        }
        this.chainInstalled = false
        return false
    }

    isConnected() {
        console.log('isConnected')
        if (this.connector && this.connector.connected) {
            return true
        }
        if (!this.chainInstalled) {
            return false
        }
        return accounts.length > 0
    }

    getEtherscanAddress(address) {
        address = address || accounts[0]
        return CHAIN_BROWSER[this.getNetworkVersion()] + "/address/" + address
    }

    getEtherscanTx(tx) {
        return CHAIN_BROWSER[this.getNetworkVersion()] + "/tx/" + tx
    }

    awaitTransactionMined(hash) {
        let web3 = this.getWeb3();
        return new Promise(function (resolve, reject) {
            transactionReceiptAsync(web3, hash, resolve, reject)
        })
    }

    getWeb3(force = false) {
        if (!this.web3 || force) {
            console.log('new web3')
            this.web3 = new Web3(CHAIN_RPC[this.getNetworkVersion()])
            this.handleModules()
        }
        return this.web3
    }

    getSelectedAddress() {
        if (accounts.length > 0) {
            return accounts[0]
        } else if (this.connector && this.connector.connected && this.connector.accounts.length > 0) {
            return this.connector.accounts[0]
        } else if (this.ethereum) {
            return this.ethereum.selectedAddress
        }
        console.log('this.getSelectedAddress is null')
        return ''
    }

    getContract(abi, address) {
        if (!abi || !address) {
            throw ('Illegal getContract address:', address);
        }
        const web3 = this.getWeb3()
        return new web3.eth.Contract(abi, address)
    }

    getNetworkVersion() {
        let version = 0 // unknown
        if (this.connector && this.connector.connected) {
            // console.log('this.connector chainId:', this.connector.chainId)
            version = this.connector.chainId
        } else if (this.chainInstalled) {
            version = Number(this.ethereum.chainId)
        }
        // console.log('getNetworkVersion:', version)
        return version
    }

    sendTransaction(params) {
        if (this.connector && this.connector.connected) {
            console.log('sendTransaction this.connector params:', params)
            return this.connector.sendTransaction(params[0])
        }
        console.log('sendTransaction params:', params)
        return this.ethereum
            .request({
                method: 'eth_sendTransaction',
                params,
            })
    }

    async executeContract(contract, methodName, value, params) {
        console.log('executeContract:', methodName, value, params)
        if (!value) {
            value = 0
        }
        value = web3Util.numberToHex(value)
        const transParams = {
            from: this.getSelectedAddress(),
            value: value,
        };
        if(contract) {
            transParams['to'] = contract._address
            transParams['data'] = contract.methods[methodName](...params).encodeABI()
        }
        return await this.sendTransaction([transParams])
    }

    async executeContractWithAsync(contract, methodName, value, params) {
        let hash = this.executeContract(contract, methodName, value, params)
        return this.awaitTransactionMined(hash)
    }


    getContractMethods(abi, address) {
        const web3 = this.getWeb3()
        return new web3.eth.Contract(abi, address).methods
    }

    getContractAddr(name) {
        return Constant.ContractAddress[this.getNetworkVersion()][name]
    }

    getZeroSymbol() {
        return ChainSymbol.ZeroToken[this.getNetworkVersion()]
    }

    getWSymbol() {
        return ChainSymbol.WToken[this.getNetworkVersion()]
    }

    isZeorAddress(addr) {
        return addr == this.ZERO_ADDR;
    }

    async getBlockNumber() {
        return await this.web3.eth.getBlockNumber()
    }

}

var chainWeb3 = new ChainWeb3()

export default chainWeb3
