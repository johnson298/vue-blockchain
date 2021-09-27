
import Web3 from "web3"
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import BigNumber from "bignumber.js"
import Web3Util from './Web3Util.js'

import ERC20TokenABI from './abi/ERC20Token.json'
import AAAAPoolABI from './abi/AAAAPool.json'
import AAAAFactoryABI from './abi/AAAAFactory.json'
import AAAAPlatformABI from './abi/AAAAPlatform.json'
import AAAAMintABI from './abi/AAAAMint.json'
import AAAAQueryABI from './abi/AAAAQuery.json'
import AAAAQuery2ABI from './abi/AAAAQuery2.json'
import AAAAQuery3ABI from './abi/AAAAQuery3.json'
import AAAAConfigABI from './abi/AAAAConfig.json'
import AAAAShareABI from './abi/AAAAShare.json'
import AAAARewardABI from './abi/AAAAReward.json'
import AAAAGovernanceABI from './abi/AAAAGovernance.json'
import AAAABallotABI from './abi/AAAABallot.json'
import SLPStrategyABI from './abi/SLPStrategy.json'
import IFOABI from './abi/IFO.json'
import IFOFactoryABI from './abi/IFOFactory.json'
import IFOQueryABI from './abi/IFOQuery.json'
import IFOQuery2ABI from './abi/IFOQuery2.json'
import DemaxFactoryABI from './abi/DemaxFactory.json'
import DemaxProjectDeployABI from './abi/DemaxProjectDeploy.json'
import DemaxProjectQueryABI from './abi/DemaxProjectQuery.json'
import DemaxProjectFactoryABI from './abi/DemaxProjectFactory.json'
import DemaxProjectPoolABI from './abi/DemaxProjectPool.json'
import DemaxShackChefABI from './abi/DemaxShackChef.json'
import DemaxShackFarmABI from './abi/DemaxShackFarm.json'
import UniswapV2FactoryABI from './abi/UniswapV2Factory.json'
import DemaxShackChefQueryABI from './abi/DemaxShackChefQuery.json'
import DemaxLPABI from './abi/DemaxLP.json'
import chainWeb3 from './ChainWeb3.js'
import {CHAIN_RPC, CHAIN_BROWSER, Tokens, ShackPools, ShackFarmPools, ContractsAddr, ChainSymbol, BALLOT_BYTECODE, IPFS_URL, IPFS_IFO} from './ChainConfig.js'
import { data } from "autoprefixer";
import {ProjectCoin} from '@/assets/js/coin';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import {Constant} from '../../src/assets/sdk/Constant';
import {Web3Provider} from '/src/assets/sdk/Web3Provider'
import $http from 'axios';
import ERC20Token from './model/ERC20Token.js'
import DemaxPricePrediction from './model/DemaxPricePrediction.js'
import DemaxPricePredictionQuery from './model/DemaxPricePredictionQuery.js'
import SimpleAggregatorV3 from './model/SimpleAggregatorV3.js'
import DemaxClaim from './model/DemaxClaim.js'
import IfoFun from '/src/assets/images/ifo/ifo-fun.png';
import IfoArts from '/src/assets/images/ifo/ifo-arts.png';


var _InstancesCache = {}
function _getInstance(name, address) {
  if(_InstancesCache.hasOwnProperty(name+address.toLocaleLowerCase())) {
    return _InstancesCache[name+address.toLocaleLowerCase()];
  }
  return null;
}

function _setInstance(name, address, ins) {
  console.log('_setInstance:', name, address);
  _InstancesCache[name+address.toLocaleLowerCase()] = ins;
}

function DemaxPricePredictionIns(address) {
  let ins = _getInstance('DemaxPricePrediction', address);
  if(!ins) {
    ins = new DemaxPricePrediction(chainWeb3, address);
    _setInstance('DemaxPricePrediction', address, ins);
  }
  return ins
}

function SimpleAggregatorV3Ins(address) {
  let ins = _getInstance('SimpleAggregatorV3', address);
  if(!ins) {
    ins = new SimpleAggregatorV3(chainWeb3, address);
    _setInstance('SimpleAggregatorV3', address, ins);
  }
  return ins
}

function ERC20TokenIns(address) {
  let ins = _getInstance('ERC20Token', address);
  if(!ins) {
    ins = new ERC20Token(chainWeb3, address);
    _setInstance('ERC20Token', address, ins);
  }
  return ins
}

var InpageProvider = {}
let $ = InpageProvider;

$.ZERO_ADDR = '0x0000000000000000000000000000000000000000'
$.EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
$.BALLOT_BYTECODE = BALLOT_BYTECODE
$.accounts = chainWeb3.accounts
$.chainId = chainWeb3.chainId
$.tokens = {}
$.poolsMapWithIndex = {}
$.poolInfoMapWithPair = {}
$.pairsToken = {}
$.ifoPools = {}
$.projectFactories = {}
$.projectPools = {}
$.pools = {}
$.shackFarmPools = {}
$.shackStatistics = {
  tvl: '--',
  earn: '--',
}

let baseToken = ''
let dayPreBlock = 0

$.ERC20Token = ERC20TokenIns
$.DemaxPricePrediction = DemaxPricePredictionIns
$.SimpleAggregatorV3 = SimpleAggregatorV3Ins
$.claim = new DemaxClaim(chainWeb3)
$.pricePredictionQuery = new DemaxPricePredictionQuery(chainWeb3)
$.chainWeb3 = chainWeb3;
$.web3Util = chainWeb3.web3Util;
$.web3 = () => {
  return chainWeb3.web3;
}


function handleNewChain (chainId) {
  console.log('handleNewChain:', chainId)
  if(!chainId) {
    return
  }
  $.chainId = chainId
  $.updateToken($.ZERO_ADDR, $.getZeroSymbol(), 18)
}
chainWeb3.onChainChanged(handleNewChain)


function clearWasteData() {
  if(!$.chainId) {
    return
  }
  let AAAAFactoryAddr = localStorage.getItem('AAAAFactory')
  let curAddr = $.getContractAddr('AAAAFactory')
  if(!AAAAFactoryAddr || (AAAAFactoryAddr && AAAAFactoryAddr != curAddr)) {
    localStorage.setItem('AAAAFactory', curAddr)
    localStorage.removeItem($.chainId + getSelectedAddress())
  }
}

function handleNewAccounts (newAccounts) {
  $.accounts = newAccounts
  // clearWasteData()
}
chainWeb3.onAccountsChanged(handleNewAccounts)


function getWeb3(force = false) {
  return chainWeb3.getWeb3(force)
}


function getContractByName(name) {
  let abi = null
  if(name === 'AAAAFactory') {
    abi = AAAAFactoryABI
  } else if(name === 'AAAAPlatform') {
    abi = AAAAPlatformABI
  } else if(name === 'AAAAMint') {
    abi = AAAAMintABI
  } else if(name === 'AAAAQuery') {
    abi = AAAAQueryABI
  } else if(name === 'AAAAQuery2') {
    abi = AAAAQuery2ABI
  } else if(name === 'AAAAQuery3') {
    abi = AAAAQuery3ABI
  } else if(name === 'AAAAConfig') {
    abi = AAAAConfigABI
  } else if(name === 'AAAAShare') {
    abi = AAAAShareABI
  } else if(name === 'AAAAReward') {
    abi = AAAARewardABI
  } else if(name === 'AAAAGovernance') {
    abi = AAAAGovernanceABI
  } else if(name === 'IFOFactory') {
    abi = IFOFactoryABI
  } else if(name === 'IFOQuery') {
    abi = IFOQueryABI
  } else if(name === 'IFOQuery2') {
    abi = IFOQuery2ABI
  } else if(name === 'DemaxProjectDeploy') {
    abi = DemaxProjectDeployABI
  } else if(name === 'DemaxProjectQuery') {
    abi = DemaxProjectQueryABI
  } else if(name === 'DemaxShackChef') {
    abi = DemaxShackChefABI
  } else if(name === 'DemaxShackFarm') {
    abi = DemaxShackFarmABI
  } else if(name === 'DemaxShackChefQuery') {
    abi = DemaxShackChefQueryABI
  } else if(name === 'DemaxFactory') {
    abi = DemaxFactoryABI
  }

  let chainId = getNetworkVersion()
  // let addr = ContractsAddr[chainId][name]
  let addr = Constant.ContractAddress[chainId][name]
  // console.log('getContractByName contract address:', chainId, name, addr)
  return getContract(abi, addr)
}



$.connectChain = async (to='') => {
  await chainWeb3.connectChain(to)
}

$.connect = async (to='') => {
  console.log('connect to...')
  return await chainWeb3.connect(to)
}

$.disconnect = () => {
  chainWeb3.disconnect()
}

$.bigNumberStringFormat = (val, decimals=18, fixed=4) => {
  let amount = new BigNumber(val).shiftedBy(-1*Math.abs(decimals)).toFixed(fixed)
  if(Number(val)>0 && amount < '0.0001') amount = '<0.0001'
  return amount
}

function parseEventLogContent(d) {
  let result = ''
  if(d.type === 'AAAAPOOL_DEPOSIT') {
    let tokens = $.getPairToken(d.address)
    // console.log('tokens:', d.address, tokens)
    let amount = $.bigNumberStringFormat(d.data._amount, tokens.supplyToken.decimals)
    result = amount + ' ' + tokens.supplyToken.symbol
  } else if(d.type === 'AAAAPOOL_WITHDRAW') {
    let tokens = $.getPairToken(d.address)
    let amount = $.bigNumberStringFormat(d.data._supplyAmount, tokens.supplyToken.decimals)
    result = amount + ' ' + tokens.supplyToken.symbol
    if(d.data._collateralAmount > '0') {
      amount = $.bigNumberStringFormat(d.data._collateralAmount, tokens.collateralToken.decimals)
      result + ' ' + amount + ' ' + tokens.collateralToken.symbol + ' ' + tokens.lpToken0Symbol + '-' + tokens.lpToken1Symbol
    }
  } else if(d.type === 'AAAAPOOL_BORROW') {
    let tokens = $.getPairToken(d.address)
    let amount = $.bigNumberStringFormat(d.data._supplyAmount, tokens.supplyToken.decimals)
    result = '+ ' + amount + ' ' + tokens.supplyToken.symbol
    if(d.data._collateralAmount > '0') {
      amount = $.bigNumberStringFormat(d.data._collateralAmount, tokens.collateralToken.decimals)
      result + ' - ' + amount + ' ' + tokens.collateralToken.symbol + ' ' + tokens.lpToken0Symbol + '-' + tokens.lpToken1Symbol
    }
  } else if(d.type === 'AAAAPOOL_REPAY') {
    let tokens = $.getPairToken(d.address)
    let amount = new BigNumber(d.data._supplyAmount).plus(new BigNumber(d.data._interestAmount))
    amount = $.bigNumberStringFormat(amount.toFixed(), tokens.supplyToken.decimals)
    result = amount + ' ' + tokens.supplyToken.symbol
  } else if(d.type === 'AAAAPOOL_REINVEST') {
    let tokens = $.getPairToken(d.address)
    let amount = $.bigNumberStringFormat(d.data._reinvestAmount, tokens.supplyToken.decimals)
    result = amount + ' ' + tokens.supplyToken.symbol
  } else if(d.type === 'AAAAPOOL_LIQUIDATION') {
    let tokens = $.getPairToken(d.address)
    let amount = $.bigNumberStringFormat(d.data._supplyAmount, tokens.supplyToken.decimals)
    result = ' ' + amount + ' ' + tokens.supplyToken.symbol
    amount = $.bigNumberStringFormat(d.data._collateralAmount, tokens.collateralToken.decimals)
    result + ', ' + amount + ' ' + tokens.collateralToken.symbol + ' ' + tokens.lpToken0Symbol + '-' + tokens.lpToken1Symbol
  } else if(d.type === 'AAAAPOOL_MINTLENDER') {
    let amount = $.bigNumberStringFormat(d.data.userAmount, 18)
    result = amount + ' ' + ProjectCoin
  } else if(d.type === 'AAAAPOOL_MINTBORROWER') {
    let amount = $.bigNumberStringFormat(d.data.userAmount, 18)
    result = amount + ' ' + ProjectCoin
  } else if(d.type === 'AAAAMINT_MINT') {
    let amount = $.bigNumberStringFormat(d.data.userAmount, 18)
    result = amount + '  ' + ProjectCoin
  } else if(d.type === 'AAAASHARE_PRODUCTIVITYINCREASED') {
    let amount = $.bigNumberStringFormat(d.data.value, 18)
    result = amount + '  ' + ProjectCoin
  } else if(d.type === 'AAAASHARE_PRODUCTIVITYDECREASED') {
    let amount = $.bigNumberStringFormat(d.data.value, 18)
    result = amount + '  ' + ProjectCoin
  } else if(d.type === 'AAAASHARE_MINT') {
    let amount = $.bigNumberStringFormat(d.data.amount, 18)
    result = amount + ' USDT'
  } else if(d.type === 'AAAAREWARD_PRODUCTIVITYINCREASED') {
    let amount = $.bigNumberStringFormat(d.data.value, 18)
    result = amount + ' ' + ProjectCoin
  } else if(d.type === 'AAAAREWARD_PRODUCTIVITYDECREASED') {
    let amount = $.bigNumberStringFormat(d.data.value, 18)
    result = amount + ' ' + ProjectCoin
  } else if(d.type === 'AAAAREWARD_MINT') {
    let amount = $.bigNumberStringFormat(d.data.amount, 18)
    result = amount + '  ' + ProjectCoin
  } else if(d.type === 'AAAABALLOT_VOTED') {
    let amount = $.bigNumberStringFormat(d.data._weight, 18)
    let val = d.data._index == '0' ? 'YES' : 'NO'
    result = amount + ' '+ val
  } else if(d.type === 'AAAABALLOT_CLAIMED') {
    let amount = $.bigNumberStringFormat(d.data._reward, 18)
    result = amount + '  ' + ProjectCoin
  } else if(d.type === 'AAAAFACTORY_BALLOTCREATED') {
    if(d.data.value > '0') {
      let amount = $.bigNumberStringFormat(d.data.value, 18)
      result = '- ' + amount + '  ' + ProjectCoin
    }
  }


  return result
}

