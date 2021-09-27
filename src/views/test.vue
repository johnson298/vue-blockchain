<template>
<div class="index-wrap up-main">
  <p style="margin-bottom: 20px">WalletAddress: {{walletAddress}}</p>
    <div style="display: flex; background: #fff; justify-content: space-between;">
      <div>
        <div style="display: flex;">
          <a href="javascript:;" class="btn btn-bg" @click="connectWallet('m')">Metamask</a>&nbsp;&nbsp;
          <a href="javascript:;" class="btn btn-bg" @click="connectWallet('b')">Balance</a>&nbsp;&nbsp;
          <a href="javascript:;" class="btn btn-bg" @click="connectWallet('w')">WConnect</a>&nbsp;&nbsp;
        </div>
      </div>
    </div>
    <div style="height:20px;background: #fff;"></div>
    <div style="display: flex; background: #fff; justify-content: space-between;">
      <div>
        <a href="javascript:;" class="btn btn-bg">Config</a>&nbsp;&nbsp;
          <el-select v-model="pool" style="width: 100%;" placeholder="Select Pool">
              <el-option
                      v-for="(item,key) in poolList"
                      :key="key"
                      :label="item.supplyTokenSymbol + '/' + item.collateralTokenSymbol + item.lpToken0Symbol + '-' +item.lpToken1Symbol"
                      :value="item.pair">
                  <span>{{item.supplyTokenSymbol}} / {{item.collateralTokenSymbol}}  {{item.lpToken0Symbol}}-{{item.lpToken1Symbol}}</span>
              </el-option>
          </el-select>&nbsp;&nbsp;
          <el-input v-model="ConfigMarketFrenzy" ></el-input>
        <div style="display: flex;">
          <a href="javascript:;" class="btn btn-line" @click="getMarketFrenzy">getMarketFrenzy</a>
          <a style="margin-left:10px;" href="javascript:;" class="btn btn-line" @click="setMarketFrenzy">setMarketFrenzy</a>
        </div>
      </div>
    </div>
    <div style="height:20px;background: #fff;"></div>
    <div class="_con">
      <div>
        <a href="javascript:;" class="btn btn-bg">Common</a>
        <a href="javascript:;" class="btn btn-line" @click="string2bytes32">string2bytes32</a>
        <a href="javascript:;" class="btn btn-line" @click="keccak256">keccak256</a>
        <a href="javascript:;" class="btn btn-line" @click="numberToHex">numberToHex</a>
        <a href="javascript:;" class="btn btn-line" @click="userAgent">userAgent</a>
        <a href="javascript:;" class="btn btn-line" @click="disconnect">Logout</a>
        <a href="javascript:;" class="btn btn-line" @click="isChainConnected">isChainConnected</a>
        <a href="javascript:;" class="btn btn-line" @click="isConnected">isConnected</a>
        <a href="javascript:;" class="btn btn-line" @click="connectChain">connectChain</a>
        <a href="javascript:;" class="btn btn-line" @click="onChainStatus">onChainStatus</a>
        <a href="javascript:;" class="btn btn-line" @click="onChainChanged">onChainChanged</a>
        <a href="javascript:;" class="btn btn-line" @click="onAccountsChanged">onAccountsChanged</a>
        <a href="javascript:;" class="btn btn-line" @click="chainId">get chainId</a>

        <a href="javascript:;" class="btn btn-line" @click="balanceOf('AAAA')">balanceOf 4A</a>
        <a href="javascript:;" class="btn btn-line" @click="tokenBalanceOf('AAAA')">tokenBalanceOf 4A</a>
        <a href="javascript:;" class="btn btn-line" @click="approve('LP')">approve LP</a>
        <a href="javascript:;" class="btn btn-line" @click="approve('USDT')">approve USDT</a>
        <a href="javascript:;" class="btn btn-line" @click="approve('BUSD')">approve BUSD</a>
        <a href="javascript:;" class="btn btn-line" @click="allowance('LP')">allowance LP</a>
        <a href="javascript:;" class="btn btn-line" @click="allowance('USDT')">allowance USDT</a>
        <a href="javascript:;" class="btn btn-line" @click="allowance('BUSD')">allowance BUSD</a>

        <a href="javascript:;" class="btn btn-line" @click="getBurgerPrice">getBurgerPrice</a>
        <a href="javascript:;" class="btn btn-line" @click="getAAAAPrice2">getAAAAPrice2</a>
        <a href="javascript:;" class="btn btn-line" @click="getCokePrice">getCokePrice</a>
        <a href="javascript:;" class="btn btn-line" @click="takeBorrowPair">takeBorrowPair</a>
        <a href="javascript:;" class="btn btn-line" @click="takeLendPair">takeLendPair</a>
        <a href="javascript:;" class="btn btn-line" @click="getMasterchefPoolInfoList">getMasterchefPoolInfoList</a>

        <a href="javascript:;" class="btn btn-line" @click="tradeList">tradeList</a>
        <a href="javascript:;" class="btn btn-line" @click="pairInterests">pairInterests</a>
        <a href="javascript:;" class="btn btn-line" @click="gqlapi">gqlapi</a>
        <a href="javascript:;" class="btn btn-line" @click="getPrice">getPrice</a>
        <a href="javascript:;" class="btn btn-line" @click="getBalance">getBalance</a>
        <a href="javascript:;" class="btn btn-line" @click="takeAll">takeAll</a>
        <a href="javascript:;" class="btn btn-line" @click="mintAll">mintAll</a>
      </div>
