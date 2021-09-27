import gql from "graphql-tag";
import BigNumber from "bignumber.js"
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
const host = window.location.host
console.log('host:', host)
let TRADE_LIST_URL = 'https://cokefinance.com/subgraphs/name/coke/core/'
if(host == 'localhost:8080') {
  TRADE_LIST_URL = 'http://13.212.157.81:8000/subgraphs/name/coke/core/'
}

const TRADE_LIST_GQL = gql`
  query myLog($userAddr: String) {
    waterfalls(where:{user:$userAddr,type_not:PROJECT_QUERY_POOL_INFO},first:100){
        user
        txHash
        block
        data
        contract
        type
        timestamp
    }
  }
`;

const PAIR_INTERESTS_GQL = gql`
  query pairInterests($pairAddr: String, $limit: Int) {
    waterfalls(where:{contract:$pairAddr,type:PROJECT_QUERY_POOL_INFO}, orderBy:block, orderDirection:desc, first:$limit){
        user
        txHash
        block
        data
        contract
        type
        timestamp
    }
  }
`;

const tradeClient = new ApolloClient({
    link: new HttpLink({
      uri: TRADE_LIST_URL
    }),
    cache: new InMemoryCache(),
    shouldBatch: true
  })


class HourData {
  list = {}
  genData(time, value) {
    time = parseInt(time) * 1000
    let date = new Date(time)
    let hour = date.getHours()
    let v = new BigNumber(value)
    // console.log('hour:', time, hour)
    if(this.list[hour]) {
      let h = new BigNumber(this.list[hour])
      this.list[hour] = h.plus(v).dividedBy(2).toFixed(2)
    } else {
      this.list[hour] = v.toFixed(2)
    }
  }

  getSortData() {
    let now = new Date()
    let newList = []
    let hour = now.getHours()
    for(let h in this.list) {
      let date = new Date()
      if(h > hour) {
        date.setDate(date.getDate()-1)
      }
      date.setHours(h)
      newList.push({
        t: date.getTime(),
        h: h,
        v: parseFloat(this.list[h])
      })
    }
    if(newList.length > 0) {
        newList.sort((pre, next) => {
          return false ? (next['t'] - pre['t']) : (pre['t'] - next['t'])
      })
    }
    return newList
  }

  getData() {
    return this.list
  }
}

class GqlQuery {
  static async tradeList(_user) {
    console.log('tradeList user:', _user)
    _user = _user.toLocaleLowerCase()
    let result = await tradeClient.query({
      query: TRADE_LIST_GQL,
      variables: {
        userAddr: _user
      },
      fetchPolicy: "no-cache"
    });
    // console.log('result:', result)
    if(!result || !result.data) return []
    return result.data
  }

  static async pairInterests(_pair, _limit = 10) {
    console.log('pairInterests pair:', _pair, _limit)
    _pair = _pair.toLocaleLowerCase()
    let result = await tradeClient.query({
      query: PAIR_INTERESTS_GQL,
      variables: {
        pairAddr: _pair,
        limit: _limit
      },
      fetchPolicy: "no-cache"
    });
    // console.log('result:', result)
    if(!result || !result.data) return []
    let data = []
    for(let item of result.data.waterfalls) {
      item.data = JSON.parse(item.data)
      item.data.apr = parseFloat(new BigNumber(item.data.borrowInterests).multipliedBy(365).multipliedBy(28800).shiftedBy(-18).multipliedBy(100).toFixed(2))
      item.data.apy = parseFloat(new BigNumber(item.data.supplyInterests).multipliedBy(365).multipliedBy(28800).shiftedBy(-18).multipliedBy(100).toFixed(2))
      data.push(item)
    }
    if(data.length > 0) {
      data.sort((pre, next) => {
        return false ? (parseInt(next['block']) - parseInt(pre['block'])) : (parseInt(pre['block']) - parseInt(next['block']));
    });
    }
    return data
  }

  static async gqlproxy(pair) {
    pair = pair.toLocaleLowerCase()
    let timestamp = parseInt(new Date().getTime()/1000 - (3600*25))
    let where = `where:{type:PROJECT_QUERY_POOL_INFO, contract:"${pair}", timestamp_gt:${timestamp}}, orderBy:timestamp, orderDirection:desc`
    let body = {
      query :`{
        waterfalls(${where}) {
          user
          txHash
          block
          data
          contract
          type
          timestamp
        }
      }`
    }
    console.log('body:', body)
    let res = await fetch("https://gqlproxy.cokefinance.com/coke.core", {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })

    let text = await res.text()
    let content = JSON.parse(text)
    let data = []
    let borrowHourData = new HourData()
    let supplyHourData = new HourData()
    if(content) {
      for(let item of content.data.waterfalls) {
        item.data = JSON.parse(item.data)
        data.push(item)
        borrowHourData.genData(item.timestamp, new BigNumber(item.data.borrowInterests).multipliedBy(365).multipliedBy(28800).shiftedBy(-16).toFixed(2))
        supplyHourData.genData(item.timestamp, new BigNumber(item.data.supplyInterests).multipliedBy(365).multipliedBy(28800).shiftedBy(-16).toFixed(2))
      }
    }
    
    return await {
      status: res.status,
      data: data,
      borrowHourData: borrowHourData.getSortData(),
      supplyHourData: supplyHourData.getSortData(),
    }
  }
}

export default GqlQuery