$.getTradingList = (account) => {
  let tableName = $.chainId + account;
  const list = localStorage.getItem(tableName);
  if (list) {
    let data = JSON.parse(list);
    return data.map(d => {
      console.log('log:', d)
      return {
          time: d.time,
          hash: d.hash,
          type: d.type,
          content: parseEventLogContent(d),
      }
  })
  } else {
    return [];
  }
}

$.handleEventLog = (web3, abi, receipt, contractName, eventName) => {
  chainWeb3.handleEventLog(abi, receipt, contractName, eventName)
}

$.getBlockNumber = async() => {
  return await chainWeb3.getBlockNumber();
}

$.getBlockSpanTime = () => {
  if(getNetworkVersion() == 1) {
    return 13.5;
  }
  return 3;
}

$.getBlockToTimes = (start, end) => {
  let now = new Date().getTime();
  let spanTime = (Number(end) - Number(start))* $.getBlockSpanTime();
  return now+parseInt(spanTime *1000);
}

$.getNowToEndBlockTime = async (block) => {
  let currentBlock = await $.getBlockNumber();
  return $.getBlockToTimes(currentBlock, block);
}

$.getBlockNumbers = (blockNumber, blockTime, targetTime) => {
  let diff = (targetTime - blockTime)/1000/$.getBlockSpanTime();
  return Number(blockNumber) + parseInt(diff);
}

$.getBlockNumberCount = (blockTime, targetTime) => {
  return parseInt((targetTime - blockTime)/1000/$.getBlockSpanTime());
}

$.onChainStatus = (handleChainStatus) => {
  chainWeb3.onChainStatus(handleChainStatus)
}

$.onAccountsChanged = (handleNewAccounts) => {
  chainWeb3.onAccountsChanged(handleNewAccounts)
}

$.onChainChanged = (handleChain) => {
  chainWeb3.onChainChanged(handleChain)
}

$.on = (event, handler) => {
  ethereum.on(event, handler)
}

$.getAccounts = () => {
  return chainWeb3.getAccounts()
}

$.isChainConnected = () => {
  return chainWeb3.isChainConnected()
}

$.isConnected = () => {
  return chainWeb3.isConnected()
}

$.updateToken = (addr, symbol, decimals) => {
  if(!addr) {
    throw('addr undefined')
  }
  addr = addr.toLocaleLowerCase()
  if($.tokens[addr] == undefined) $.tokens[addr] = {}
  $.tokens[addr]['address'] = addr
  $.tokens[addr]['symbol'] = symbol
  $.tokens[addr]['decimals'] = decimals
}

$.getToken = (addr) => {
  addr = addr+""
  addr = addr.toLocaleLowerCase()
  return $.tokens[addr]
}

$.getBaseTokenAddr = async () => {
  if(!baseToken) {
    let methods = getContractMethodsByName('AAAAConfig')
    baseToken = await methods.base().call()
  }
  return baseToken
}

$.queryToken = async (addr) => {
  if(!addr) {
    throw('addr undefined')
  }
  addr = addr.toLocaleLowerCase()
  // console.log('query token:', addr)
  let token = $.tokens[addr]
  if(!token) {
    let methods = getContractMethods(ERC20TokenABI, addr)
    let symbol = await methods.symbol().call()
    let decimals = await methods.decimals().call()
    $.updateToken(addr, symbol, decimals)
    token = $.tokens[addr]
  }
  return token
}

$.queryBaseToken = async () => {
  await $.getBaseTokenAddr()
  return await $.queryToken(baseToken)
}

$.getTokenDecimals = (addr) => {
  if(!addr) {
    throw('addr undefined')
  }
  addr = addr.toLocaleLowerCase()
  if($.tokens[addr]) {
    return Number($.tokens[addr]['decimals'])
  }
  console.error('getTokenDecimals not found token:', addr)
  return 18
}

$.getTokenDecimalsAsync = async (addr) => {
  let token = await $.queryToken(addr)
  if(token) {
    return Number(token['decimals'])
  }
  console.error('getTokenDecimalsAsync not found token:', addr)
  return 18
}

$.updatePairToken = (pair, supplyToken, collateralToken, lpToken0Symbol, lpToken1Symbol) => {
  pair = pair.toLocaleLowerCase()
  $.pairsToken[pair] = {
    supplyToken: $.tokens[supplyToken],
    collateralToken: $.tokens[collateralToken],
    lpToken0Symbol: lpToken0Symbol,
    lpToken1Symbol: lpToken1Symbol
  }
  // console.log('updatePairToken:', $.pairsToken[pair])
}

$.getPairToken = (pair) => {
  pair = pair.toLocaleLowerCase()
  return $.pairsToken[pair]
}

$.getEtherscanAddress = (address) => {
  return chainWeb3.getEtherscanAddress(address)
}

$.getEtherscanTx = (tx) => {
  return chainWeb3.getEtherscanTx(tx)
}

$.awaitTransactionMined = (hash) => {
  return chainWeb3.awaitTransactionMined(hash)
}

$.getZeroSymbol = () => {
  return chainWeb3.getZeroSymbol()
}

$.getWSymbol = () => {
  return chainWeb3.getWSymbol()
}

$.getTokenAddress = (name) => {
  return Tokens[getNetworkVersion()][name]
}

$.isWethAddress = (addr) => {
  try {
    return Tokens[getNetworkVersion()]['WETH'].toLocaleLowerCase() == addr.toLocaleLowerCase() || addr == chainWeb3.ZERO_ADDR
  } catch(e) {
    console.error('isWethAddress except:', getNetworkVersion(), addr)
    throw(e)
  }

}

$.getPoolAddress = (address) => {
  if(!address) {
    return $.poolsMapWithIndex[0]
  }
  return address
}

$.getContractAddr = (name) => {
  return chainWeb3.getContractAddr(name)
}

function getSelectedAddress() {
  return chainWeb3.getSelectedAddress()
}

function getContract(abi, address) {
  return chainWeb3.getContract(abi, address)
}

function getContractMethods(abi, address) {
  const web3 = getWeb3()
  return new web3.eth.Contract(abi, address).methods
}

function getContractMethodsByName(name) {
  let contract = getContractByName(name)
  return contract.methods
}

function getNetworkVersion() {
  return chainWeb3.getNetworkVersion()
}

function executeContract(contract, methodName, value, params) {
  return chainWeb3.executeContract(contract, methodName, value, params)
}

async function executeContractWithAsync(contract, methodName, value, params) {
  let hash = executeContract(contract, methodName, value, params)
  return awaitTransactionMined(hash)
}

function executeContractByName(contractName, methodName, value, params) {
  return executeContract(getContractByName(contractName), methodName, value, params)
}


$.getNetworkVersion = getNetworkVersion

$.getDayPreBlock = async() => {
  if(!dayPreBlock) {
    let methods = getContractMethodsByName('AAAAConfig')
    dayPreBlock = parseInt(await methods.DAY().call())
  }
  // console.log('dayPreBlock:', dayPreBlock)
  return dayPreBlock
}

$.getBalance = async (address) => {
  if (!address) {
    address = getSelectedAddress()
  }
  const web3 = getWeb3()
  return await web3.eth.getBalance(address)
}

$.balanceOf = async (token, address) => {
  if($.isWethAddress(token)) {
    return await $.getBalance(address)
  }
  let methods = getContractMethods(ERC20TokenABI, token)
  return await methods.balanceOf(address).call()
}

$.tokenBalanceOf = async (token, address) => {
  // console.log('tokenBalanceOf:', token, address)
  if($.isWethAddress(token)) {
    let balance = await $.getBalance(address)
    return new BigNumber(balance).shiftedBy(-18)
  }
  let methods = getContractMethods(ERC20TokenABI, token)
  let decimals = await methods.decimals().call()
  let balance = await methods.balanceOf(address).call()
  return new BigNumber(balance).shiftedBy(-1*decimals)
}

$.getInterests = (address) => {
  if (!address) {
    address = $.getPoolAddress()
  }

  let methods = getContractMethods(AAAAPoolABI, address)
  return methods.getInterests().call()
}

$.countPools = () => {
  let methods = getContractMethodsByName('AAAAFactory')
  return methods.countPools().call()
}

$.queryPoolList = async () => {
  let methods = getContractMethodsByName('AAAAQuery')
  let pools = await methods.queryPoolList().call()
  let i = 0;
  let data = []
  for (let res of pools) {
    $.poolInfoMapWithPair[res.pair] = res
  }

  for (let res of pools) {
    if(res.pair == $.ZERO_ADDR) {
      continue
    }
    let d = await $.warpPoolData(res)
    d.comprehensiveApy = d.apy
    data.push(d)
    $.poolsMapWithIndex[i] = res.pair
    $.poolInfoMapWithPair[res.pair] = d
    i++
  }
  if(data.length > 0) {
      data.sort((pre, next) => {
        if (pre['supplyTokenSymbol'] < next['supplyTokenSymbol']) {return -1;}
        if (pre['supplyTokenSymbol'] > next['supplyTokenSymbol']) {return 1;}
        return 0
    })
  }
  return data
}

$.getPoolByIndex = async (i=0) => {
  let methods = getContractMethodsByName('AAAAQuery')
  let res = await methods.getPoolInfoByIndex(i).call()
  let d = await $.warpPoolData(res)
  $.poolsMapWithIndex[i] = res.pair
  $.poolInfoMapWithPair[res.pair] = d
  return d
}

$.getPoolInfo = async (pair) => {
  let methods = getContractMethodsByName('AAAAQuery')
  let res = await methods.getPoolInfo(pair).call()
  let d = await $.warpPoolData(res)
  $.poolInfoMapWithPair[res.pair] = d
  return d
}

$.warpPoolData = async(res) => {
  let d = {}
  Object.assign(d, res);
  if(res.supplyTokenSymbol == $.getWSymbol()) {
    d.supplyTokenSymbol = $.getZeroSymbol()
    $.updateToken(res.supplyToken, d.supplyTokenSymbol, res.supplyTokenDecimals)
  }
  if(res.lpToken0Symbol == $.getWSymbol()) {
    d.lpToken0Symbol = $.getZeroSymbol()
  }
  if(res.lpToken1Symbol == $.getWSymbol()) {
    d.lpToken1Symbol = $.getZeroSymbol()
  }
  $.updateToken(res.supplyToken, res.supplyTokenSymbol, res.supplyTokenDecimals)
  $.updateToken(res.collateralToken, res.collateralTokenSymbol, res.collateralTokenDecimals)
  $.updatePairToken(res.pair, res.supplyToken, res.collateralToken, d.lpToken0Symbol, d.lpToken1Symbol)
  await $.getBaseTokenAddr()
  await $.getDayPreBlock()
  let baseInfo = await $.queryToken(baseToken)
  let baseDecimals = parseInt(baseInfo.decimals)
  let totalSupply = new BigNumber(res.remainSupply).plus(new BigNumber(res.totalBorrow))
  let totalSupplyValue = res.totalSupplyValue=='0' ? new BigNumber('0') : new BigNumber(res.totalSupplyValue).shiftedBy(-1*baseDecimals)
  let totalPledgeValue = res.totalPledgeValue=='0' ? new BigNumber('0') : new BigNumber(res.totalPledgeValue).shiftedBy(-1*baseDecimals)
  d.useRate = totalSupply.isEqualTo(new BigNumber('0')) ? '0' : new BigNumber(res.totalBorrow).dividedBy(totalSupply).multipliedBy(100).toFixed(2)
  d.lockUpValue = totalSupplyValue.plus(totalPledgeValue).toFixed()
  d.totalSupplyValue = totalSupplyValue.toFixed()
  d.totalSupply = totalSupply.toFixed()
  d.apyMining = '0'
  d.apr = new BigNumber(res.borrowInterests).multipliedBy(365).multipliedBy(dayPreBlock).shiftedBy(-1*res.supplyTokenDecimals).multipliedBy(100).toFixed(2)
  d.apy = new BigNumber(res.supplyInterests).multipliedBy(365).multipliedBy(dayPreBlock).shiftedBy(-1*res.supplyTokenDecimals).multipliedBy(100).toFixed(2)
  return d
}