<div>
    <a href="javascript:;" class="btn btn-bg">Loan</a>
    <a href="javascript:;" class="btn btn-line" @click="countPools">countPools</a>
    <a href="javascript:;" class="btn btn-line" @click="getPoolByIndex">getPoolByIndex</a>
    <a href="javascript:;" class="btn btn-line" @click="getPoolInfo">getPoolInfo</a>
    <a href="javascript:;" class="btn btn-line" @click="queryPoolList">queryPoolList</a>
    <a href="javascript:;" class="btn btn-line" @click="getInterests">getInterests</a>
    <a href="javascript:;" class="btn btn-line" @click="deposit">deposit</a>
    <a href="javascript:;" class="btn btn-line" @click="canReinvest">canReinvest</a>
    <a href="javascript:;" class="btn btn-line" @click="reinvest">reinvest</a>
    <a href="javascript:;" class="btn btn-line" @click="withdraw">withdraw</a>
    <a href="javascript:;" class="btn btn-line" @click="take">take</a>
    <a href="javascript:;" class="btn btn-line" @click="mint">mint</a>
    <a href="javascript:;" class="btn btn-line" @click="supplys">supplys</a>
    <a href="javascript:;" class="btn btn-line" @click="borrows">borrows</a>
    <a href="javascript:;" class="btn btn-line" @click="queryMintToken">queryMintToken</a>
    <a href="javascript:;" class="btn btn-line" @click="pledgePrice">pledgePrice</a>
    <a href="javascript:;" class="btn btn-line" @click="borrow">borrow</a>
    <a href="javascript:;" class="btn btn-line" @click="repay">repay</a>
    <a href="javascript:;" class="btn btn-line" @click="getWithdrawAmount">getWithdrawAmount</a>
    <a href="javascript:;" class="btn btn-line" @click="liquidation">liquidation</a>
    <a href="javascript:;" class="btn btn-line" @click="getMaximumBorrowAmount">getMaximumBorrowAmount</a>
    <a href="javascript:;" class="btn btn-line" @click="getCanMaxBorrowAmount">getCanMaxBorrowAmount</a>
    <a href="javascript:;" class="btn btn-line" @click="getRepayAmount">getRepayAmount</a>
    <a href="javascript:;" class="btn btn-line" @click="countBorrow">countBorrow</a>
    <a href="javascript:;" class="btn btn-line" @click="iterateBorrowInfo">iterateBorrowInfo</a>
    <a href="javascript:;" class="btn btn-line" @click="getPairConf">getPairConf</a>
    <a href="javascript:;" class="btn btn-line" @click="iterateLiquidationInfo">iterateLiquidationInfo</a>
    <a href="javascript:;" class="btn btn-line" @click="userLiquidationLength">userLiquidationLength</a>
    <a href="javascript:;" class="btn btn-line" @click="queryUserLiquidationList">queryUserLiquidationList</a>
    <a href="javascript:;" class="btn btn-line" @click="iteratePairLiquidationInfo">iteratePairLiquidationInfo</a>
    <a href="javascript:;" class="btn btn-line" @click="mintAPR">mintAPR</a>
    <a href="javascript:;" class="btn btn-line" @click="queryCake">queryCake</a>
    <a href="javascript:;" class="btn btn-line" @click="mintCake">mintCake</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Stack</a>
    <a href="javascript:;" class="btn btn-line" @click="stakeApprove">stakeApprove</a>
    <a href="javascript:;" class="btn btn-line" @click="stakeAllowance">stakeAllowance</a>
    <a href="javascript:;" class="btn btn-line" @click="stake">stake</a>
    <a href="javascript:;" class="btn btn-line" @click="unstake">unstake</a>
    <a href="javascript:;" class="btn btn-line" @click="queryStakeReward">queryStakeReward</a>
    <a href="javascript:;" class="btn btn-line" @click="mintStakeReward">mintStakeReward</a>
    <a href="javascript:;" class="btn btn-line" @click="stakeBalanceOf">stakeBalanceOf</a>
    <a href="javascript:;" class="btn btn-line" @click="mintStakeCumulation">mintStakeCumulation</a>
    <a href="javascript:;" class="btn btn-line" @click="stakeFeeCumulation">stakeFeeCumulation</a>
    <a href="javascript:;" class="btn btn-line" @click="totalStake">totalStake</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Reward</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardApprove">rewardApprove</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardAllowance">rewardAllowance</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardStake">rewardStake</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardUnStake">rewardUnStake</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardQuery">rewardQuery</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardMint">rewardMint</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardBalance">rewardBalance</a>
    <a href="javascript:;" class="btn btn-line" @click="rewardMintAPR">rewardMintAPR</a>
    <a href="javascript:;" class="btn btn-line" @click="lpMintAPR">lpMintAPR</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Governance</a>
    <a href="javascript:;" class="btn btn-line" @click="getBallotList">getBallotList</a>
    <a href="javascript:;" class="btn btn-line" @click="approveGovernor">approveGovernor</a>
    <a href="javascript:;" class="btn btn-line" @click="allowanceGovernor">allowanceGovernor</a>
    <a href="javascript:;" class="btn btn-line" @click="createProposal">createProposal</a>
    <a href="javascript:;" class="btn btn-line" @click="voteProposal">voteProposal</a>
    <a href="javascript:;" class="btn btn-line" @click="executeProposal">executeProposal</a>
    <a href="javascript:;" class="btn btn-line" @click="claimProposal">claimProposal</a>
    <a href="javascript:;" class="btn btn-line" @click="getConfigCommon">getConfigCommon</a>
    <a href="javascript:;" class="btn btn-line" @click="getConfigPools">getConfigPools</a>
    <a href="javascript:;" class="btn btn-line" @click="countConfig">countConfig</a>
    <a href="javascript:;" class="btn btn-line" @click="getConfigCommonValues">getConfigCommonValues</a>
    <a href="javascript:;" class="btn btn-line" @click="getConfigPoolValues">getConfigPoolValues</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Shack</a>
    <a href="javascript:;" class="btn btn-line" @click="shackChefList">shackChefList</a>
    <a href="javascript:;" class="btn btn-line" @click="shackFarmList">shackFarmList</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">IFO</a>
    <a href="javascript:;" class="btn btn-line" @click="ifoList">ifoList</a>
    <a href="javascript:;" class="btn btn-line" @click="ifoIPFS">ifoIPFS</a>
    <a href="javascript:;" class="btn btn-line" @click="ifoIPFSlist">ifoIPFSlist</a>
    <a href="javascript:;" class="btn btn-line" @click="projectFactoryList">projectFactoryList</a>
    <a href="javascript:;" class="btn btn-line" @click="projectPoolList">projectPoolList</a>
    <a href="javascript:;" class="btn btn-line" @click="getDemaxLpBurgerValue">getDemaxLpBurgerValue</a>
    <a href="javascript:;" class="btn btn-line" @click="getDemaxBurgerLpUSDValue">getDemaxBurgerLpUSDValue</a>

