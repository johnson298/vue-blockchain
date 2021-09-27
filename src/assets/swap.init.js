import BigNumber from "bignumber.js";
import { combineLatest, from, ReplaySubject, Subject } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { Ajax as $http } from "../axios/http";
import { Constant } from "./sdk/Constant.js";
import { Web3Bounce } from "./sdk/Web3Bounce";
import { Web3BSCBurgerTransit } from "./sdk/Web3BSCBurgerTransit";
import { Web3Caller } from "./sdk/Web3Caller.js";
import { Web3Convert } from "./sdk/Web3Convert";
import { Web3Delegate } from "./sdk/Web3Delegate.js";
import { Web3DelegateBeta } from "./sdk/Web3DelegateBeta.js";
import { Web3ETHBurgerTransit } from "./sdk/Web3ETHBurgerTransit";
import { Web3Governance } from "./sdk/Web3Governance.js";
import { Web3Platform } from "./sdk/Web3Platform.js";
import { Web3Pool } from "./sdk/Web3Pool.js";
import { Web3Provider } from "./sdk/Web3Provider.js";
import { Web3Query } from "./sdk/Web3Query.js";
import { Web3Query2 } from "./sdk/Web3Query2.js";
import { Web3Query2Beta } from "./sdk/Web3Query2Beta.js";
import { Web3QueryV1 } from "./sdk/Web3QueryV1.js";
import { Web3Storage } from "./sdk/Web3Storage.js";
import { Web3TokenQuery } from "./sdk/Web3TokenQuery";
import { ETHConfig } from "./js/tokenMap";
class Swap {
  fixed = 6;
  FIXED_SWAP_ID = 2191;
  $provider = Web3Provider;
  $caller = Web3Caller;
  $query = Web3Query;
  $query2 = Web3Query2;
  $query2Beta = Web3Query2Beta;
  $queryV1 = Web3QueryV1;
  $platform = Web3Platform;
  $delegate = Web3Delegate;
  $delegateBeta = Web3DelegateBeta;
  $pool = Web3Pool;
  $constant = Constant;
  $storage = Web3Storage;
  $governance = Web3Governance;
  $transitETH = Web3ETHBurgerTransit;
  $transitBSC = Web3BSCBurgerTransit;
  $tokenQuery = Web3TokenQuery;
  $convert = Web3Convert;
  $bounce = Web3Bounce;
  accountStatusObservable = new ReplaySubject(1);
  connectStatusObservable = new ReplaySubject(1);
  handleCallbackSub = new Subject();
  chainIdObservable = new ReplaySubject(1);
  updateObservable = new Subject();
  TRANSIT_FEE = "";
  isConnected = false;
  currentInfo = {
    chain: "",
    account: ""
  };
  TRANSIT_CHAINID = {
    ETH: "1",
    BSC: "56"
  };

  get bscscan() {
    return this.$provider.getChainBrowser();
  }

  getBscscanTrade(info) {
    return `${this.bscscan}/address/${info}`;
  }

  getBscscanTx(info) {
    return `${this.bscscan}/tx/${info}`;
  }

  constructor() {
    combineLatest([this.loginStatus(), this.chainId()]).subscribe(
      ([isLogin, chainID]) => {
        if (isLogin && this.$provider.isBscNet()) {
          !this.TRANSIT_FEE &&
            SwapInstance.$transitBSC.developFee().then(fee => {
              this.TRANSIT_FEE = fee;
              // console.log(this.TRANSIT_FEE, 'this.TRANSIT_FEE');
            });
        }
      }
    );
  }

  getInfoUrl() {
    // let url = "https://info.burgerswap.org";
    let url = process.env.VUE_APP_HTTP_URL;

    if(window.location.host.indexOf('localhost') == -1) {
      url = "https://"+window.location.host;
    }
    // if (
    //   this.$provider.currentChainId &&
    //   this.$constant.InfoUrl[this.$provider.currentChainId]
    // ) {
    //   url = this.$constant.InfoUrl[this.$provider.currentChainId];
    // }
    return url;
  }

  getApiUrl() {

    let url = process.env.VUE_APP_API;
    if(window.location.host.indexOf('localhost') == -1) {
      if([42,97].includes(Number(this.$provider.currentChainId))) {
        url = "https://"+window.location.host+"/devapi";
      } else {
        url = "https://"+window.location.host+"/api";
      }
    }
    return url;
  }

  getHomeApiUrl() {
    let url = process.env.VUE_APP_HOME;
    if(window.location.host.indexOf('localhost') == -1) {
        url = "https://"+window.location.host;
    }
      if([42,97].includes(Number(this.$provider.currentChainId))) {
          url += "/devtransitapi";
      } else {
          url += "/transitapi";
      }
    return url;
  }