$.getInterests = (address) => {
  if (!address) {
    address = $.getPoolAddress()
  }

  let methods = getContractMethods(AAAAPoolABI, address)
  return methods.getInterests().call()
}

$.allowance = async (token, spender) => {
  if (!spender) {
    spender =  $.getContractAddr('AAAAPlatform')
  }
  if($.isWethAddress(token)) {
    return new BigNumber('1000000000000000000000')
  }
  // console.log('allowance:', token, getSelectedAddress(), spender)
  let methods = getContractMethods(ERC20TokenABI, token)
  let decimals = await methods.decimals().call();

  let allowance = await methods.allowance(getSelectedAddress(), spender).call();
  return new BigNumber(allowance).shiftedBy(-1*decimals)
}

$.approve = (token, spender) => {
  if (!spender) {
    spender = $.getContractAddr('AAAAPlatform')
  }
  // console.log('approve:', token, spender)
  const maxApproval = new BigNumber(2).pow(255).minus(1)
  let contact = getContract(ERC20TokenABI, token)
  return executeContract(contact, 'approve', 0, [spender, maxApproval.toFixed()]).then(hash=> $.awaitTransactionMined(hash))
}

$.deposit = (lendToken, collateralToken, amountDeposit) => {
  let amount = new BigNumber(amountDeposit).shiftedBy($.getTokenDecimals(lendToken)).toFixed()
  let contract = getContractByName('AAAAPlatform')
  if($.isWethAddress(lendToken)) {
    return executeContract(contract, 'depositETH', amount, [lendToken, collateralToken])
  } else {
    return executeContract(contract, 'deposit', 0, [lendToken, collateralToken, amount])
  }
}

$.elogDeposit = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Deposit')
}

$.withdraw = (lendToken, collateralToken, amountWithdraw) => {
  let amount = new BigNumber(amountWithdraw).shiftedBy($.getTokenDecimals(lendToken)).toFixed()
  let contract = getContractByName('AAAAPlatform')
  return executeContract(contract, 'withdraw', 0, [lendToken, collateralToken, amount])
}

$.elogWithdraw = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Withdraw')
}

$.borrow = (lendToken, collateralToken, amountCollateral, expectBorrow) => {
  amountCollateral = new BigNumber(amountCollateral).shiftedBy($.getTokenDecimals(collateralToken)).toFixed()
  expectBorrow = new BigNumber(expectBorrow).shiftedBy($.getTokenDecimals(lendToken)).toFixed()
  // console.log('borrow: ', lendToken, collateralToken, amountCollateral, expectBorrow)
  let contract = getContractByName('AAAAPlatform')
  if($.isWethAddress(collateralToken)) {
    return executeContract(contract, 'borrowTokenWithETH', amountCollateral, [lendToken, collateralToken, expectBorrow])
  }
  return executeContract(contract, 'borrow', 0, [lendToken, collateralToken, amountCollateral, expectBorrow])
}

$.elogBorrow = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Borrow')
}

$.repay = (lendToken, collateralToken, amountCollateral, lendValue='0') => {
  amountCollateral = new BigNumber(amountCollateral).shiftedBy($.getTokenDecimals(collateralToken)).toFixed()
  if(lendValue > '0') {
    lendValue = new BigNumber(lendValue).multipliedBy(1.1).shiftedBy($.getTokenDecimals(lendToken)).toFixed(0)
  }
  // console.log('repay: ', lendToken, collateralToken, amountCollateral, lendValue)
  let contract = getContractByName('AAAAPlatform')
  if($.isWethAddress(lendToken)) {
    return executeContract(contract, 'repayETH', lendValue, [lendToken, collateralToken, amountCollateral])
  }
  return executeContract(contract, 'repay', 0, [lendToken, collateralToken, amountCollateral])
}

$.elogRepay = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Repay')
}

$.liquidation = (lendToken, collateralToken, user) => {
  let contract = getContractByName('AAAAPlatform')
  return executeContract(contract, 'liquidation', 0, [lendToken, collateralToken, user])
}

$.elogLiquidation = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Liquidation')
}

$.reinvest = (lendToken, collateralToken) => {
  let contract = getContractByName('AAAAPlatform')
  return executeContract(contract, 'reinvest', 0, [lendToken, collateralToken])
}

$.elogReinvest = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'Reinvest')
}

$.mint = (pair) => {
  let contract = getContract(AAAAPoolABI, pair)
  return executeContract(contract, 'mint', 0, [])
}

$.elogMint = (receipt) => {
  $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'MintBorrower')
  $.handleEventLog(getWeb3(), AAAAPoolABI, receipt, 'AAAAPool', 'MintLender')
}

$.take = (pair) => {
  // console.log('take:', pair, getSelectedAddress())
  let methods = getContractMethods(AAAAPoolABI, pair)
  return methods.takeAll().call({from: getSelectedAddress()})
}

$.canReinvest = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let methods = getContractMethodsByName('AAAAQuery')
  return await methods.canReinvest(pair, user).call()
}

$.takeLendWithBlock = () => {
  let methods = getContractMethodsByName('AAAAMint')
  return methods.takeLendWithBlock().call({from: getSelectedAddress()})
}

$.takeLendWithAddress = async () => {
  return '0'
  // let methods = getContractMethodsByName('AAAAMint')
  // return methods.takeLendWithAddress(getSelectedAddress()).call()
}

$.takeLendPair = async () => {
  let res = await $.takeLendWithAddress()
  // console.log('takeLendWithAddress:', res)
  let amount = new BigNumber(res)
  let takes = {}
  let total = new BigNumber(0)
  let arr = {}
  for(let pair in $.poolInfoMapWithPair) {
    let result = await $.supplys(pair)
    // console.log('takeLendPair:', result)
    arr[pair] = new BigNumber(result.amountSupply)
    total = total.plus(new BigNumber(result.amountSupply))
  }
  for(let pair in arr) {
    if(total.isEqualTo(new BigNumber('0'))) {
      takes[pair] = '0'
    } else {
      takes[pair] = amount.shiftedBy(-18).multipliedBy(arr[pair].dividedBy(total)).toFixed()
    }
  }
  return takes

}

$.mintLender = () => {
  let contract = getContractByName('AAAAMint')
  return executeContract(contract, 'mintLender', 0, [])
}

$.takeBorrowWithBlock = () => {
  let methods = getContractMethodsByName('AAAAMint')
  return methods.takeBorrowWithBlock().call({from: getSelectedAddress()})
}

$.takeBorrowWithAddress = async () => {
  return '0'
  // let methods = getContractMethodsByName('AAAAMint')
  // return await methods.takeBorrowWithAddress(getSelectedAddress()).call()
}

$.takeBorrowPair = async () => {
  let res = await $.takeBorrowWithAddress()
  console.log('takeBorrowWithAddress:', res)
  let amount = new BigNumber(res)
  let promises = []
  let takes = {}
  let total = new BigNumber('0')
  let i = 0
  let arr = {}
  for(let pair in $.poolInfoMapWithPair) {
    let result = await $.borrows(pair)
    // console.log('takeBorrowPair:', result)
    arr[pair] = new BigNumber(result.amountBorrow)
    total = total.plus(new BigNumber(result.amountBorrow))
  }
  for(let pair in arr) {
    if(total.isEqualTo(new BigNumber('0'))) {
      takes[pair] = '0'
    } else {
      takes[pair] = amount.shiftedBy(-18).multipliedBy(arr[pair].dividedBy(total)).toFixed()
    }
  }
  return takes

}

$.mintBorrower = () => {
  let contract = getContractByName('AAAAMint')
  return executeContract(contract, 'mintBorrower', 0, [])
}

$.takeAll = () => {
  let methods = getContractMethodsByName('AAAAMint')
  return methods.take().call({from: getSelectedAddress()})
}

$.mintAll = () => {
  let contract = getContractByName('AAAAMint')
  return executeContract(contract, 'mint', 0, [])
}

$.elogMintAll = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAMintABI, receipt, 'AAAAMint', 'Mint')
}


$.supplys = (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  return methods.supplys(getSelectedAddress()).call({from: getSelectedAddress()})
}

$.borrows = async (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  return await methods.borrows(getSelectedAddress()).call()
}

$.queryMintToken = () => {
  let methods = getContractMethodsByName('AAAAQuery')
  return methods.queryMintToken(getSelectedAddress()).call()
}

$.pledgePrice = (pair) => {
  //POOL_PRICE
  let key = '0x504f4f4c5f505249434500000000000000000000000000000000000000000000'
  let tokens = $.getPairToken(pair)
  // console.log('pledgePrice tokens:', tokens)
  let methods = getContractMethodsByName('AAAAConfig')
  let supplyDecimals = new BigNumber(tokens.supplyToken['decimals'])
  let collateralDecimals = new BigNumber(tokens.collateralToken['decimals'])
  return methods.getPoolValue(pair, key).call().then(res=>{
    let price = new BigNumber(res)
    // console.log('price:', price.toFixed())
    let offset = collateralDecimals.minus(supplyDecimals)
    price = price.div(new BigNumber(10).pow(offset)).div(new BigNumber(10).pow(18))
    return Promise.resolve(price)
  })
}

$.getMaximumBorrowAmount = (pair, amountCollateral) => {
  let tokens = $.getPairToken(pair)
  let decimals = Number(tokens.collateralToken['decimals'])
  amountCollateral = new BigNumber(amountCollateral).shiftedBy(decimals).toFixed()
  console.log('getMaximumBorrowAmount:', tokens.supplyToken.address, tokens.collateralToken.address, amountCollateral)
  let methods = getContractMethodsByName('AAAAPlatform')
  return methods.getMaximumBorrowAmount(tokens.supplyToken.address, tokens.collateralToken.address, amountCollateral).call()
}


$.getCanMaxBorrowAmount = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let methods = getContractMethodsByName('AAAAQuery')
  return await methods.getCanMaxBorrowAmount(pair, user, 5).call()
}


$.getRepayAmount = (pair, amountCollateral) => {
  let tokens = $.getPairToken(pair)
  let methods = getContractMethodsByName('AAAAPlatform')
  return methods.getRepayAmount(tokens.supplyToken.address, tokens.collateralToken.address, amountCollateral, getSelectedAddress()).call()
}

$.countBorrow = (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  return methods.numberBorrowers().call()
}

$.iterateBorrowInfo = (pair, start, end) => {
  let methods = getContractMethodsByName('AAAAQuery')
  return methods.iterateBorrowInfo(pair, start, end).call()
}

$.stake = (amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  // console.log('stake:', amount)
  let contract = getContractByName('AAAAShare')
  return executeContract(contract, 'stake', 0, [amount])
}

$.elogStake = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAShareABI, receipt, 'AAAAShare', 'ProductivityIncreased')
}

$.unstake = (amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  // console.log('unstake:', amount)
  let contract = getContractByName('AAAAShare')
  return executeContract(contract, 'withdraw', 0, [amount])
}

$.elogUnStake = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAShareABI, receipt, 'AAAAShare', 'ProductivityDecreased')
}

$.stakeBalanceOf = () => {
  let methods = getContractMethodsByName('AAAAShare')
  return methods.users(getSelectedAddress()).call().then(res=>{
    return Promise.resolve(res.amount)
  })
}

$.queryStakeReward = () => {
  let methods = getContractMethodsByName('AAAAShare')
  return methods.queryReward().call({from: getSelectedAddress()})
}