</div>

<div>
    <a href="javascript:;" class="btn btn-bg">ERC20Token</a>   
    <el-input v-model="tokenAddress" ></el-input>
    <el-input v-model="tokenValue" ></el-input>
    <a href="javascript:;" class="btn btn-line" @click="token_subscribe">subscribe</a>
    <a href="javascript:;" class="btn btn-line" @click="token_allowance">allowance</a>
    <a href="javascript:;" class="btn btn-line" @click="token_approve">approve</a>
    <a href="javascript:;" class="btn btn-line" @click="token_balance">balance</a>
    <a href="javascript:;" class="btn btn-line" @click="token_transfer">transfer</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Prediction</a>
    <el-select v-model="predictPool" style="width: 100%;" placeholder="Select Pool">
      <el-option
              v-for="(item,key) in predictPoolList"
              :key="key"
              :label="item.name"
              :value="item.address">
          <span>{{item.name}} : {{item.address}}</span>
      </el-option>
    </el-select>&nbsp;&nbsp;
    <el-input v-model="predictValue" ></el-input>
    <a href="javascript:;" class="btn btn-line" @click="predict_getPools">getPools</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getRounds">getRounds</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getUserRound">getUserRound</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getUserRounds">getUserRounds</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_iterateUserRounds">iterateUserRounds</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_allowance">allowance</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_approve">approve</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_balance">balance</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getCurrentEpoch">getCurrentEpoch</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getRound">getRound</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getLedger">getLedger</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getIntervalBlocks">getIntervalBlocks</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_getMinBetAmount">getMinBetAmount</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_betBear">betBear</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_betBull">betBull</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_claim">claim</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_claimAll">claimAll</a>
    <a href="javascript:;" class="btn btn-line" @click="predict_subscribe">subscribe</a>
</div>
<div>
    <a href="javascript:;" class="btn btn-bg">Claim</a>
    <a href="javascript:;" class="btn btn-line" @click="claim_getPendingReward">getPendingReward</a>
    <a href="javascript:;" class="btn btn-line" @click="claim_claim">claim</a>
</div>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js"
import ChainApi from "../../static/sdk/ChainApi.js"
import GqlQuery from "../../static/sdk/GqlQuery.js"
import {mapState} from 'vuex';
import {SwapInstance} from "../assets/swap.init";
import web3Util from '../../static/sdk/Web3Util.js'

