import { createNamespacedHelpers } from "vuex";
import ChainApi from "../../static/sdk/ChainApi.js";
import BigNumber from "bignumber.js";
import GqlQuery from "../../static/sdk/GqlQuery.js";

export const fundPool = {
  namespaced: true,
  state: {
    currency: "",
    supply: "",
    supplyBalance: 0,
    borrowBalance: 0,
    supplyApprove: false,
    borrowApprove: false,
    dataOfBorrowChart: {
      title: [],
      value: []
    },
    dataOfSupplyChart: {
      title: [],
      value: []
    }
  },
  mutations: {
    routeParams(state, { currency, supply }) {
      state.currency = currency;
      state.supply = supply;
    },
    supplyBalance(state, val) {
      state.supplyBalance = val;
    },
    borrowBalance(state, val) {
      state.borrowBalance = val;
    },
    supplyApprove(state, val) {
      state.supplyApprove = val;
    },
    borrowApprove(state, val) {
      state.borrowApprove = val;
    },
    setChartData(state, { borrow, supply }) {
      state.dataOfBorrowChart = borrow;
      state.dataOfSupplyChart = supply;
    }
  },
  getters: {
    symbolConfig(state) {
      return state.currency.split("-");
    },
    symbol(state, getters, rootState, rootGetters) {
      return rootGetters.findPool(state.supply, state.currency);
    },
    supplyDes(state, getters) {
      return getters.symbol?.supplyTokenDecimals || 0;
    },
    borrowDes(state, getters) {
      return getters.symbol?.collateralTokenDecimals || 0;
    }
  },
  actions: {
    supplys({ getters }) {
      return ChainApi.supplys(getters.symbol.pair);
    },
    borrows({ getters }) {
      return ChainApi.borrows(getters.symbol.pair);
    },
    borrow({ getters }, { amountCollateral, expectBorrow }) {
      return ChainApi.borrow(
        getters.symbol.supplyToken,
        getters.symbol.collateralToken,
        amountCollateral,
        expectBorrow
      )
        .then(hash => {
          return ChainApi.awaitTransactionMined(hash);
        })
        .then(receipt => {
          // console.log("borrow receipt:", receipt);
          return ChainApi.elogBorrow(receipt);
        });
    },
    deposit({ getters }, value) {
      return ChainApi.deposit(
        getters.symbol.supplyToken,
        getters.symbol.collateralToken,
        value
      )
        .then(hash => {
          return ChainApi.awaitTransactionMined(hash);
        })
        .then(receipt => {
          // console.log("deposit receipt:", receipt);
          return ChainApi.elogDeposit(receipt);
        });
    },
    withdraw({ getters }, value) {
      return ChainApi.withdraw(
        getters.symbol.supplyToken,
        getters.symbol.collateralToken,
        value
      )
        .then(hash => {
          return ChainApi.awaitTransactionMined(hash);
        })
        .then(receipt => {
          // console.log("withdraw receipt:", receipt);
          return ChainApi.elogWithdraw(receipt);
        });
    },
    repay({ getters }, {value, lendValue}) {
      console.log('repay:', value, lendValue)
      return ChainApi.repay(
        getters.symbol.supplyToken,
        getters.symbol.collateralToken,
        value,
        lendValue
      ).then(hash => {
        return ChainApi.awaitTransactionMined(hash);
      });
    },
    withdrawAmount({ state }, pair) {
      return ChainApi.getWithdrawAmount(pair);
    },
    reinvest({ getters }) {
      return ChainApi.reinvest(
        getters.symbol.supplyToken,
        getters.symbol.collateralToken
      )
        .then(hash => {
          return ChainApi.awaitTransactionMined(hash);
        })
        .then(receipt => {
          console.log("reinvest receipt:", receipt);
        });
    },
    // 借
    takeBorrowPair({ getters }) {
      return ChainApi.takeBorrowPair().then(res => {
        // console.log(res, "takeBorrowPair");
        return res[getters.symbol.pair];
      });
    },
    // 存
    takeLendPair({ getters }) {
      return ChainApi.takeLendPair().then(res => {
        // console.log(res, "takeLendPair");
        return res[getters.symbol.pair];
      });
    },
    queryCake({ getters }) {
      return ChainApi.queryCake(getters.symbol.pair);
    },
    mintCake({ getters }) {
      return ChainApi.mintCake(getters.symbol.pair)
        .then(hash => {
          return ChainApi.awaitTransactionMined(hash);
        })
        .then(receipt => {
          // console.log("mintCake receipt:", receipt);
          ChainApi.elogMintCake(receipt);
        });
    },
    getMaxBorrowAmount({ getters }) {
      return ChainApi.getCanMaxBorrowAmount(getters.symbol.pair);
    },
    mintAPR({ getters }) {
      return ChainApi.mintAPR().then(aprs => {
        //挖矿年化利率
        let apyMining = new BigNumber(aprs.supply).toFixed(2);
        //原来的apy
        let apyOriginal = new BigNumber(getters.symbol.supplyInterests)
          .multipliedBy(365)
          .multipliedBy(28800)
          .shiftedBy(-getters.symbol.supplyTokenDecimals)
          .multipliedBy(100);
        //综合apy = 原来的+挖矿年化
        let comprehensiveApy = new BigNumber(apyOriginal)
          .plus(new BigNumber(aprs.supply))
          .toFixed(2);
        apyMining = apyMining < 0.01 ? "<0.01" : apyMining;
        comprehensiveApy = comprehensiveApy < 0.01 ? "<0.01" : comprehensiveApy;
        return {
          apyMining,
          comprehensiveApy
        };
      });
    },
    chartData({ commit, getters }) {
      const data = {
        borrow: {
          title: [],
          value: []
        },
        supply: {
          title: [],
          value: []
        }
      };
      return GqlQuery.gqlproxy(getters.symbol.pair).then(res => {
        // console.log(res);
        if (res) {
          res.borrowHourData.map(d => {
            data.borrow.title.push(d.h);
            data.borrow.value.push(d.v);
          });

          res.supplyHourData.map(d => {
            data.supply.title.push(d.h);
            data.supply.value.push(d.v);
          });
          commit("setChartData", data);
        }
      });
    }
  }
};

export const fundPoolHelper = createNamespacedHelpers("fundPool");