$.mintStakeReward = () => {
  let contract = getContractByName('AAAAShare')
  return executeContract(contract, 'mintReward', 0, [])
}

$.elogMintStakeReward = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAShareABI, receipt, 'AAAAShare', 'Mint')
}

$.totalStake = () => {
  let methods = getContractMethodsByName('AAAAShare')
  return methods.totalProductivity().call()
}

$.mintStakeCumulation = () => {
  let methods = getContractMethodsByName('AAAAShare')
  return methods.mintCumulation().call()
}

$.stakeFeeCumulation = async () => {
  let methods = getContractMethodsByName('AAAAShare')
  let mintedShare = await methods.mintedShare().call()
  let balance = await $.tokenBalanceOf($.getTokenAddress('USDT'), $.getContractAddr('AAAAShare'))
  return new BigNumber(mintedShare).plus(balance.multipliedBy(new BigNumber(10).pow(18)))
}

$.getPairConf = (pair) => {
  let methods = getContractMethodsByName('AAAAQuery')
  return methods.getPoolConf(pair).call()
}

$.getWithdrawAmount = (pair) => {
  let tokens = $.getPairToken(pair)
  console.log('getWithdrawAmount:', tokens)
  let methods = getContractMethodsByName('AAAAPlatform')
  return methods.getWithdrawAmount(tokens.supplyToken.address, tokens.collateralToken.address, getSelectedAddress()).call()
}

$.userLiquidationLength = (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  return methods.liquidationHistoryLength(getSelectedAddress()).call()
}

$.queryUserLiquidationList = (pair) => {
  let methods = getContractMethodsByName('AAAAQuery')
  // console.log('queryUserLiquidationList:', pair, getSelectedAddress())
  return methods.queryUserLiquidationList(pair, getSelectedAddress()).call()
}

$.iteratePairLiquidationInfo = (pair, start, end) => {
  let methods = getContractMethodsByName('AAAAQuery')
  return methods.iteratePairLiquidationInfo(pair, start, end).call()
}

$.iterateLiquidationInfo = async (index, start, end) => {
  let info = await $.getPoolByIndex(index)
  return await $.iteratePairLiquidationInfo(info.pair, start, end)
}

$.amountPerBlock = () => {
  let methods = getContractMethodsByName('AAAAMint')
  return methods.amountPerBlock().call()
}

$.getTokenPrice0 = (pair, token) => {
  if (!pair || !token) {
    // console.log('Token no price')
    return new BigNumber(0)
  }
  let methods = getContractMethodsByName('AAAAQuery')
  return methods.getSwapPairReserve(pair).call().then(res=> {
    let d0 = new BigNumber(res.decimals0)
    let d1 = new BigNumber(res.decimals1)
    let r0 = new BigNumber(res.reserve0)
    let r1 = new BigNumber(res.reserve1)
    let offset = d0.minus(d1)
    if (offset > 0) {
      r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
    } else if(offset < 0) {
      r0 = r0.multipliedBy(new BigNumber(10).pow(offset))
    }
    if (token == res.token0.toLocaleLowerCase()) {
      return Promise.resolve(r1.dividedBy(r0))
    } else {
      return Promise.resolve(r0.dividedBy(r1))
    }
  })

}
$.getTokenPrice = async (pair, token) => {
  if (!pair || pair==$.ZERO_ADDR || !token) {
    return '0'
  }
  let methods = getContractMethodsByName('AAAAQuery')

  let res = await methods.getSwapPairReserve(pair).call()
  let d0 = new BigNumber(res.decimals0)
  let d1 = new BigNumber(res.decimals1)
  let r0 = new BigNumber(res.reserve0)
  let r1 = new BigNumber(res.reserve1)
  let offset = d0.minus(d1)
  r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
  if (token.toLocaleLowerCase() === res.token0.toLocaleLowerCase()) {
    return r1.dividedBy(r0).toFixed()
  } else {
    return r0.dividedBy(r1).toFixed()
  }
}

$.getBurgerPrice = async () => {
  let pair = $.getContractAddr('ThirdBurgerUsdPair')
  let token = $.getTokenAddress('BURGER').toLocaleLowerCase()
  return await $.getTokenPrice(pair, token)
}

$.getCokePrice = async () => {
  let pair = $.getContractAddr('ThirdCokeUsdPair')
  let token = $.getTokenAddress('UNI').toLocaleLowerCase()
  return await $.getTokenPrice(pair, token)
}

$.getAAAAPrice = async () => {
  let pair = $.getContractAddr('ThirdTokenPair')
  let token = $.getContractAddr('AAAAToken').toLocaleLowerCase()
  return await $.getTokenPrice(pair, token)
}

$.getAAAAPrice2 = () => {
  let thirdTokenBurgerPair = $.getContractAddr('ThirdTokenBurgerPair')
  if (!thirdTokenBurgerPair) {
    // console.log('Token no price')
    return Promise.resolve(new BigNumber(0))
  }
  let thirdBurgerUsdPair = $.getContractAddr('ThirdBurgerUsdPair')
  if (!thirdBurgerUsdPair) {
    // console.log('Token no price')
    return Promise.resolve(new BigNumber(0))
  }

  let methods = getContractMethodsByName('AAAAQuery')

  let thirdTokenBurger = methods.getSwapPairReserve(thirdTokenBurgerPair).call()
  let thirdBurgerUsd = methods.getSwapPairReserve(thirdBurgerUsdPair).call()
  return Promise.all([thirdTokenBurger, thirdBurgerUsd]).then(res => {
    console.log('getAAAAPrice2:', res)
    let thirdTokenBurgerPool = res[0]
    let thirdBurgerUsdPool = res[1]
    let aaaaToken = $.getContractAddr('AAAAToken').toLocaleLowerCase()
    let usdToken = $.getTokenAddress('USDT').toLocaleLowerCase()
    let r0 = new BigNumber(thirdTokenBurgerPool.reserve0)
    let r1 = new BigNumber(thirdTokenBurgerPool.reserve1)
    let offset = new BigNumber(thirdTokenBurgerPool.decimals0).minus(new BigNumber(thirdTokenBurgerPool.decimals1))
    if (offset > 0) {
      r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
    } else if(offset < 0) {
      r0 = r0.multipliedBy(new BigNumber(10).pow(offset))
    }
    let priceTokenBurber = r0.dividedBy(r1)
    if (aaaaToken == thirdTokenBurgerPool.token0.toLocaleLowerCase()) {
      priceTokenBurber = r1.dividedBy(r0)
    }

    r0 = new BigNumber(thirdBurgerUsdPool.reserve0)
    r1 = new BigNumber(thirdBurgerUsdPool.reserve1)
    offset = new BigNumber(thirdBurgerUsdPool.decimals0).minus(new BigNumber(thirdBurgerUsdPool.decimals1))
    if (offset > 0) {
      r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
    } else if(offset < 0) {
      r0 = r0.multipliedBy(new BigNumber(10).pow(offset))
    }
    let priceBurgerUsd =  r0.dividedBy(r1)
    if (usdToken == thirdBurgerUsdPool.token1.toLocaleLowerCase()) {
      priceBurgerUsd = r1.dividedBy(r0)
    }

    return Promise.resolve(priceTokenBurber.multipliedBy(priceBurgerUsd))
  })

}

$.mintAPR = () => {
  return Promise.resolve({
    borrow: '0',
    supply: '0',
  })
  ///todo
  let methods = getContractMethodsByName('AAAAMint')
  let one = new BigNumber(10).pow(18)
  let totalSupply = new BigNumber(0)
  for(let pair in $.poolInfoMapWithPair) {
    let pool = $.poolInfoMapWithPair[pair]
    totalSupply = totalSupply.plus(pool.remainSupply).plus(pool.totalBorrow)
  }

  let priceTokenCall = $.getAAAAPrice2()
  let borrowPower = methods.borrowPower().call()
  return Promise.all([priceTokenCall, borrowPower]).then(result => {
    const priceToken = result[0]
    const borrowPower = result[1]
    let weight = new BigNumber(borrowPower).dividedBy(10000)
    let rate = new BigNumber('0')
    if(totalSupply.gt(rate)) {
      rate = new BigNumber(3333).multipliedBy(priceToken).multipliedBy(one).div(totalSupply).multipliedBy(365).div(30).multipliedBy(100)
    }

    return Promise.resolve({
      borrow: rate.multipliedBy(weight).toFixed(),
      supply: rate.multipliedBy(new BigNumber(1).minus(weight)).toFixed(),
    })
  }).catch(e=>{
    console.error('mintAPR exception:', e)
    return Promise.resolve({
      borrow: '0',
      supply: '0',
    })
  })
}

$.rewardStake = (amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  let contract = getContractByName('AAAAReward')
  return executeContract(contract, 'stake', 0, [amount])
}

$.elogRewardStake = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAARewardABI, receipt, 'AAAAReward', 'ProductivityIncreased')
}

$.rewardUnStake = (amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  let contract = getContractByName('AAAAReward')
  return executeContract(contract, 'withdraw', 0, [amount])
}

$.elogRewardUnStake = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAARewardABI, receipt, 'AAAAReward', 'ProductivityDecreased')
}

$.rewardMint = (amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  let contract = getContractByName('AAAAReward')
  return executeContract(contract, 'mintReward', 0, [])
}

$.elogRewardMint = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAARewardABI, receipt, 'AAAAReward', 'Mint')
}

$.rewardBalance = (user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let methods = getContractMethodsByName('AAAAReward')
  return methods.users(user).call()
}

$.rewardQuery = () => {
  let methods = getContractMethodsByName('AAAAReward')
  return methods.queryReward().call({from: getSelectedAddress()})
}

$.lpMintAPR = async () => {
  let thirdTokenBurgerPair = $.getContractAddr('ThirdTokenBurgerPair')
  if (!thirdTokenBurgerPair) {
    console.log('Token no price')
    return new BigNumber(0)
  }
  let methods = getContractMethodsByName('AAAAQuery')
  let burgerPrice = await $.getBurgerPrice()
  let aaaaPrice = await $.getAAAAPrice2()
  let thirdTokenBurgerPool = await methods.getSwapPairReserve(thirdTokenBurgerPair).call()
  let aaaaToken = $.getContractAddr('AAAAToken').toLocaleLowerCase()
  let r0 = new BigNumber(thirdTokenBurgerPool.reserve0)
  let r1 = new BigNumber(thirdTokenBurgerPool.reserve1)
  let burgerAmount = r1
  if (aaaaToken == thirdTokenBurgerPool.token1.toLocaleLowerCase()) {
    burgerAmount = r0
  }
  let lpValue = burgerAmount.multipliedBy(2).dividedBy(new BigNumber(10).pow(18)).multipliedBy(burgerPrice)
  console.log('lpValue:', lpValue.toFixed(), burgerAmount.toFixed(), burgerPrice.toFixed(), aaaaPrice.toFixed())
  if (lpValue.isEqualTo(new BigNumber('0'))) return new BigNumber('0')
  return new BigNumber(1).dividedBy(lpValue).multipliedBy(500*365).multipliedBy(aaaaPrice)
}

$.rewardMintAPR = async () => {
  let burgerPrice = await $.getBurgerPrice()
  let aaaaPrice = await $.getAAAAPrice2()
  let burgerAmount = await $.tokenBalanceOf($.getTokenAddress('BURGER'), $.getContractAddr('AAAAReward'))
  let burgerValue = burgerAmount.multipliedBy(burgerPrice)
  // console.log('burgerValue:', burgerValue.toFixed(), burgerAmount.toFixed(), burgerPrice.toFixed(), aaaaPrice.toFixed())
  if (burgerValue.isEqualTo(new BigNumber('0'))) return new BigNumber('0')
  return new BigNumber(1).dividedBy(burgerValue).multipliedBy(100*365).multipliedBy(aaaaPrice)
}

$.getBallotList = async (page=0, size=10) => {
  let methods = getContractMethodsByName('AAAAFactory')
  let count = await methods.countBallots().call()
  count = Number(count)
  let pages = Math.ceil(count / size)
  let start = count - page * size
  let end = start - size
  if(end < 0) end = 0
  let data = await $.iterateReverseBallotList(start, end)
  return {
    pages: pages,
    count: count,
    data: data
  }
}

$.iterateReverseBallotList = async (start, end) => {
  console.log('iterateReverseBallotList:', start, end)
  let methods = getContractMethodsByName('AAAAQuery')
  return await methods.iterateReverseBallotList(start, end).call({from: getSelectedAddress()})
}