export default {
  name: 'Test',
  data () {
    return {
      walletAddress: '',
      ballots: [],
      poolList:[],
      ConfigMarketFrenzy: '',
      pool:'',
      projectFactory: {},
      predictPoolList: [],
      predictPool: '',
      predictEpoch: 0,
      predictValue: 0,
      tokenAddress: '',
      tokenValue: 0,
    }
  },
  created() {
    // // console.log(FilTokenAddr['97']);
    // console.log(ChainApi.isConnected())
    this.getAccount();
  },
  mounted() {
    this.init();
  },
  methods: {
    userAgent() {
      // console.log('userAgent:', navigator.userAgent)
      alert(navigator.userAgent)
    },
    init() {
      if (this.isConnect) {
        this.queryPoolList()
        this.predict_getPools()
      }
    },
    connectChain() {
      this.onChainChanged()
      ChainApi.connectChain()
    },
    handleChainStatus(status) {
      // console.log('test handleChainStatus:', status)
    },
    onChainStatus() {
      // console.log('onChainStatus')
      ChainApi.onChainStatus(this.handleChainStatus)
    },
    handleChainChanged(chainId) {
      // console.log('test handleChainChanged:', Number(chainId))
      if(ChainApi.web3()) {
        SwapInstance.onInit(ChainApi.web3());
      }
    },
    chainId() {
      console.warn(ChainApi.chainId)
    },
    isChainConnected() {
      // console.log('isChainConnected:', ChainApi.isChainConnected())
    },
    isConnected() {
      // console.log('isConnected:', ChainApi.isConnected())
    },
    onChainChanged() {
      // console.log('onChainChanged')
      ChainApi.onChainChanged(this.handleChainChanged)
    },
  	getAccount(){
  		ChainApi.getAccounts().then((res) => {
    		// console.log(res);
    	});
  	},
    connectWallet(type){
      // console.log('connectWallet:', type)
      ChainApi.connect(type).then((acc) => {
            this.handleNewAccounts(acc);
            SwapInstance.onInit(ChainApi.web3());
        }).finally(() => {
            // if (fn) {
            //     fn('success');
            // }
        });
    },
    disconnect(){
      ChainApi.disconnect();
    },
    onAccountsChanged() {
      // console.log('onAccountsChanged')
      ChainApi.onAccountsChanged(this.handleNewAccounts)
    },
    handleNewAccounts(newAccounts){
    	// console.log(newAccounts);
      this.walletAddress = newAccounts[0];
      // console.log('walletAddress:', this.walletAddress)
        //const is = newAccounts && newAccounts.length > 0;
        //Storage.storageSetUserName(is ? newAccounts[0] : '');
        //this.setState((state) => {
            //state.account = is ? newAccounts[0] : '';
            //return {
               // ...this.state
           // };
        //});
    },
    string2bytes32() {
      let res = web3Util.string2bytes32('PROPOSAL_VOTE_DURATION')
      // console.log('res: ', res)
      let res2 = web3Util.bytes32string('0x50524f504f53414c5f564f54455f4455524154494f4e')
      // console.log('res2: ', res)
    },
    keccak256() {
      let res = web3Util.keccak256(ChainApi.BALLOT_BYTECODE)
      console.log('res: ', res)
    },
    numberToHex() {
      let res = web3Util.numberToHex(0)
      console.log('res: ', res)
    },
    getBalance() {
      ChainApi.getBalance().then((res) => {
    		// console.log(res);
    	});
    },
    balanceOf(name) {
      ChainApi.balanceOf(ChainApi.getTokenAddress(name), this.walletAddress).then((res) => {
    		// console.log(res);
    	});
    },
    tokenBalanceOf(name){
    	ChainApi.tokenBalanceOf(ChainApi.getTokenAddress(name), this.walletAddress).then((res) => {
    		// console.log(res);
    		// console.log(res.toFixed());
    	});
    },
    getInterests() {
      ChainApi.getInterests().then((res) => {
    		// console.log(res);
    	});
    },
    countPools() {
      ChainApi.countPools().then((res) => {
    		// console.log(res);
    	});
    },
    approve(name) {
      let token = ChainApi.getTokenAddress(name)
      let platform = ChainApi.getContractAddr('AAAAPlatform')
      ChainApi.approve(token, platform).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },
    allowance(name) {
      let token = ChainApi.getTokenAddress(name)
      let platform = ChainApi.getContractAddr('AAAAPlatform')
      ChainApi.allowance(token, platform).then(res => {
        console.log(res);
        console.log(res.toFixed());
      });

    },
    stakeApprove() {
      let token = ChainApi.getTokenAddress(this.$project)
      ChainApi.approve(token, ChainApi.getContractAddr('AAAAShare')).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },
    stakeAllowance() {
      let token = ChainApi.getTokenAddress(this.$project)
      ChainApi.allowance(token, ChainApi.getContractAddr('AAAAShare')).then(res => {
        console.log(res);
        console.log(res.toFixed());
      });

    },
    getPoolByIndex() {
      ChainApi.getPoolByIndex(0).then(res => {
        console.log(res);
      });
    },
    getPoolInfo() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      ChainApi.getPoolInfo(this.pool).then(res => {
        console.log(res);
      });
    },
    deposit() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      let amount = '0.1'
      ChainApi.deposit(lendToken, collateralToken, amount).then(hash => {
            return ChainApi.awaitTransactionMined(hash)
        }).then(receipt => {
            console.log('deposit receipt:', receipt)
            ChainApi.elogDeposit(receipt)
        }).finally(() => {
            console.log('deposit finally')
        });
    },
    reinvest() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      ChainApi.reinvest(lendToken, collateralToken).then(hash => {
            return ChainApi.awaitTransactionMined(hash)
        }).then(receipt => {
            console.log('reinvest receipt:', receipt)
            ChainApi.elogReinvest(receipt)
        }).finally(() => {
            console.log('reinvest finally')
        });
    },
    withdraw() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      let amount = '20'
      ChainApi.withdraw(lendToken, collateralToken, amount).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('withdraw receipt:', receipt);
            ChainApi.elogWithdraw(receipt)
        }).finally(() => {
            console.log('withdraw finally')
        });
    },
    borrow() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      let amountCollateral = '10'
      let expectBorrow = '0.05'
      ChainApi.borrow(lendToken, collateralToken, amountCollateral, expectBorrow).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('borrow receipt:', receipt);
            ChainApi.elogBorrow(receipt)
        }).finally(() => {
            console.log('borrow finally')
        });
    },
    repay() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      let amount = '5'
      ChainApi.repay(lendToken, collateralToken, amount).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('repay receipt:', receipt);
            ChainApi.elogRepay(receipt)
        }).finally(() => {
            console.log('repay finally')
        });
    },
    liquidation() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let lendToken = ChainApi.poolInfoMapWithPair[this.pool].supplyToken
      let collateralToken = ChainApi.poolInfoMapWithPair[this.pool].collateralToken
      ChainApi.liquidation(lendToken, collateralToken, this.walletAddress).then(hash => {
            return ChainApi.awaitTransactionMined(hash)
        }).then(receipt => {
            console.log('liquidation receipt:', receipt)
            ChainApi.elogLiquidation(receipt)
        }).finally(() => {
            console.log('liquidation finally')
        });
    },
    take() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      ChainApi.take(this.pool).then(res => {
        console.log(this.pool, res);
      });
    },
    mint() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      ChainApi.mint(this.pool).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('mint receipt:', receipt);
            ChainApi.elogMint(receipt)
        }).finally(() => {
            console.log('mint finally')
        });
    },
    takeAll() {
      ChainApi.takeAll().then(res => {
        console.log(res);
      });
    },
    mintAll() {
      ChainApi.mintAll().then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('mintAll tx:', tx);
            ChainApi.elogMintAll(tx)
        }).finally(() => {
            console.log('mintAll finally')
        });
    },
    supplys() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.supplys(pair).then(res => {
        console.log(res);
      });
    },
    borrows() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.borrows(pair).then(res => {
        console.log(res);
      });
    },
    queryMintToken() {
      ChainApi.queryMintToken().then(res => {
        console.log(res);
      });
    },
    getPrice() {
      let token = ChainApi.getTokenAddress('USDT')
      ChainApi.getPrice(token).then(res => {
        console.log('USDT:', res);
      });
      token = ChainApi.getTokenAddress('USDC')
      ChainApi.getPrice(token).then(res => {
        console.log('USDC:', res);
      });
    },
    pledgePrice() {
      for(let i in ChainApi.poolsMapWithIndex) {
        let pair = ChainApi.poolsMapWithIndex[i]
        ChainApi.pledgePrice(pair).then(res => {
          console.log('pair', i, pair, res.toFixed());
        });
      }

      // pair = ChainApi.poolsMapWithIndex[0]
      // ChainApi.pledgePrice(pair).then(res => {
      //   console.log('pair0', pair,res);
      //   console.log('pair0', pair, res.toFixed());
      // });
    },
    queryPoolList() {
      ChainApi.queryPoolList().then(res => {
        console.log(res);
        this.poolList = res
      });
    },
    getMaximumBorrowAmount() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getMaximumBorrowAmount(pair, '100').then(res => {
        console.log(res);
      });
    },
    getCanMaxBorrowAmount() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getCanMaxBorrowAmount(pair).then(res => {
        console.log(res);
      });
    },
    getRepayAmount() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getRepayAmount(pair, '100').then(res => {
        console.log(res);
      });
    },
    countBorrow() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.countBorrow(pair).then(res => {
        console.log(res);
      });
    },
    iterateBorrowInfo() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.iterateBorrowInfo(pair, 0, 5).then(res => {
        console.log(res);
      });
    },
    stake() {
      ChainApi.stake('2').then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('stake receipt:', receipt);
            ChainApi.elogStake(receipt)
        }).finally(() => {
            console.log('stake finally')
        });
    },
    unstake() {
      ChainApi.unstake('1').then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('unstake receipt:', receipt);
            ChainApi.elogUnStake(receipt)
        }).finally(() => {
            console.log('unstake finally')
        });
    },
    queryStakeReward() {
      ChainApi.queryStakeReward().then(res => {
        console.log(res);
      });
    },
    mintStakeReward() {
      ChainApi.mintStakeReward().then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('mintStakeReward receipt:', receipt);
            ChainApi.elogMintStakeReward(receipt)
        }).finally(() => {
            console.log('mintStakeReward finally')
        });
    },
    stakeBalanceOf() {
      ChainApi.stakeBalanceOf().then(res => {
        console.log(res);
      });
    },
    totalStake() {
      ChainApi.totalStake().then(res => {
        console.log(res);
      });
    },
    getPairConf() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getPairConf(pair).then(res => {
        console.log(res);
      });
    },
    iterateLiquidationInfo() {
      ChainApi.iterateLiquidationInfo(0, 0, 1).then(res => {
        console.log(res);
      });
    },
    getWithdrawAmount() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getWithdrawAmount(pair).then(res => {
        console.log(res);
      });
    },
    userLiquidationLength() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.userLiquidationLength(pair).then(res => {
        console.log(res);
      });
    },
    queryUserLiquidationList() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.queryUserLiquidationList(pair).then(res => {
        console.log(res);
      });
    },
    iteratePairLiquidationInfo() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.iteratePairLiquidationInfo(pair, 0, 5).then(res => {
        console.log(res);
      });
    },
    mintAPR() {
      ChainApi.mintAPR().then(res => {
        console.log(res);
      });
    },
    mintStakeCumulation() {
      ChainApi.mintStakeCumulation().then(res => {
        console.log(res);
        console.log(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)).toFixed())
      });
    },
    stakeFeeCumulation() {
      ChainApi.stakeFeeCumulation().then(res => {
        console.log(res);
        console.log(res.toFixed())
      });
    },
    getBurgerPrice() {
      ChainApi.getBurgerPrice().then(res => {
        console.log(res);
      });
    },
    getAAAAPrice2() {
      ChainApi.getAAAAPrice2().then(res => {
        console.log(res);
        console.log(res.toFixed());
      });
    },
    getCokePrice() {
      ChainApi.getCokePrice().then(res => {
        console.log(res);
        console.log(res.toFixed());
      });
    },
    takeBorrowPair() {
      ChainApi.takeBorrowPair().then(res => {
        console.log(res);
      });
    },
    takeLendPair() {
      ChainApi.takeLendPair().then(res => {
        console.log(res);
      });
    },
    canReinvest() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.canReinvest(pair).then(res => {
        console.log(res);
      });
    },
    rewardApprove() {
      let token = ChainApi.getTokenAddress('BURGER')
      ChainApi.approve(token, ChainApi.getContractAddr('AAAAReward')).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },
    rewardAllowance() {
      let token = ChainApi.getTokenAddress('BURGER')
      ChainApi.allowance(token, ChainApi.getContractAddr('AAAAReward')).then(res => {
        console.log(res);
        console.log(res.toFixed());
      });

    },
    rewardStake() {
      ChainApi.rewardStake('2').then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('rewardStake receipt:', receipt);
            ChainApi.elogRewardStake(receipt)
        }).finally(() => {
            console.log('rewardStake finally')
        });
    },
    rewardUnStake() {
      ChainApi.rewardUnStake('1').then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('rewardUnStake receipt:', receipt);
            ChainApi.elogRewardUnStake(receipt)
        }).finally(() => {
            console.log('rewardUnStake finally')
        });
    },
    rewardQuery() {
      ChainApi.rewardQuery().then(res => {
        console.log(res);
      });
    },
    rewardMint() {
      ChainApi.rewardMint().then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('rewardMint receipt:', receipt);
            ChainApi.elogRewardMint(receipt)
        }).finally(() => {
            console.log('rewardMint finally')
        });
    },
    rewardBalance() {
      ChainApi.rewardBalance().then(res => {
        console.log(res);
      });
    },
    lpMintAPR() {
      ChainApi.lpMintAPR().then(res => {
        console.log(res);
        console.log(res.toFixed());
      });
    },
    rewardMintAPR() {
      ChainApi.rewardMintAPR().then(res => {
        console.log(res);
        console.log(res.toFixed());
      });
    },
    getBallotList() {
        ChainApi.getBallotList(0, 10).then(res => {
          console.log(res);
          this.ballots = res.data
        });
    },
    createProposal() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      let key = web3Util.string2bytes32('POOL_MARKET_FRENZY')
      let value = '200000000000001200'
      let subject = 'subject...POOL_MARKET_FRENZY'
      let content = 'content...POOL_MARKET_FRENZY'
      ChainApi.createProposal(pool, key, value, subject, content).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('createProposal receipt:', receipt);
            ChainApi.elogCreateProposal(receipt)
        }).finally(() => {
            console.log('createProposal finally')
        });
    },
    voteProposal() {
      let ballot = this.ballots[0].ballot
      ChainApi.voteProposal(ballot, 0).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('voteProposal receipt:', receipt);
            ChainApi.elogVoteProposal(receipt)
        }).finally(() => {
            console.log('voteProposal finally')
        });
    },
    executeProposal() {
      let ballot = this.ballots[0].ballot
      ChainApi.executeProposal(ballot).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('executeProposal receipt:', receipt);
            ChainApi.elogExecuteProposal(receipt)
        }).finally(() => {
            console.log('executeProposal finally')
        });
    },
    claimProposal() {
      let ballot = this.ballots[0].ballot
      ChainApi.claimProposal(ballot).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('claimProposal receipt:', receipt);
            ChainApi.elogClaimProposal(receipt)
        }).finally(() => {
            console.log('claimProposal finally')
        });
    },
    approveGovernor() {
      let token = ChainApi.getTokenAddress(this.$project)
      ChainApi.approve(token, ChainApi.getContractAddr('AAAAGovernance')).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },
    allowanceGovernor() {
      let token = ChainApi.getTokenAddress('AAAA')
      ChainApi.allowance(token, ChainApi.getContractAddr('AAAAGovernance')).then(res => {
        console.log(res);
        console.log(res.toFixed());
      });

    },
    getConfigCommon() {
      ChainApi.getConfigCommon().then(res => {
        console.log(res);
      });
    },
    getConfigPools() {
      ChainApi.getConfigPools().then(res => {
        console.log(res);
      });
    },
    countConfig() {
      ChainApi.countConfig().then(res => {
        console.log(res);
      });
    },
    getConfigCommonValues() {
      ChainApi.getConfigCommonValues().then(res => {
        console.log(res);
      });
    },
    getConfigPoolValues() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.getConfigPoolValues(pair).then(res => {
        console.log(res);
      });
    },
    queryCake() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.queryCake(pair).then(res => {
        console.log(res);
      });
    },
    mintCake() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let pair = this.pool
      ChainApi.mintCake(pair).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('mintCake receipt:', receipt);
            ChainApi.elogMintCake(receipt)
        }).finally(() => {
            console.log('mintCake finally')
        });
    },
    getPoolValue(pair, key) {
      console.log('getPoolValue:', pair, key)
      ChainApi.getPoolValue(pair, key).then(res => {
        console.log(res);
      });
    },
    getMarketFrenzy() {
      let pair = this.pool
      if(!pair) {
        alert('Please select pool first')
        return
      }
      let key = '0x504f4f4c5f4d41524b45545f4652454e5a590000000000000000000000000000'
      console.log('getMarketFrenzy:', pair, key)
      ChainApi.getPoolValue(pair, key).then(res => {
        console.log(res)
        this.ConfigMarketFrenzy = res
      });
    },
    setMarketFrenzy() {
      let pair = this.pool
      let key = '0x504f4f4c5f4d41524b45545f4652454e5a590000000000000000000000000000'
      let val = this.ConfigMarketFrenzy
      if(!pair || !val) {
        alert('Invaild Input data')
        return
      }
      ChainApi.setPoolValue(pair, key, val).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
            console.log('setPoolValue receipt:', receipt);
        }).finally(() => {
            console.log('setPoolValue finally')
        });
    },
    getMasterchefPoolInfoList() {
      ChainApi.getMasterchefPoolInfoList(29).then(res => {
        console.log(res)
        console.log(JSON.stringify(res))
      });
    },
    tradeList() {
      let account = ChainApi.accounts[0]
      GqlQuery.tradeList(account).then(res => {
        console.log(res)
      });
    },
    pairInterests() {
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      let limit = 20
      GqlQuery.pairInterests(this.pool, limit).then(res => {
        console.log(res)
      });
    },
    gqlapi() {
      console.log(this.pool,'this.pool');
      if(!this.pool) {
        alert('please select pool, first')
        return
      }
      GqlQuery.gqlproxy(this.pool).then(res => {
        console.log(res)
        if(res) {
          let borrowHourData = {
            title:[],
            value:[]
          }
          res.borrowHourData.map((d)=> {
            borrowHourData.title.push(d.h)
            borrowHourData.value.push(d.v)
          })
          let supplyHourData = {
            title:[],
            value:[]
          }
          res.supplyHourData.map((d)=> {
            supplyHourData.title.push(d.h)
            supplyHourData.value.push(d.v)
          })
          console.log('borrowHourData:', borrowHourData)
          console.log('supplyHourData:', supplyHourData)
        }
      });
    },

    ifoList() {
      ChainApi.ifoList().then(res => {
        console.log(res)
      });
    },

    ifoIPFS() {
      ChainApi.ifoIPFS().then(res => {
        console.log(res)
      });
    },

    ifoIPFSlist(){
        ChainApi.ifoIPFSlist().then(res => {
            console.log(res)
        });
    },

    projectFactoryList() {
      ChainApi.projectFactoryList().then(res => {
        console.log(res)
        for (let d of res) {
          this.projectFactory = d;
          break;
        }
      });
    },

    projectPoolList() {
      ChainApi.projectPoolList(this.projectFactory).then(res => {
        console.log(res)
        console.log(ChainApi.projectFactories[this.projectFactory.factory.toLocaleLowerCase()]['pools'])
      });
    },
    getDemaxLpBurgerValue() {
      ChainApi.getDemaxLpBurgerValue('0x94c08dDf28839c17844c82d78025b2a0B490024b', '1000000000000000000').then(res => {
        console.log(res)
      });
    },
    getDemaxBurgerLpUSDValue() {
      ChainApi.getDemaxBurgerLpUSDValue(ChainApi.getContractAddr('ThirdBurgerUsdPair'), '1000000000000000000', '6.56').then(res => {
        console.log(res)
      });
    },

    shackChefList() {
      ChainApi.shackGetPools().then(res => {
        console.log(res)
      });
    },
    shackFarmList() {
      ChainApi.shackFarmGetPools().then(res => {
        console.log(res)
      });
    },

    // erc20 token
    token_balance() {
      if(!this.tokenAddress) {
        alert('please input address, first')
        return
      }
      ChainApi.ERC20Token(this.tokenAddress).balanceOf().then(res => {
        console.log(res)
      });
    },

    token_transfer() {
      if(!this.tokenAddress || !this.tokenValue) {
        alert('please input address and value, first')
        return
      }
      ChainApi.ERC20Token(this.tokenAddress).transfer(this.tokenValue, 1).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('transfer tx:', tx);
        }).finally(() => {
            console.log('transfer finally')
        });
    },


    token_approve() {
      if(!this.tokenAddress || !this.tokenValue) {
        alert('please input address and value, first')
        return
      }
      ChainApi.ERC20Token(this.tokenAddress).approve(this.tokenValue).then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },

    token_allowance() {
      if(!this.tokenAddress || !this.tokenValue) {
        alert('please input address and value, first')
        return
      }
      ChainApi.ERC20Token(this.tokenAddress).allowance(this.tokenValue).then(res => {
        console.log(res)
      });
    },

    token_subscribeHandle(value, eventLog) {
      console.log('token_subscribeHandle:', value, eventLog);
      //todo something
    },

    token_subscribe() {
      if(!this.tokenAddress) {
        alert('please input address, first')
        return
      }
      ChainApi.ERC20Token(this.tokenAddress).subscribe(this.token_subscribeHandle);
    },
    // predict

    predict_getPools() {
      ChainApi.pricePredictionQuery.getPools().then(res => {
        console.log(res)
        this.predictPoolList = res
      });
    },

    predict_getCurrentEpoch() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).getCurrentEpoch().then(res => {
        this.predictValue = res
        this.predictEpoch = res
        console.log(res)
      });
    },

    predict_getRound() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.pricePredictionQuery.getRound(this.predictPool, this.predictValue).then(res => {
        console.log(res)
      });
    },

    predict_getLedger() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).getLedger(this.predictValue).then(res => {
        console.log(res)
      });
    },

    predict_getIntervalBlocks() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).getIntervalBlocks(this.predictValue).then(res => {
        console.log(res)
      });
    },

    predict_getMinBetAmount() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).getMinBetAmount(this.predictValue).then(res => {
        console.log(res)
      });
    },

    predict_getRounds() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.pricePredictionQuery.getRounds(this.predictPool, [this.predictValue]).then(res => {
        console.log(res)
        this.predictPoolList = res
      });
    },

    predict_getUserRound() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.pricePredictionQuery.getUserRound(this.predictPool,this.predictValue).then(res => {
        console.log(res)
      });
    },

    predict_getUserRounds() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.pricePredictionQuery.getUserRounds(this.predictPool, [this.predictValue]).then(res => {
        console.log(res)
      });
    },

    predict_iterateUserRounds() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.pricePredictionQuery.predict_iterateUserRounds(this.predictPool,0,30).then(res => {
        console.log(res)
      });
    },

    predict_betBear() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }

      ChainApi.DemaxPricePrediction(this.predictPool).betBear(this.predictValue).then(hash => {
          console.log(hash)
          return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
          console.log('betBear receipt:', receipt);
        }).finally(() => {
          console.log('betBear finally')
        });
    },

    predict_betBull() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }

      ChainApi.DemaxPricePrediction(this.predictPool).betBull(this.predictValue).then(hash => {
          console.log(hash)
          return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
          console.log('betBull receipt:', receipt);
        }).finally(() => {
          console.log('betBull finally')
        });
    },

    predict_claim() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).claim(this.predictValue).then(hash => {
          console.log(hash)
          return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
          console.log('claim receipt:', receipt);
        }).finally(() => {
          console.log('claim finally')
        });
    },

    predict_claimAll() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).claimAll().then(hash => {
          console.log(hash)
          return ChainApi.awaitTransactionMined(hash);
        }).then(receipt => {
          console.log('claim receipt:', receipt);
        }).finally(() => {
          console.log('claim finally')
        });
    },

    predict_balance() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).balance().then(res => {
        console.log(res)
      });
    },

    predict_approve() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).approve().then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('approve tx:', tx);
        }).finally(() => {
            console.log('approve finally')
        });
    },

    predict_allowance() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).allowance().then(res => {
        console.log(res)
      });
    },

    predict_subscribeHandle(predictPool, eventLog) {
      console.log('predict_subscribeHandle:', predictPool, eventLog);
      //todo something
    },

    predict_subscribe() {
      if(!this.predictPool) {
        alert('please select pool, first')
        return
      }
      ChainApi.DemaxPricePrediction(this.predictPool).subscribe(this.predict_subscribeHandle);
    },

    // demax claim
    claim_getPendingReward() {
      ChainApi.claim.getPendingReward().then(res => {
        console.log(res)
      });
    },

    claim_claim() {
      ChainApi.claim.claim().then(hash => {
            return ChainApi.awaitTransactionMined(hash);
        }).then(tx => {
            console.log('claim tx:', tx);
        }).finally(() => {
            console.log('claim finally')
        });
    },
  },
  computed: {
    ...mapState({
      isConnect: 'isConnect',
      account: 'account'
    })
  },
  watch: {
    isConnect ()  {
      if (this.isConnect) {
        // 拿数据
        this.init()
      }
    }
  },
}
</script>
<style lang="less" scoped>


    .up-main{
        display: block;
        flex: 1;
        flex-basis: auto;
        overflow: auto;
        background-color: #ffffff;
        padding: 20px;
    }

    .btn{
        display: block;
        width: 140px;
        height: 34px;
        border-radius: 4px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .btn.btn-bg{
        color: #ffffff;
        background: linear-gradient(90deg, #22B4B5 0%, #21DAB6 100%);
    }

    .btn.btn-line{
        border: 2px solid #22B4B5;
        background: #ffffff;
        color: #22B4B5;
        line-height: 32px;
    }

    .btn-text{
        color: #22B4B5;
    }

    ._con {
        div {
            margin-bottom: 20px;
            a {
                display: inline-block;
                margin-bottom: 10px;
                margin-right: 10px;
                min-width: 140px;
                padding: 0 20px;
                width: auto;
                &:nth-of-type(1) {
                    display: block;
                    width: 140px;
                }
            }
        }
    }
</style>

