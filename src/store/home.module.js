import { createNamespacedHelpers } from "vuex";
import { Ajax } from "@/axios/http";
import { SwapInstance } from "@/assets/swap.init";

export const home = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getRewardsInfo({ state }, address) {
      return Ajax(
          'POST',
          SwapInstance.getInfoUrl() + '/subgraphs/name/burgerswap/burgerRewards',
          { "query": "{ playerRewardsEntities(where:{id_in:[\""+address+"\"]}) { accRewardsValue, accSwapValue,rewardsAmount}}" });
      // return Ajax("POST", "/subgraphs/name/burgerswap/burgerRewards", {
      //   query:
      //     '{ playerRewardsEntities(where:{id_in:["' +
      //     address +
      //     '"]}) { accRewardsValue, accSwapValue,rewardsAmount}}'
      // });
    },
    getRewards({ state }, address) {
      let obj = {
        query:
          "{ " +
          'dailyRewardsEntities(orderBy:date,first:32,orderDirection:desc,where: {player: "' +
          address +
          '"}){ date,accSwapValue,accRewardsValue,rewardsAmount},' +
          'playerRewardsEntities(orderBy:balletCount,orderDirection:asc,where:{id_in:["1","' +
          address +
          '"]}) { balletCount, accGovValue,govAmount},' +
          'crossTokenEntities(first:1000,where:{owner:"' +
          address +
          '"}){id,owner,token{symbol,id},amount,amountUSDT},' +
          "}"
      };
      return Ajax(
        "POST",
        SwapInstance.getInfoUrl() + "/subgraphs/name/burgerswap/burgerRewards",
        // "/subgraphs/name/burgerswap/burgerRewards",
        obj
      );
      // return Ajax("POST", "/subgraphs/name/burgerswap/burgerRewards", obj);
    }
  }
};

export const homeHelper = createNamespacedHelpers("home");