$.createProposal = (pool, key, value, subject, content) => {
  let contract = getContractByName('AAAAGovernance')
  return executeContract(contract, 'createProposal', 0, [pool, key, value, subject, content, BALLOT_BYTECODE])
}

$.elogCreateProposal = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAAFactoryABI, receipt, 'AAAAFactory', 'BallotCreated')
}

$.voteProposal = (ballot, index) => {
  let contract = getContractByName('AAAAGovernance')
  return executeContract(contract, 'voteProposal', 0, [ballot, index])
}

$.elogVoteProposal = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAABallotABI, receipt, 'AAAABallot', 'Voted')
}

$.executeProposal = (ballot) => {
  let contract = getContractByName('AAAAGovernance')
  return executeContract(contract, 'executeProposal', 0, [ballot])
}

$.elogExecuteProposal = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAABallotABI, receipt, 'AAAABallot', 'Executed')
}

$.claimProposal = (ballot) => {
  let contract = getContract(AAAABallotABI, ballot)
  return executeContract(contract, 'claim', 0, [])
}

$.elogClaimProposal = (receipt) => {
  return $.handleEventLog(getWeb3(), AAAABallotABI, receipt, 'AAAABallot', 'Claimed')
}

$.getConfigCommon = async () => {
  let methods = getContractMethodsByName('AAAAQuery2')
  return await methods.getConfigCommon().call()
}

$.getConfigPools = async () => {
  let methods = getContractMethodsByName('AAAAQuery2')
  return await methods.getConfigPools().call()
}

$.countConfig = async () => {
  let methods = getContractMethodsByName('AAAAQuery2')
  return await methods.countConfig().call()
}

$.getConfigCommonValues = async () => {
  let methods = getContractMethodsByName('AAAAQuery2')
  return await methods.getConfigCommonValues().call()
}

$.getConfigPoolValues = async (pair) => {
  let methods = getContractMethodsByName('AAAAQuery2')
  return await methods.getConfigPoolValues(pair).call()
}

$.queryCake = async (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  let strategyAddr = await methods.collateralStrategy().call()
  methods = getContractMethods(SLPStrategyABI, strategyAddr)
  let result = await methods.query().call({from: getSelectedAddress()})
  // console.log('queryCake:', result)
  return result
}

$.mintCake = async (pair) => {
  let methods = getContractMethods(AAAAPoolABI, pair)
  let strategyAddr = await methods.collateralStrategy().call()
  let contract = getContract(SLPStrategyABI, strategyAddr)
  return executeContract(contract, 'mint', 0, [])
}

$.elogMintCake = (receipt) => {
  return $.handleEventLog(getWeb3(), SLPStrategyABI, receipt, 'SLPStrategy', 'Mint')
}

$.getPoolValue = async (pair, key) => {
  let methods = getContractMethodsByName('AAAAConfig')
  return await methods.getPoolValue(pair, key).call()
}

$.setPoolValue = async (pair, key, val) => {
  let contract = getContractByName('AAAAConfig')
  return executeContract(contract, 'setPoolValue', 0, [pair, key, val])
}

$.getMasterchefPoolInfo = async (i) => {
  let methods = getContractMethodsByName('AAAAQuery3')
  return await methods.getPoolInfo(i).call()
}

$.getMasterchefPoolInfoList = async (count) => {
  let methods = getContractMethodsByName('AAAAQuery3')
  return await methods.getPoolInfoList(count).call()
}

$.getPrice = async (token) => {
  await $.getBaseTokenAddr()
  let methods = getContractMethodsByName('AAAAConfig')
  let baseInfo = await $.queryToken(baseToken)
  let tokenInfo = await $.queryToken(token)
  let tokenAmount = new BigNumber(10).pow(tokenInfo.decimals).toFixed()
  // console.log('getPrice:', baseToken, token, tokenAmount)
  let out = await methods.convertTokenAmount(token, baseToken, tokenAmount).call()
  return new BigNumber(out).dividedBy(new BigNumber(10).pow(baseInfo.decimals)).toFixed()
}


$.ifoDeposit = async (pair, amount) => {
  let contract = getContract(IFOABI, pair)
  let value = 0
  if($.ifoPools[pair.toLocaleLowerCase()].lpToken == chainWeb3.ZERO_ADDR) {
    value = amount
  }
  return await executeContract(contract, 'deposit', value, [amount])
}

$.ifoHarvest = async (pair) => {
  let contract = getContract(IFOABI, pair)
  return await executeContract(contract, 'harvest', 0, [])
}

$.ifoHasHarvest = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let contract = getContract(IFOABI, pair)
  return await contract.methods.hasHarvest(user).call()
}

$.ifoGetOfferingAmount = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let contract = getContract(IFOABI, pair)
  return await contract.methods.getOfferingAmount(user).call()
}

$.ifoGetRefundingAmount = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }
  let contract = getContract(IFOABI, pair)
  return await contract.methods.getRefundingAmount(user).call()
}

$.ifoCanHarvest = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }

  if(await $.ifoHasHarvest(pair, user) == false) {
    return false
  }
  let _pool = $.ifoPools[pair.toLocaleLowerCase()]
  if(_pool && _pool.status <2) {
    return false
  }
  let offer = await $.ifoGetOfferingAmount(pair, user)
  let refund = await $.ifoGetRefundingAmount(pair, user)
  console.log('ifoCanHarvest:', offer, refund)
  if(offer >0 || refund > 0) {
    return true
  }
  return false
}

$.ifoIsWhite = async (pool) => {
  if(pool.version <2) {
    return true
  }
  if(pool.lpTokenType == 4 || pool.status != 1) {
    return false
  }

  let user = getSelectedAddress()
  let contract = getContract(IFOABI, pool.pool)
  return await contract.methods.whiteList(user).call()
}

$.ifoGetUserInfo = async (pair, user) => {
  if(!user) {
    user = getSelectedAddress()
  }

  let contract = getContract(IFOABI, pair)
  let res = await contract.methods.userInfo(user).call()
  let result = Object.assign({}, res)
  result.offer = await $.ifoGetOfferingAmount(pair, user)
  result.refund = await $.ifoGetRefundingAmount(pair, user)
  result.canHarvest = false
  let hasHarvest = await $.ifoHasHarvest(pair, user)
  let pool = $.ifoPools[pair.toLocaleLowerCase()]
  result.pool = pool
  if(pool && pool.status == 2 && hasHarvest == false && (result.offer>0 ||result.refund >0)) {
    result.canHarvest = true
  }
  if(hasHarvest) {
    result.offer = 0
  }
  console.log('ifoGetUserInfo:', result)
  return result
}

function ifoStatus(start, end) {
  // 0:pending, 1:open, 2:close
  let now = Math.floor(new Date().getTime())
  if(now>= start && now < end) {
    return 1
  } else if(now >= end) {
    return 2
  }
  return 0
}

$.ifoUpdate = async (poolAddr) => {
  console.log('pooladdr', poolAddr)
  let d = $.ifoPools[poolAddr.toLocaleLowerCase()]
  let methods = null
  if(d.version == 1) {
    methods = getContractMethodsByName('IFOQuery')
  } else {
    methods = getContractMethodsByName('IFOQuery2')
  }
  let res = await methods.getPoolData(poolAddr).call({from: getSelectedAddress()})
  console.log('$.ifoPools[poolAddr.toLocaleLowerCase()]', $.ifoPools[poolAddr.toLocaleLowerCase()], res)
  Object.assign($.ifoPools[poolAddr.toLocaleLowerCase()], res)
}

$.ifoList1 = async () => {
  const funContent = {
    burnAmountUSD: "0",
    contractAddress: "0x4c23475b844eb627858113ed36901b93277fbfac",
    date: "2021-04-22",
    desc_en: "Committed to building a parallel world that keeps prospering along with the NFT market, we capture the value of DeFi through FUN Protocol. In the parallel world, there’s an exclusive circulated token system, a network that constantly stimulates NFT creation, and a governance ecosystem represented by NFT. In a word, FUN plays an interesting and important role in the whole NFT world.",
    desc_zh: "我们通过 FUN Protocol 捕获DeFi世界的价值，致力于构建一个跟随NFT市场不断繁荣的平行世界，在该平行世界内，有专属的流动的货币体系，有不断激发NTF创作的网络，还有以NFT为权利代表的治理生态，总而言之，FUN在整个NFT的世界成为一个有趣而又重要的角色。",
    imgUrl: IfoFun,
    name: "FUN Protocol",
    price: "0.9",
    raiseAmountUSD: "740914.88",
    url: "https://nftfun.org"
  };
  const ARTSContent = {
    burnAmountUSD: '0',
    contractAddress: '0x39b1d2975e6464fe30b7b39666ff3a9cb7b4be9e',
    date: '2021-05-16',
    desc_en: 'It is a crypto art (Crypto Art) made by people all over the world, and it is also a picture of the ultimate ideal form.',
    desc_zh: '这是一个全世界人一起制作的加密艺术（Crypto Art），也是极致理想形态的一幅画。',
    imgUrl: IfoArts,
    name: 'ARTS',
    price: '0.000001',
    raiseAmountUSD: '10000',
    url: 'https://burgerswap.org/ifo'
  };
  let methods = getContractMethodsByName('IFOQuery')
  let pools = await methods.iterateReversePoolList(99999, 0).call()
  let nowBlock = await $.getBlockNumber()
  let ipfsList = await $.ifoIPFSlist()
  let data = []
  for (let res of pools) {
    let d = Object.assign({}, res)
    d.version = 1
    d.lpTokenType = 2
    d.isWhite = true
    d.whiteCount = 0
    d.lpTokenDecimals = 18;
    d.startTime = $.getBlockToTimes(nowBlock, res.startBlock)
    d.endTime = $.getBlockToTimes(nowBlock, res.endBlock)
    d.status = ifoStatus(d.startTime, d.endTime)
    // d.content = await $.ifoIPFSPoolInfo(ipfsList[d.pool.toLocaleLowerCase()])
    d.content = d.offeringTokenSymbol === 'ARTS' ? ARTSContent : funContent;
    if(d.content.hasOwnProperty('contractAddress')) {
      $.ifoPools[d.pool.toLocaleLowerCase()] = d
      data.push(d)
    } else {
      console.warn('ifoList invalid data:', d)
    }
  }
  console.log('ifo:',data)
  return data
}

$.ifoList2 = async () => {
  let methods = getContractMethodsByName('IFOQuery2')
  let pools = await methods.iterateReversePoolList(99999, 0).call({from: getSelectedAddress()})
  let nowBlock = await $.getBlockNumber()
  let ipfsList = await $.ifoIPFSlist()
  let data = []
  for (let res of pools) {
    let d = Object.assign({}, res)
    d.version = 2
    d.startTime = $.getBlockToTimes(nowBlock, res.startBlock)
    d.endTime = $.getBlockToTimes(nowBlock, res.endBlock)
    d.status = ifoStatus(d.startTime, d.endTime)
    d.content = await $.ifoIPFSPoolInfo(ipfsList[d.pool.toLocaleLowerCase()])
    if(d.lpTokenType !=4 && d.content.hasOwnProperty('contractAddress')) {
      $.ifoPools[d.pool.toLocaleLowerCase()] = d
      data.push(d)
    } else {
      console.warn('ifoList2 invalid data:', d)
    }
  }
  console.log('ifo2:',data)
  return data
}

$.ifoList = async() => {
  let data = []
  try {
    data = await $.ifoList2()
  } catch(e){}
  return data.concat(await $.ifoList1())
}

$.ifoIPFSlist = async () => {
    let url = `${process.env.VUE_APP_BASE_IPNS_URL}/${IPFS_IFO[getNetworkVersion()]}?${new Date().getTime()}`
    let resp = await fetch(url, {
        method: 'get'
    })

    let text = await resp.text();
    console.log('ifoIPFSlist---', url, text)

    try {
        return JSON.parse(text)
    } catch(e) {
        return {}
    }
}

$.ifoIPFSPoolInfo = async (pool) => {
    if(!pool) return {}
    let url = `${process.env.VUE_APP_BASE_IPFS_URL}/${pool}`
    let resp = await fetch(url, {
        method: 'get'
    })

    let text = await resp.text();
    try {
        return JSON.parse(text)
    } catch(e) {
        return {}
    }
}

$.ifoIPFS = async () => {
  let methods = getContractMethodsByName('IFOQuery')
  let res = await methods.ipfs().call()
  let url = IPFS_URL + '/' + res
  if(process.env.VUE_APP_BASE_IPFS_URL) {
    url = process.env.VUE_APP_BASE_IPFS_URL + '/' + res
  }
  console.log('ifoIPFS url:', url)
  let resp = await fetch(url, {
        method: 'get'
    })

  let text = await resp.text()
  try {
    return JSON.parse(text)
  } catch(e) {
    return []
  }
}