  onInit(web3, walletType = Constant.WalletType.MetaMask) {
    if (!Web3Provider.web3) {
      Web3Provider.newConnect(web3, walletType);
    }
    this.onChainChanged();
  }

  onChainChanged() {
    Web3Provider.initialize().then(chainID => {
        this.isConnected = true;
      this.accountStatusChange();
      this.connectStatusObservable.next(true);
      this.chainIdObservable.next(String(parseInt(chainID)));
    });
  }

  init(walletType = Constant.WalletType.MetaMask) {
    // status
    const statusArr = [
      Constant.ConnectType.AccountChange,
      Constant.ConnectType.ChainChanged
    ];
    Web3Provider.connect(walletType, async (type, data) => {
      if (type === Constant.ConnectType.ConnectSuccess) {
        this.isConnected = true;
        Web3Provider.initialize().then(chainID => {
          this.accountStatusChange();
          this.connectStatusObservable.next(true);
          this.chainIdObservable.next(String(parseInt(chainID)));
        });
      }

      if (type === Constant.ConnectType.ChainChanged) {
        this.chainIdObservable.next(String(parseInt(data)));
      }

      if (statusArr.includes(type)) {
        this.accountStatusChange();
      }
    });
  }

  updateAll() {
    return combineLatest([
      this.updateObservable,
      this.chainId(),
      this.accountStatusObservable
    ]);
  }

  chainId() {
    return this.chainIdObservable.pipe(distinctUntilChanged());
  }

  loginStatus() {
    return combineLatest([
      this.connectStatusObservable,
      this.accountStatusObservable.pipe(distinctUntilChanged())
    ]).pipe(
      map(([isConnected, isLogin]) => {
        return Boolean(isConnected && isLogin);
      })
    );
  }

  accountStatusChange() {
    this.accountStatusObservable.next(this.$provider.currentAccount);
  }

  // search token info with address []
  queryTokens(tokens) {
    return from(
      this.$tokenQuery.queryInfo(this.$provider.currentAccount, tokens)
    );
  }

  /*
    * {
      token;
      wallet?;
      spender?;
    }
    */

  getTokenInfo({ token, wallet = this.$provider.currentAccount, spender }) {
    return this.$provider.getTokenInfo(token, wallet, spender);
  }

  queryTokenList() {
    console.log('queryTokenList...')
    return this.$query.queryTokenList();
  }

  async queryFeePercent() {
    return await this.$query.queryConfig();
  }

  async checkCondition(tokenA, tokenB) {
    return await this.$platform.checkCondition(tokenA, tokenB);
  }

  async getSwapInfo({ from, to, amount, tolerance, type }) {
    // console.log({from, to, amount, tolerance, type});
    return type === "from"
      ? await this.$platform.getSwapOutInfo(from, to, amount, tolerance)
      : await this.$platform.getSwapInInfo(from, to, amount, tolerance);
  }

  _callback({ action, params }, callback) {
    const timestamp = +new Date();
    const actionKey = `${action}_${timestamp}`;
    return (code, res) => {
      this.handleCallbackSub.next({
        key: actionKey,
        action,
        timestamp,
        code,
        result: res,
        params
      });

      if (code === 1) {
        this.updateObservable.next();
        // SwapInstance.connectStatusObservable.next(true);
      }

      callback(code, res);
    };
  }

  swap(
    { describe, fromToken, toToken, amount, tolerance, time, type },
    callback
  ) {
    const callBackParams = {
      action: "swap",
      params: {
        from: fromToken.symbol,
        to: toToken.symbol,
        amount,
        describe
      }
    };

    const cbk = this._callback(callBackParams, callback);

    try {
      type === "from"
        ? this.$platform.swapOut(
            fromToken.address,
            toToken.address,
            amount,
            tolerance,
            time,
            cbk
          )
        : this.$platform.swapIn(
            fromToken.address,
            toToken.address,
            amount,
            tolerance,
            time,
            cbk
          );
    } catch (e) {
      cbk(-1, e);
    }
  }

  // approve
  approveToken(
    { amount, token, spender = this.$provider.getPlatformAddress() },
    callback
  ) {

    const callBackParams = {
      action: "approve",
      params: {
        token: token.symbol,
        describe: "Approve " + token.symbol
      }
    };

    const cbk = this._callback(callBackParams, callback);

    try {
      this.$provider.approveToken(
        spender,
        token.address,
        amount,
        token.decimals,
        cbk
      );
    } catch (e) {
      cbk(-1, e);
    }
  }

  getTransitList = () => {
    return SwapInstance.loginStatus().pipe(
      switchMap(() =>
        $http("post", this.getApiUrl() + "/getTransitList", {
          address: this.$provider.currentAccount
        })
      )
    );
  };

