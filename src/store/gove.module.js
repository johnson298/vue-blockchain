import { createNamespacedHelpers } from "vuex";
import { Ajax } from "@/axios/http";
import { SwapInstance } from "@/assets/swap.init";
import { Web3Provider } from "@/assets/sdk/Web3Provider";
export const governance = {
  namespaced: true,
  state: {
    tokenInfo: {},
    voteList: [],
    poolAmount: ""
  },
  getters: {
    tokenInfo(state) {
      return state.tokenInfo;
    },
    voteList(state) {
      return state.voteList;
    },
    poolAmount(state) {
      return state.poolAmount;
    }
  },
  mutations: {
    setTokenInfo(state, info) {
      state.tokenInfo = info;
    },
    setVoteList(state, list) {
      state.voteList = list;
    },
    setPoolAmount(state, amount) {
      state.poolAmount = amount;
    }
  },
  actions: {
    getGlobalInfo({ state }) {
      return SwapInstance.getTotalFee();
    },
    queryStakeInfo({ state }) {
      return SwapInstance.$query.queryStakeInfo();
    },
    getPool() {
      return SwapInstance.$governance.queryFee();
    },
    getCoinInfo({ commit }) {
      return SwapInstance.$query.queryTokenList().then(info => {
        const tokenInfo = info.find(d => Web3Provider.isDGASAddress(d.address));
        commit("setTokenInfo", tokenInfo);
        return tokenInfo;
      });
    },

    getERC20Info() {
      let tokenInfo = {};
      let testNetInfo = {};
      let tokenAddress = [];
      let tokenList = [];

      SwapInstance.$provider.connectMetaMask();
      SwapInstance.$provider.connectBinanceWallet();
      const isEthNet = SwapInstance.$provider.isEthNet();
      const isBSCScan = SwapInstance.$provider.isBscNet();
      testNetInfo = { isEthNet, isBSCScan };
      tokenAddress = SwapInstance.$provider.getContractAddress();
      const currentAccount = SwapInstance.$provider.currentAccount;

      // SwapInstance.$query.getTotalSupply().then(bal => {
      //     tokenInfo.totalSupply = bal;
      // });
      // SwapInstance.$query.getName().then(name => {
      //     tokenInfo.name = name;
      // });

      tokenInfo.address = tokenAddress;
      tokenInfo.currentAccount = currentAccount;
      return { testNetInfo, tokenInfo, tokenList };
  },

    approveTokenGOV({ state }, { totalAmount, cb }) {
      return SwapInstance.$caller.approveTokenGOV(totalAmount, (code, tx) => {
        cb(code, tx);
      });
    },
    stake({ state }, { amount, cb }) {
      return SwapInstance.$governance.stake(amount, (stake, tx) => {
        cb(stake, tx);
      });
    },
    redeem({ state }, { amount, cb }) {
      return SwapInstance.$governance.redeem(amount, (redeem, tx) => {
        cb(redeem, tx);
      });
    },
    getVoteList({ commit }) {
      return SwapInstance.$query.queryProposalList();
    },
    createGove({ state }, { selectVal, titleVal, feeVal, conVal, cb }) {
      console.log(selectVal, titleVal, feeVal, conVal);
      return SwapInstance.$governance.changeConfig(
        selectVal,
        titleVal,
        feeVal,
        conVal,
        (vote, tx) => {
          cb(vote, tx);
        }
      );
    },
    feeCumulation() {
      return SwapInstance.$pool.feeCumulation();
    },
    queryConfigInfo({ state }, val) {
      SwapInstance.$query.queryConfig().then(r => {});
      return SwapInstance.$query.queryConfigInfo(val).then(k => {
        if (Number(k.maxValue) > Number(k.span) + Number(k.currentValue)) {
          k.maxValue = Number(k.span) + Number(k.currentValue);
        }
        if (Number(k.minValue) < Number(k.currentValue) - Number(k.span)) {
          k.minValue = Number(k.currentValue) - Number(k.span);
        }
        return k;
      });
    },

    getFee() {
      return SwapInstance.$storage.params;
    },
    youVote({ state }, { address }) {
      return SwapInstance.$governance.queryProposalReward(address);
    },
    reward({ state }, { address, cb }) {
      return SwapInstance.$governance.mintProposalReward(
        address,
        (collect, tx) => {
          cb(collect, tx);
        }
      );
    },
    getUnit({ state }, { key }) {
      return (
        SwapInstance.$constant.BallotList.find(k => k.key === key)?.unit || null
      );
    },
    voteClick({ state }, { address, num, cb }) {
      return SwapInstance.$governance.vote(address, num, (vote, tx) => {
        cb(vote, tx);
      });
    },
    implement({ state }, { address, cb }) {
      return SwapInstance.$governance.auditConfig(address, (proposal, tx) => {
        cb(proposal, tx);
      });
    }
  }
};

export const governanceHelper = createNamespacedHelpers("governance");