$.getLpValue = async (token, baseToken, amount) => {
  let methods = getContractMethodsByName('IFOQuery')
  return await methods.getLpValue(token, baseToken, amount).call()
}

$.getLpValueWithBase = async (token, baseToken, amount) => {
  let _token = token
  let _baseToken = baseToken
  if(token.toLocaleLowerCase() == $.getContractAddr('IFOBaseToken').toLocaleLowerCase()) {
    _token = baseToken
    _baseToken = token
  }
  return await $.getLpValue(_token, _baseToken, amount).call()
}

$.getDemaxLpUSDValue = async (lpToken, amount) => {
  let methods = getContractMethodsByName('IFOQuery')
  return await methods.getDemaxLpValue(lpToken, $.getContractAddr('IFOBaseToken'), amount).call()
}

$.getDemaxLpBurgerValue = async (lpToken, amount) => {
  let methods = getContractMethodsByName('IFOQuery')
  return await methods.getDemaxLpValue(lpToken, $.getTokenAddress('BURGER'), amount).call()
}

$.getDemaxBurgerLpUSDValue = async (lpToken, amount, burgerPrice) => {
  let usdValue = '0'
  let res = await $.getDemaxLpBurgerValue(lpToken, amount);
  if(res && res[0] > 0) {
    usdValue = new BigNumber(res[0]).shiftedBy(-1*res[1]).multipliedBy(new BigNumber(burgerPrice)).toFixed(4);
  }
  // console.log('getDemaxBurgerLpUSDValue:', usdValue, res)
  return usdValue
}

$.getDemaxXBurgerLpUSDValue = async (lpToken, amount, xBurgerPrice) => {
  console.log('getDemaxXBurgerLpUSDValue:', lpToken, $.getTokenAddress('XBurger'), amount, xBurgerPrice)
  let res = await getContractMethodsByName('IFOQuery').getDemaxLpValue(lpToken, $.getTokenAddress('XBurger'), amount).call()
  let usdValue = '0'
  if(res && res[0] > 0) {
    usdValue = new BigNumber(res[0]).shiftedBy(-1*res[1]).multipliedBy(new BigNumber(xBurgerPrice)).toFixed(4);
  }

  return usdValue
}

$.projectPoolRewardApr = async (factoryData, poolData, burgerPrice) => {
  if(factoryData.mintRate == 0 || burgerPrice ==0 || factoryData.status == 2) {
    // console.log('projectPoolRewardApr param is 0 ', poolData.lpToken0Symbol+'/'+poolData.lpToken1Symbol, factoryData.mintRate, poolData.totalStake, burgerPrice, factoryData.status)
    return '0'
  }
  let methods = getContractMethodsByName('IFOQuery')
  let burgerPair = await methods.getPair(factoryData.mintToken, $.getTokenAddress('BURGER')).call()
  // let userBalanceValue = await $.getDemaxBurgerLpUSDValue(poolData.lpToken, '1000000000000000000', burgerPrice)
  if(burgerPair == $.ZERO_ADDR) {
    // console.log('projectPoolRewardApr burgerPair: ', poolData.lpToken0Symbol+'/'+poolData.lpToken1Symbol,  burgerPair)
    return '0'
  }
  // let userBalance = '1000000000000000000'
  // if(new BigNumber(userBalance).isGreaterThan(new BigNumber(poolData.totalStake))) {
  //   userBalance = poolData.totalStake
  // }
  let pairBurgerJson = await $.getLpValue(factoryData.mintToken, $.getTokenAddress('BURGER'), '1000000000000000000')
  let pairBurgerPrice = new BigNumber(pairBurgerJson[0]).shiftedBy(-1*pairBurgerJson[1])
  let mintTokenPrice = pairBurgerPrice.multipliedBy(new BigNumber(burgerPrice))
  let aYearAmount = new BigNumber(factoryData.mintRate).shiftedBy(-1*factoryData.mintTokenDecimals).div($.getBlockSpanTime()).multipliedBy(24*3600*365)
  aYearAmount = aYearAmount.multipliedBy(poolData.weight).div(factoryData.totalWeight)
  // aYearAmount = aYearAmount.multipliedBy(userBalance).div(poolData.totalStake)
  let earned = aYearAmount.multipliedBy(mintTokenPrice)
  if(poolData.totalStakeValue > 0) {
    // console.log('projectPoolRewardApr earned is ', poolData.lpToken0Symbol+'/'+poolData.lpToken1Symbol, earned.toFixed(), pairBurgerPrice.toFixed(), burgerPrice)
    return earned.div(new BigNumber(poolData.totalStakeValue)).multipliedBy(100).toFixed(2)
  }
  // console.log('projectPoolRewardApr earned is earned ', poolData.lpToken0Symbol+'/'+poolData.lpToken1Symbol, earned.toFixed(), mintTokenPrice.toFixed(), pairBurgerPrice.toFixed(), burgerPrice, aYearAmount.toFixed())
  return earned.toFixed(2)
}

$._post = async (url, params) =>{
  return $http.post(url, params);
}

$.getBurgerPairApr = async(pair) => {
  let aprTotal = 0;
  try {
    let res = await $._post(Web3Provider.getOpenApiUrl()+'/market/pair/aprs', {pairIDs: [pair]});

    if (res && res.data && res.code === 2000) {
      if (res.data[0]) {
        let profit = res.data[0].aprMining ? new BigNumber(res.data[0].aprMining).times(100).toFixed(2, 1) : 0;
        let fee = res.data[0].aprTransaction ? new BigNumber(res.data[0].aprTransaction).times(100).toFixed(2, 1) : 0;
        aprTotal = new BigNumber(fee).plus(new BigNumber(profit)).toFixed(2, 1);
      }
    }
  } finally {}
  return aprTotal
}

$.projectFactoryList = async () => {
  let methods = getContractMethodsByName('DemaxProjectQuery')
  let list = await methods.iterateReverseFactoryList(1000, 0).call()
  let nowBlock = await $.getBlockNumber()
  let data = []
  for (let res of list) {
    let d = Object.assign({}, res)
    d.startBlockTime = $.getBlockToTimes(nowBlock, res.startBlock)
    d.finishBlockTime = $.getBlockToTimes(nowBlock, res.finishBlock)
    const time = new Date().getTime();
    if (d.finishBlock == 0) {
      d.status = 0
    } else {
      d.status = time <= d.finishBlockTime ? 1 : 2;
    }
    $.projectFactories[d.factory.toLocaleLowerCase()] = d
    if(!d.disabled) {
      // if(!d.disabled && d.finishBlock > 0) {
      data.push(d)
    }
  }
  return data
}

$._projectPoolWrap = async (factoryData, item, burgerPrice) => {
  let d = Object.assign({}, item)
  if($.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'].hasOwnProperty(item.pool.toLocaleLowerCase())) {
    Object.assign($.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][item.pool.toLocaleLowerCase()] , item)
    d = $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][item.pool.toLocaleLowerCase()]
  }
  d.rate = new BigNumber(d.weight).div(1000).toFixed(0)
  d.apr = d.apr ? d.apr : '--'
  d.totalStakeValue = d.totalStakeValue ? d.totalStakeValue : '--'
  $.projectPools[d.pool.toLocaleLowerCase()] = d
  if(!d.disabled) {
    $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][d.pool.toLocaleLowerCase()] = d
    $.projectPoolUpdate(factoryData, d, burgerPrice)
  } else {
    delete $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][d.pool.toLocaleLowerCase()]
  }
  return d;
}

$.projectPoolList = async (factoryData) => {
  let methods = getContractMethodsByName('DemaxProjectQuery')
  let list = await methods.getPoolList(factoryData.factory).call({from: getSelectedAddress()})
  $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'] = {}
  let burgerPrice = await $.getBurgerPrice()
  console.log('burgerPrice:', burgerPrice)
  let data = []
  for (let item of list) {
    let d = await $._projectPoolWrap(factoryData, item, burgerPrice)
    if(!d.disabled) {
      data.push($.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][d.pool.toLocaleLowerCase()])
    }
  }

  function compare(p){
    return function(m,n){
        var a = m[p];
        var b = n[p];
        return Number(b) - Number(a);
    }
  }
  data.sort(compare("order"));
  for (let d of data) {
    $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][d.pool.toLocaleLowerCase()] = d
  }
  return data
}

$.projectPoolUpdate = async (factoryData, poolData, burgerPrice) => {
  $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][poolData.pool.toLocaleLowerCase()].totalStakeValue = new BigNumber($.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][poolData.pool.toLocaleLowerCase()].totalStakeValue).shiftedBy(-18).toFixed(2)

  let mintRewardApr = await $.projectPoolRewardApr(factoryData, poolData, burgerPrice)
  let pair = await $.getSwapPair(poolData.lpToken0, poolData.lpToken1);
  let burgerApr = await $.getBurgerPairApr(pair);
  let totalApr = Number(mintRewardApr) + Number(burgerApr);
  // console.log('apr====>', poolData.lpToken0Symbol+'/'+poolData.lpToken1Symbol, Number(mintRewardApr), Number(burgerApr))
  $.projectFactories[factoryData.factory.toLocaleLowerCase()]['pools'][poolData.pool.toLocaleLowerCase()].apr = totalApr > 0 ? totalApr.toFixed(2) + '%' : '--'
  // console.log('projectPoolUpdate poolData:', poolData)
}

$.projectPoolSync  = async (poolAddr) => {
  let methods = getContractMethodsByName('DemaxProjectQuery')
  let item = await methods.getPoolData(poolAddr).call({from: getSelectedAddress()})
  let burgerPrice = await $.getBurgerPrice()
  await $._projectPoolWrap($.projectFactories[item.factory.toLocaleLowerCase()], item, burgerPrice)
}

$._projectUpdateWeight = async(poolAddr) => {
  if($.projectPools[poolAddr.toLocaleLowerCase()].factory.toLocaleLowerCase() != '0xc08d5Eb563BDA98672eD8A2bA93620E236b4091C'.toLocaleLowerCase()) {
    console.log('skip UpdateWeight');
    return;
  }
  console.log('UpdateWeight...');
  let url = "https://burgerswap.org/projectapi/update";
  if(window.location.host == 'dev.burgerswap.org') {
    url = "https://dev.burgerswap.org/projectapi/update";
  }
  console.log('UpdateWeight url:', url)
  let resp = await fetch(url, {
        method: 'post'
    })

  let text = await resp.text()
  console.log('_projectUpdateWeight:', text);
}

$.projectMintAll = async (poolAddr) => {
  let contract = getContract(DemaxProjectPoolABI, poolAddr);
  let res = await executeContract(contract, 'mintAll', 0, []);
  await $._projectUpdateWeight(poolAddr);
  return res;
}

$.projectAddReward = async (factory, amount, duration) => {
  let contract = getContract(DemaxProjectFactoryABI, factory)
  return await executeContract(contract, 'addReward', 0, [amount, duration])
}

$.projectQueryBurger = async (poolAddr) => {
  let contract = getContract(DemaxProjectPoolABI, poolAddr)
  return await contract.methods.queryBurger(getSelectedAddress()).call()
}

$.projectQueryReward = async (poolAddr) => {
  let contract = getContract(DemaxProjectPoolABI, poolAddr)
  return await contract.methods.queryReward(getSelectedAddress()).call()
}

$.projectStake = async (poolAddr, amount) => {
  let contract = getContract(DemaxProjectPoolABI, poolAddr)
  return await executeContract(contract, 'stake', 0, [amount])
}

$.projectWithdraw = async (poolAddr, amount) => {
  let contract = getContract(DemaxProjectPoolABI, poolAddr)
  if(amount == $.projectPools[poolAddr.toLocaleLowerCase()].userBalance) {
    return await executeContract(contract, 'exit', 0, [])
  }
  return await executeContract(contract, 'withdraw', 0, [amount])
}

$.getSwapPair = async (token0, token1) => {
  let methods = getContractMethodsByName('IFOQuery')
  return await methods.getPair(token0, token1).call()
}

$.shackDeposit = async(pid, amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  let value = 0
  if($.getZeroSymbol() == $.pools[pid].tokenSymbol) {
    value = amount
  }
  return await executeContractByName('DemaxShackChef', 'deposit', value, [pid, amount])
}

$.shackWithdraw = async(pid, amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  return await executeContractByName('DemaxShackChef', 'withdraw', 0, [pid, amount])
}