  getPaybackList = () => {
    return SwapInstance.loginStatus().pipe(
      switchMap(() =>
        $http("post", this.getApiUrl() + "/getPaybackList", {
          address: this.$provider.currentAccount
        })
      )
    );
  };

  getConvertList = () => {
      console.error('this.$provider.currentAccount----->', this.$provider.currentAccount)
    return SwapInstance.loginStatus().pipe(
      switchMap(() =>
        $http("POST", this.getApiUrl() + "/getConvertList", {
          address: this.$provider.currentAccount
        })
      )
    );
  };

  getConvertPrice = symbol => {
    return $http("post", this.getApiUrl() + "/getPriceForBNB", {
      symbol
    });
  };

  setEthTransit = tx => {
    return $http("post", this.getHomeApiUrl() + `/ethTransit`, {
        tx
    });
  };

  setBscPayback = tx => {
    return $http("post", this.getHomeApiUrl() + `/bscPayback`, {
        tx
    });
  };

    setEthWithdraw = tx => {
        return $http("post", this.getHomeApiUrl() + `/ethWithdraw`, {
            tx
        });
    };

    setBscWithdraw = tx => {
        return $http("post", this.getHomeApiUrl() + `/bscWithdraw`, {
            tx
        });
    };

  getEThTx = tx => {
   return $http(
       'post',
       this.getHomeApiUrl() + '/ethTx',
       {
         tx
       });
  };

  getBscTx = tx => {
    return $http(
        'post',
        this.getHomeApiUrl() + '/bscTx',
        {
          tx
        });
  };

  getRouterAddr(ver=1) {
    if (ver == 2) {
      return this.$provider.getDelegateAddress();
    }
    else if (ver == '2beta') {
      return this.$provider.getDelegateBetaAddress();
    } else {
      return this.$provider.getPlatformAddress();
    }
  }

  queryLiquidityList(ver) {
    if (ver == 1) {
      return this.loginStatus().pipe(
        switchMap( () => from(Promise.resolve({getResultCb: this.$query.queryLiquidityList, ver: "1"})))
      );
    }
    else if (ver == 2) {
      return this.loginStatus().pipe(
        switchMap( () => from(Promise.resolve({getResultCb: this.$query2.queryLiquidityList, ver: "2"})))
      );
    }
    else if (ver == '2beta') {
      return this.loginStatus().pipe(
        switchMap( () => from(Promise.resolve({getResultCb: this.$query2Beta.queryLiquidityList, ver: '2beta'})))
      );
    }
  }

  async queryNewToken(q, ver) {
    if (ver == 1) {
      return this.$query.queryNewToken(q)
    }
    else if (ver == 2) {
      return this.$query2.queryNewToken(q)
    }
    else if (ver == '2beta') {
      return this.$query2Beta.queryNewToken(q)
    }
  }

  queryPairInfo(A, B) {
    return this.$platform.queryPairInfo(A, B);
  }

  async getAmountLiquidity(A, B, amount, ver) {
    if (ver == 1) {
      return await this.$platform.getAmountLiquidity(A, B, amount);
    }
    else if (ver == 2) {
      return await this.$delegate.getAmountLiquidity(A, B, amount);
    }
    else if (ver == '2beta') {
      return await this.$delegateBeta.getAmountLiquidity(A, B, amount);
    }
  }

  addLiquidity(
    { A, B, amountA, amountB, slip, transfer_time, describe, ver },
    callback
  ) {
    const callBackParams = {
      action: "pool",
      params: {
        describe: describe
      }
    };
    const cbk = this._callback(callBackParams, callback);
    try {
      if (ver == 1) {
        this.$platform.addLiquidity(
          A,
          B,
          amountA,
          amountB,
          slip,
          transfer_time,
          cbk
        );
      }
      else if (ver == 2) {
        this.$delegate.addLiquidity(
          A,
          B,
          amountA,
          amountB,
          slip,
          transfer_time,
          cbk
        );
      }
      else if (ver == '2beta') {
        this.$delegateBeta.addLiquidity(
          A,
          B,
          amountA,
          amountB,
          slip,
          transfer_time,
          cbk
        );
      }
    } catch (e) {
      cbk(-1, e);
    }
  }

  mintReward(address, describe, ver, callback) {
    const callBackParams = {
      action: "pool",
      params: {
        describe: describe
      }
    };
    const cbk = this._callback(callBackParams, callback);
    try {
      if (ver == 1) {
        this.$platform.mintReward(address, cbk);
      }
      else if (ver == 2) {
        this.$delegate.mintReward(address, cbk);
      }
      else if (ver == '2beta') {
        this.$delegateBeta.mintReward(address, cbk);
      }
    } catch (e) {
      cbk(-1, e);
    }
  }