$.shackPendingReward = async(pid) => {
  return await getContractMethodsByName('DemaxShackChef').pendingReward(pid, getSelectedAddress()).call()
}

$.shackPendingEarn = async(pid) => {
  return await getContractMethodsByName('DemaxShackChef').pendingEarn(pid, getSelectedAddress()).call()
}

$.shackHarvest = async(pid) => {
  return await executeContractByName('DemaxShackChef', 'harvest', 0, [pid])
}

$.shackGetTokenUSDPrice = async (addr) => {
  let token = await $.queryToken(addr)
  if(["USDT","USDC","BUSD"].includes(token.symbol)) {
    return "1"
  }
  let contract = getContract(UniswapV2FactoryABI, $.getContractAddr('SwapFactoryForShack'))
  let pair = await contract.methods.getPair(addr, $.getTokenAddress('USDT')).call()
  return await $.getTokenPrice(pair, addr)
}

$.shackPoolRewardApr = async (poolData, shackChefData) => {
  if(shackChefData.mintPerBlock == 0 || shackChefData.totalAllocPoint == 0 || shackChefData.rewardPrice == 0) {
    // console.log('poolRewardApr param is 0 ', shackChefData, poolData.totalStake, shackChefData.rewardPrice)
    return '0'
  }

  let aYearAmount = new BigNumber(shackChefData.mintPerBlock).shiftedBy(-1*shackChefData.rewardTokenDecimals).div($.getBlockSpanTime()).multipliedBy(24*3600*365)
  aYearAmount = aYearAmount.multipliedBy(poolData.weight).div(shackChefData.totalAllocPoint)
  let earned = aYearAmount.multipliedBy(shackChefData.rewardPrice)
  if(poolData.totalStakeValue > 0) {
    // console.log('poolRewardApr earned is ', poolData.tokenSymbol+'/'+poolData.baseSymbol, earned.toFixed(), shackChefData.rewardPrice)
    return earned.div(new BigNumber(poolData.totalStakeValue)).multipliedBy(100).toFixed(2)
  }
  // console.log('poolRewardApr earned is 0 ', poolData.tokenSymbol+'/'+poolData.baseSymbol, earned.toFixed(), shackChefData.rewardPrice, aYearAmount.toFixed())
  return earned.toFixed(2)
}

let earnTokenInPools = {}
$._updateEarnTokenUserBalance = async(earnToken, depositToken, excludePid=-1) => {
  earnToken = earnToken.toLocaleLowerCase()
  depositToken = depositToken.toLocaleLowerCase()
  if(earnToken.toLocaleLowerCase() == depositToken.toLocaleLowerCase()) {
    if(!earnTokenInPools.hasOwnProperty(earnToken.toLocaleLowerCase())) {
      earnTokenInPools[earnToken.toLocaleLowerCase()] = []
    }
    if(!earnTokenInPools[earnToken.toLocaleLowerCase()].includes(excludePid)) {
      earnTokenInPools[earnToken.toLocaleLowerCase()].push(excludePid)
    }
  }

  if(earnTokenInPools.hasOwnProperty(earnToken)){
    for(let i in earnTokenInPools[earnToken]) {
      let pid = earnTokenInPools[earnToken][i]
      if(pid != excludePid) {
        $.pools[pid].userBalance = (await $.tokenBalanceOf( $.pools[pid].address, getSelectedAddress())).toFixed()
      }
    }
  }
}

$.shackGetPoolInfo = async(pid) => {
  return await getContractMethodsByName('DemaxShackChefQuery').getPoolInfo(pid, getSelectedAddress()).call()
}

let _earnTokens = {}
async function saveEarnTokens(info) {
  if(_earnTokens.hasOwnProperty(info.earnToken)) {
    return
  }
  _earnTokens[info.earnToken] = {
    address: info.earnToken,
    decimals: info.earnTokenDecimals,
    symbol: info.earnTokenSymbol,
    total: '0',
    totalValue: '0',
  }
  let res = await getContractMethodsByName('DemaxShackChefQuery').getEarnInfo(info.earnInToken).call()
  _earnTokens[info.earnToken].total = new BigNumber(res.total).shiftedBy(-1* _earnTokens[info.earnToken].decimals).toFixed()
  _earnTokens[info.earnToken].totalValue = new BigNumber(res.totalValue).shiftedBy(-18).toFixed()
}

$.shackUpdatePool = async(pid, updateUsdt=false) => {
  let info = await $.shackGetPoolInfo(pid)
  // Object.assign($.pools[pid], info)
  await saveEarnTokens(info)

  let shackChefData = await $.shackChefData()

  $.pools[pid].earnSymbol = info.earnTokenSymbol
  $.pools[pid].userBalance = new BigNumber(info.userBalance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].userAmount = new BigNumber(info.userAmount).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].userReward = new BigNumber(info.userReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
  $.pools[pid].userEarn = new BigNumber(info.userEarn).shiftedBy(-1*_earnTokens[info.earnToken].decimals).toFixed()
  $.pools[pid].totalStake = new BigNumber(info.totalStake).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].totalStakeValue = new BigNumber(info.totalStakeValue).shiftedBy(-18).toFixed()
  $.pools[pid].weight = info.weight

  $.pools[pid].depositCap = new BigNumber(info.depositCap).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].accShare = new BigNumber(info.accShare).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].pendingReward = new BigNumber(info.pendingReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
  $.pools[pid].pendingEarn = new BigNumber(info.pendingEarn).shiftedBy(-1*_earnTokens[info.earnToken].decimals).toFixed()
  $.pools[pid].pendingRewardValue = new BigNumber(info.pendingRewardValue).shiftedBy(-18).toFixed()
  $.pools[pid].pendingEarnValue = new BigNumber(info.pendingEarnValue).shiftedBy(-18).toFixed()
  $.pools[pid].userAllowance = new BigNumber(info.userAllowance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
  $.pools[pid].earnApr = new BigNumber(info.earnApr).dividedBy(100).toFixed(2)
  // apy = (1 + apr / 365 * 24 * 6) ^（365 * 24 * 6） - 1
  let earnApy = Math.pow(1+parseFloat(info.earnApr)/(10000* 365 * 24), 365 * 24) - 1
  $.pools[pid].earnApy = new BigNumber(earnApy).multipliedBy(100).toFixed(2)
  $.pools[pid].rewardApy = await $.shackPoolRewardApr($.pools[pid], shackChefData)
  await $.shackPoolRewardApr($.pools[pid], shackChefData)
  $._shackUpdateVal()
  $._updateEarnTokenUserBalance(_earnTokens[info.earnToken].address, info.depositToken, pid)
  console.log('updatePool:', $.pools[pid])
  return $.pools[pid]
}

$.shackUpdatePoolOld = async(pid, updateUsdt=false) => {
  let shackChefData = await $.shackChefData()
  let userInfo = await getContractMethodsByName('DemaxShackChef').userInfo(pid, getSelectedAddress()).call()
  let poolInfo = await getContractMethodsByName('DemaxShackChef').poolInfo(pid).call()
  let pendingUserReward = await $.shackPendingReward(pid)
  let pendingUserEarn = await $.shackPendingEarn(pid)
  let penddingReward = await getContractMethodsByName('DemaxShackChef').pendingRewardInfo(pid).call()
  let pendingEarn = await getContractMethodsByName('DemaxShackChef').pendingEarnInfo(pid).call()
  let rewardTokenDecimals = await $.getTokenDecimalsAsync($.getTokenAddress('XBurger'))
  let depositToken = await $.queryToken(poolInfo.depositToken)
  let swapToken = await getContractMethodsByName('DemaxShackChef').swapTokens(poolInfo.earnToken).call()
  let earnToken = null
  if(swapToken != $.ZERO_ADDR) {
    earnToken = await $.queryToken(swapToken)
  } else {
    earnToken = await $.queryToken(poolInfo.earnToken)
  }

  let earnTokensTotal = await getContractMethodsByName('DemaxShackChef').earnTokensTotal(poolInfo.earnToken).call()
  let canDeposit = await getContractMethodsByName('DemaxShackChef').canDeposit(pid, getSelectedAddress()).call()
  let shackPoolInfo = await getContractMethodsByName('DemaxShackChef').shackPoolInfo(pid).call()
  // console.log('shackPoolInfo:', shackPoolInfo)
  $.pools[pid].earnSymbol = earnToken.symbol
  $.pools[pid].userBalance = (await $.tokenBalanceOf(poolInfo.depositToken, getSelectedAddress())).toFixed()
  $.pools[pid].userAmount = new BigNumber(userInfo.amount).shiftedBy(-1*depositToken.decimals).toFixed()
  $.pools[pid].userReward = new BigNumber(pendingUserReward).shiftedBy(-1*rewardTokenDecimals).toFixed()
  $.pools[pid].userEarn = new BigNumber(pendingUserEarn).shiftedBy(-1*earnToken.decimals).toFixed()
  let totalStake = await getContractMethodsByName('DemaxShackChef').getDepositTokenSupply(pid).call()
  let depositTokenPrice = await $.shackGetTokenUSDPrice(poolInfo.depositToken)
  let earnTokenPrice = await $.shackGetTokenUSDPrice(earnToken.address)
  let totalStakeValue = new BigNumber(totalStake).shiftedBy(-1*depositToken.decimals).multipliedBy(depositTokenPrice).toFixed()
  $.pools[pid].totalStake = new BigNumber(totalStake).shiftedBy(-1*depositToken.decimals).toFixed()
  $.pools[pid].totalStakeValue = totalStakeValue
  $.pools[pid].weight = poolInfo.allocPoint
  $.pools[pid].canDeposit = new BigNumber(canDeposit).shiftedBy(-1*depositToken.decimals).toFixed()
  $.pools[pid].depositCap = new BigNumber(shackPoolInfo.depositCap).shiftedBy(-1*depositToken.decimals).toFixed()
  $.pools[pid].accShare = new BigNumber(shackPoolInfo.accShare).shiftedBy(-1*depositToken.decimals).toFixed()
  $.pools[pid].pendingReward = new BigNumber(penddingReward[0]).shiftedBy(-1*rewardTokenDecimals).toFixed()
  $.pools[pid].pendingEarn = new BigNumber(pendingEarn[0]).shiftedBy(-1*earnToken.decimals).toFixed()
  $.pools[pid].pendingRewardValue = new BigNumber($.pools[pid].pendingReward).multipliedBy(shackChefData.rewardPrice).toFixed()
  $.pools[pid].pendingEarnValue = new BigNumber($.pools[pid].pendingEarn).multipliedBy(earnTokenPrice).toFixed()
  $.pools[pid].earnTokensTotalValue = new BigNumber(earnTokensTotal).shiftedBy(-1*earnToken.decimals).multipliedBy(earnTokenPrice).toFixed()
  $.pools[pid].userAllowance = (await $.allowance(poolInfo.depositToken, $.getContractAddr('DemaxShackChef'))).toFixed()
  $.pools[pid].earnApr = new BigNumber(shackPoolInfo.apy).dividedBy(100).toFixed(2)
  // apy = (1 + apr / 365 * 24 * 6) ^（365 * 24 * 6） - 1
  let earnApy = Math.pow(1+parseFloat(shackPoolInfo.apy)/(10000* 365 * 24), 365 * 24) - 1
  $.pools[pid].earnApy = new BigNumber(earnApy).multipliedBy(100).toFixed(2)
  $.pools[pid].rewardApy = await $.shackPoolRewardApr($.pools[pid], shackChefData)
  await $.shackPoolRewardApr($.pools[pid], shackChefData)
  $._shackUpdateVal()
  $._updateEarnTokenUserBalance(earnToken.address, poolInfo.depositToken, pid)
  console.log('updatePool:', $.pools[pid])
  return $.pools[pid]
}

$._shackUpdateVal = async () => {
  let shackChefData = await $.shackChefData()
  let earnTokensTotal = new BigNumber(shackChefData.rewardTotalValue)
  let pendingEarnTotal = new BigNumber(0)
  let shackTvl = new BigNumber(0)
  for(let i in $.pools) {
    let d = $.pools[i]
    if(d.totalStakeValue != '--') {
      shackTvl = shackTvl.plus(new BigNumber(d.totalStakeValue))
      pendingEarnTotal = pendingEarnTotal.plus(d.pendingRewardValue).plus(d.pendingEarnValue)
    }
  }
  for(let k in _earnTokens) {
    console.log('_earnTokens tvl:', k, _earnTokens[k].totalValue)
    earnTokensTotal = earnTokensTotal.plus(_earnTokens[k].totalValue)
  }

  $.shackStatistics.tvl = shackTvl.toFixed(2)
  $.shackStatistics.earn = earnTokensTotal.plus(pendingEarnTotal).toFixed(2)
  // console.log('shackStatistics:', $.shackStatistics)
}

$.xBurgerPrice = async() => {
  let xBurgerBURGER = await $.getTokenPrice($.getTokenAddress('XBurger_BURGER'), $.getTokenAddress('XBurger'))
  let burgerUsdt = await $.getBurgerPrice()
  let price = new BigNumber(xBurgerBURGER).multipliedBy(burgerUsdt).toFixed(2)
  // let p = await $.getTokenPrice($.getTokenAddress('XBurger_USDT'), $.getTokenAddress('XBurger'))
  // console.log('xBurgerPrice:', xBurgerBURGER, burgerUsdt, price, p)
  return price
}

let _shackChefData = null
$.shackChefData = async(force = false) => {
  let data = {
    rewardPrice: 0,
    rewardToken: '',
    mintPerBlock: 0,
    totalAllocPoint: 1,
    rewardTotal: 0,
    rewardTotalValue: 0,
    rewardTokenDecimals: 18,
    rewardTokenSymbol: ''
  }
  if(!_shackChefData || force) {
    data.rewardPrice = await $.xBurgerPrice()
    let info = await getContractMethodsByName('DemaxShackChefQuery').getChefInfo().call()
    Object.assign(data, info)
    data.rewardTotal = new BigNumber(data.rewardTotal).shiftedBy(-1*data.rewardTokenDecimals).toFixed()
    data.rewardTotalValue = new BigNumber(data.rewardTotalValue).shiftedBy(-18).toFixed()
    // console.log('shackChefData:', data)
    _shackChefData = data
  }
  return _shackChefData
}

let shackPoolPidForUsdt = -1
$.shackGetPools = async() => {
  let pools = ShackPools[getNetworkVersion()]
  $.shackChefData()
  pools.forEach(async (d)=>{
    if(d.tokenSymbol === 'USDT') {
      shackPoolPidForUsdt = d.pid
    }
    d.earnApy = '--'
    d.earnApr = '--'
    d.rewardApy = '--'
    d.earnSymbol = '--'
    d.userAllowance = '0'
    d.userBalance = '--'
    d.userAmount = '--'
    d.userReward = '--'
    d.userEarn = '--'
    d.totalStake = '--'
    d.totalStakeValue = '--'
    d.pendingReward = '--'
    d.pendingEarn = '--'
    d.pendingRewardValue = '--'
    d.pendingEarnValue = '--'
    d.weight = '--'
    d.depositCap = '--'
    d.accShare = '--'
    $.pools[d.pid] = d
    $.shackUpdatePool(d.pid)
  })
  return pools
}

////// DemaxShackFarm
$.shackFarmDeposit = async(pid, amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  let value = 0
  if($.getZeroSymbol() == $.shackFarmPools[pid].tokenSymbol) {
    value = amount
  }
  return await executeContractByName('DemaxShackFarm', 'deposit', value, [pid, amount])
}

$.shackFarmWithdraw = async(pid, amount) => {
  amount = new BigNumber(amount).shiftedBy(18).toFixed()
  return await executeContractByName('DemaxShackFarm', 'withdraw', 0, [pid, amount])
}

$.shackFarmPendingReward = async(pid) => {
  return await getContractMethodsByName('DemaxShackFarm').pendingReward(pid, getSelectedAddress()).call()
}

$.shackFarmPendingReward2 = async(pid) => {
  return await getContractMethodsByName('DemaxShackFarm').pendingReward2(pid, getSelectedAddress()).call()
}

$.shackFarmHarvest = async(pid) => {
  return await executeContractByName('DemaxShackFarm', 'harvest', 0, [pid])
}

$.shackFarmGetTokenUSDPrice = async (addr) => {
  let token = await $.queryToken(addr)
  if(["USDT","USDC","BUSD"].includes(token.symbol)) {
    return "1"
  }
  try {
    let pair = await getContractMethodsByName('DemaxFactory').getPair(addr, $.getTokenAddress('USDT')).call()
    console.log('shackFarmGetTokenUSDPrice:', pair, addr, $.getTokenAddress('USDT'))
    return await $.getTokenPrice(pair, addr)
  } catch(e) {
    console.error('shackFarmGetTokenUSDPrice except:', addr, $.getTokenAddress('USDT'), e)
    return '0'
  }

}

$.shackFarmPoolRewardApr = async (poolData, shackFarmChefData) => {
  if(shackFarmChefData.mintPerBlock == 0 || shackFarmChefData.totalAllocPoint == 0 || shackFarmChefData.totalSupply == 0 || shackFarmChefData.rewardPrice == 0) {
    // console.log('poolRewardApr param is 0 ', shackFarmChefData, poolData.totalStake, shackFarmChefData.rewardPrice)
    return '0'
  }
  let burgerApr = '0';
  if(poolData.tokenType==2){
    let contract = getContract(DemaxLPABI, poolData.address)
    let tokenA = await contract.methods.tokenA().call()
    let tokenB = await contract.methods.tokenB().call()
    let pair = await $.getSwapPair(tokenA, tokenB)
    burgerApr = await $.getBurgerPairApr(pair)
  }
  // console.log('burgerApr:', burgerApr)

  let rewardTokenDecimals = await $.getTokenDecimalsAsync($.getTokenAddress('XBurger'))
  let aYearAmount = new BigNumber(shackFarmChefData.mintPerBlock).shiftedBy(-1*rewardTokenDecimals).div($.getBlockSpanTime()).multipliedBy(24*3600*365)
  aYearAmount = aYearAmount.multipliedBy(poolData.weight).div(shackFarmChefData.totalAllocPoint)
  let earned = aYearAmount.multipliedBy(shackFarmChefData.rewardPrice)
  let apy = earned.toFixed(2)
  if(poolData.totalStakeValue > 0) {
    // console.log('poolRewardApr earned is ', poolData.tokenSymbol+'/'+poolData.baseSymbol, earned.toFixed(), shackFarmChefData.rewardPrice)
    apy = earned.div(new BigNumber(poolData.totalStakeValue)).multipliedBy(100).toFixed(2)
  }
  return new BigNumber(burgerApr).plus(apy).toFixed(2)
}

let shackFarmTokens = {}
$._updateShackFarmTokenUserBalance = async(rewardToken, depositToken, excludePid=-1) => {
  rewardToken = rewardToken.toLocaleLowerCase()
  depositToken = depositToken.toLocaleLowerCase()
  if(rewardToken.toLocaleLowerCase() == depositToken.toLocaleLowerCase()) {
    if(!shackFarmTokens.hasOwnProperty(rewardToken.toLocaleLowerCase())) {
      shackFarmTokens[rewardToken.toLocaleLowerCase()] = []
    }
    if(!shackFarmTokens[rewardToken.toLocaleLowerCase()].includes(excludePid)) {
      shackFarmTokens[rewardToken.toLocaleLowerCase()].push(excludePid)
    }
  }
  if(shackFarmTokens.hasOwnProperty(rewardToken)){
    for(let i in shackFarmTokens[rewardToken]) {
      let pid = shackFarmTokens[rewardToken][i]
      if(pid != excludePid) {
        $.shackFarmPools[pid].userBalance = (await $.tokenBalanceOf( $.shackFarmPools[pid].address, getSelectedAddress())).toFixed()
      }
    }
  }
}

$.shackFarmUpdatePool = async(pid, updateUsdt=false) => {
  let shackFarmChefData = await $.shackFarmChefData()
  let userInfo = await getContractMethodsByName('DemaxShackFarm').userInfo(pid, getSelectedAddress()).call()
  let poolInfo = await getContractMethodsByName('DemaxShackFarm').poolInfo(pid).call()
  // console.log('poolInfo:', poolInfo)
  let pendingUserReward = await $.shackFarmPendingReward(pid)
  let pendingUserReward2 = await $.shackFarmPendingReward2(pid)
  let rewardTokenDecimals = await $.getTokenDecimalsAsync($.getTokenAddress('XBurger'))
  let depositToken = await $.queryToken(poolInfo.depositToken)
  let rewardToken = await $.queryToken(shackFarmChefData.rewardToken)
  let rewardToken2 = await $.queryToken($.getTokenAddress('BURGER'))
  $.shackFarmPools[pid].rewardSymbol = rewardToken.symbol
  $.shackFarmPools[pid].reward2Symbol = rewardToken2.symbol
  $.shackFarmPools[pid].userBalance = (await $.tokenBalanceOf(poolInfo.depositToken, getSelectedAddress())).toFixed()
  $.shackFarmPools[pid].userAmount = new BigNumber(userInfo.amount).shiftedBy(-1*depositToken.decimals).toFixed()
  $.shackFarmPools[pid].userReward = new BigNumber(pendingUserReward).shiftedBy(-1*rewardTokenDecimals).toFixed()
  $.shackFarmPools[pid].userReward2 = new BigNumber(pendingUserReward2).shiftedBy(-1*rewardToken2.decimals).toFixed()
  let totalStake = poolInfo.depositTokenSupply
  let totalStakeValue = '0'
  if($.shackFarmPools[pid].tokenType == 1) {
    let depositTokenPrice = '0'//await $.shackFarmGetTokenUSDPrice(poolInfo.depositToken)
    if(poolInfo.depositToken.toLocaleLowerCase()==rewardToken.address.toLocaleLowerCase()) {
      depositTokenPrice = shackFarmChefData.rewardPrice
    } else if(poolInfo.depositToken.toLocaleLowerCase()==rewardToken2.address.toLocaleLowerCase()) {
      depositTokenPrice = shackFarmChefData.reward2Price
    } else {
      depositTokenPrice = await $.shackFarmGetTokenUSDPrice(poolInfo.depositToken)
    }

    totalStakeValue = new BigNumber(totalStake).shiftedBy(-1*depositToken.decimals).multipliedBy(depositTokenPrice).toFixed(2)
  } else {
    totalStakeValue = await $.getDemaxXBurgerLpUSDValue(poolInfo.depositToken, totalStake, shackFarmChefData.rewardPrice)
  }

  $.shackFarmPools[pid].totalStake = new BigNumber(totalStake).shiftedBy(-1*depositToken.decimals).toFixed()
  $.shackFarmPools[pid].totalStakeValue = totalStakeValue
  $.shackFarmPools[pid].weight = poolInfo.allocPoint
  $.shackFarmPools[pid].userAllowance = (await $.allowance(poolInfo.depositToken, $.getContractAddr('DemaxShackFarm'))).toFixed()
  $.shackFarmPools[pid].apy = await $.shackFarmPoolRewardApr($.shackFarmPools[pid], shackFarmChefData)
  await $.shackFarmPoolRewardApr($.shackFarmPools[pid], shackFarmChefData)
  $._updateShackFarmTokenUserBalance(rewardToken.address, poolInfo.depositToken, pid)
  $._updateShackFarmTokenUserBalance(rewardToken2.address, poolInfo.depositToken, pid)
  // console.log('updatePool:', $.shackFarmPools[pid])
  return $.shackFarmPools[pid]
}

let _shackFarmChefData = null
$.shackFarmChefData = async() => {
  let rewardPrice = await $.xBurgerPrice()
  let reward2Price = await $.getBurgerPrice()
  if(!_shackFarmChefData) {
    _shackFarmChefData = {
      totalAllocPoint: await getContractMethodsByName('DemaxShackFarm').totalAllocPoint().call(),
      mintPerBlock: await getContractMethodsByName('DemaxShackFarm').mintPerBlock().call(),
      rewardTotal: await getContractMethodsByName('DemaxShackFarm').rewardTotal().call(),
      reward2Total: await getContractMethodsByName('DemaxShackFarm').reward2Total().call(),
      rewardToken: await getContractMethodsByName('DemaxShackFarm').rewardToken().call(),
      rewardPrice: rewardPrice,
      reward2Price: reward2Price,
    }
  }
  return _shackFarmChefData
}

$.shackFarmGetPools = async() => {
  let pools = ShackFarmPools[getNetworkVersion()]
  pools.forEach(async (d)=>{
    d.apy = '--'
    d.rewardSymbol = '--'
    d.reward2Symbol = '--'
    d.userAllowance = '0'
    d.userBalance = '--'
    d.userAmount = '--'
    d.userReward = '--'
    d.userReward2 = '--'
    d.totalStake = '--'
    d.totalStakeValue = '--'
    d.weight = '--'
    $.shackFarmPools[d.pid] = d
    $.shackFarmUpdatePool(d.pid)
  })
  return pools
}


export default InpageProvider