  removeLiquidity(
    { address, percent, slip, transfer_time, describe, ver },
    callback
  ) {
    const callBackParams = {
      action: "pool",
      params: {
        describe: describe
      }
    };

    const cbk = this._callback(callBackParams, callback);

    try {
      if (ver == 1) {
        this.$platform.removeLiquidity(
          address,
          percent,
          slip,
          transfer_time,
          cbk
        );
      }
      else if (ver == 2) {
        this.$delegate.removeLiquidity(
          address,
          percent,
          slip,
          transfer_time,
          cbk
        );
      }
      else if (ver == '2beta') {
        this.$delegateBeta.removeLiquidity(
          address,
          percent,
          slip,
          transfer_time,
          cbk
        );
      }
    } catch (e) {
      cbk(-1, e);
    }
  }

  queryFeeReward(pair) {
    const account = this.$provider.currentAccount;
    return this.$pool.queryReward(pair, account);
  }

  swapPrecondition(token) {
    return this.$platform.swapPrecondition(token);
  }

  claimReward(pair, token, describe, callback) {
    console.log("claimReward, pair:", pair);
    const callBackParams = {
      action: "pool",
      params: {
        describe: describe
      }
    };
    const cbk = this._callback(callBackParams, callback);
    try {
      this.$pool.claimReward(pair, token, cbk);
    } catch (e) {
      cbk(-1, e);
    }
  }

  BSCWithdrawTransitToken = (
    {
      sign: signature,
      transit_id: transitId,
      amount,
      token,
      name,
      symbol,
      decimals
    },
    callback
  ) => {
    console.log(
      "BSCWithdrawTransitToken:",
      signature,
      transitId,
      amount,
      token,
      name,
      symbol,
      decimals,
      this.TRANSIT_FEE
    );
    return SwapInstance.$transitBSC.withdrawTransitToken(
      signature,
      transitId,
      amount,
      token,
      name,
      symbol,
      decimals,
      this.TRANSIT_FEE,
      callback
    );
  };

  ETHWithdrawFromBSC(
    { sign: signature, payback_id: paybackId, token, amount },
    callback
  ) {
    console.log(
      "ETHWithdrawFromBSC:",
      signature,
      paybackId,
      token,
      this.$provider.currentAccount,
      amount
    );
    return this.$transitETH.withdrawFromBSC(
      signature,
      paybackId,
      token,
      amount,
      callback
    );
  }

  transitForBSC({ token, decimals, amount, isETH }, callback) {
    console.log("transitForBSC:", token, decimals, amount, isETH);
    return isETH
      ? SwapInstance.$transitETH.transitETHForBSC(amount, callback)
      : SwapInstance.$transitETH.transitForBSC(
          token,
          decimals,
          amount,
          callback
        );
  }

  bscPaybackTransit = ({ token, decimals, amount }, callback) => {
    console.log("bscPaybackTransit:", token, decimals, amount);
    return this.$transitBSC.paybackTransit(
      token,
      decimals,
      amount,
      this.TRANSIT_FEE,
      callback
    );
  };

  pairTo = address => {
    return from(this.$transitBSC.pairTo(address));
  };

  validTokens = () => {
    return from(this.$convert.validTokens());
  };

  tokenLimits = ({ address, decimals }) => {
    return this.$convert.tokenLimits(address, decimals);
  };

  convertTokenForBNB = ({ address, decimals, amount }, callback) => {
    console.log("convertTokenForBNB:", address, decimals, amount);
    return this.$convert.convertTokenForBNB(
      address,
      decimals,
      amount,
      callback
    );
  };

  convertETHForBNB = ({ amount }, callback) => {
    console.log("convertETHForBNB:", amount);
    return this.$convert.convertETHForBNB(amount, callback);
  };

  isConvert = () => {
    return from(this.$convert.isConvert(this.$provider.currentAccount));
  };

  getFSPoolDetail(id = this.FIXED_SWAP_ID) {
    // console.log(id, 'id');
    return from(this.$bounce.getFSPoolDetail(id));
  }

  fixPoolSwapV2({ id = this.FIXED_SWAP_ID, ethAmount, password }, callback) {
    return this.$bounce.fixPoolSwapV2(id, ethAmount, password, callback);
  }

  getBNBPrice() {
    return from(this.$query.getBNBPrice());
  }

  getBurn = () => {
    return this.$provider
      .getTokenInfo(this.$provider.getDGASAddress(), ETHConfig.address)
      .then(data => {
        return data.balance;
      });
  };
  // getTotalFee = () => {
  //   return $http("get", `/getGlobalInfo`);
  // };
  getTotalFee = () => {
    return $http("get", `${this.getApiUrl()}/getGlobalInfo`);
  };
}

const SwapInstance = new Swap();
window["SwapInstance"] = SwapInstance;
export { SwapInstance };
