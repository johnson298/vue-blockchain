import Web3 from "web3"

class Web3Util {
    constructor() {
    }

    string2bytes32(val) {
        let res = Web3.utils.stringToHex(val)
        res = res + Array(67 - res.length).join('0')
        return res
    }

    keccak256(val) {
        return Web3.utils.keccak256(val)
    }

    hexToBytes(val) {
        return Web3.utils.hexToBytes(val)
    }

    hexToAscii(val) {
        return Web3.utils.hexToAscii(val);
    }

    numberToHex(val) {
        return Web3.utils.numberToHex(val);
    }
    
    getAbiEventInputs(abi, name) {
        for(let item of abi) {
            if(item.type == 'event' && item.name == name) {
                return item.inputs
            }
        }
        return null
    }
      
    encodeEventName(inputs, name) {
        if (inputs == null) {
            return null
        }
        // console.log('inputs:', inputs)
        let params = []
        inputs.map(o=>{
            params.push(o.type)
        })
        // console.log('params:', params)
        let funcName = name+'('+params.join(',')+')'
        // console.log('funcName:', funcName)
        let enFuncName = Web3.utils.sha3(funcName)
        // console.log('enFuncName:', enFuncName)
        return enFuncName
    }

    encodeEventTopic(abi, name) {
        let inputs = this.getAbiEventInputs(abi, name)
        return this.encodeEventName(inputs, name)
    }
      
    decodeEventLog(web3, inputs, data, topics) {
        data = data.substr(2)
        
        let topic = topics.slice()
        topic.splice(0, 1);
        let inputData = inputs.slice()
        // console.log('parseEventLog params:', inputs, data, topic)
        let result = web3.eth.abi.decodeLog(inputData, data, topic)
        // console.log('parseEventLog logs:', result)
        return result
    }
          
    parseEventOneLog(web3, abi, log, name) {
        // console.log('web3 parseEventOneLog:', log)
        let result = {
            eventName: null,
            hash: log.transactionHash,
            address: log.address,
            data: {}
        }
        let inputs = this.getAbiEventInputs(abi, name)
        let topic = this.encodeEventName(inputs, name)
        if(topic == log.topics[0]) {
            result.data = this.decodeEventLog(web3, inputs, log.data, log.topics)
            result.eventName = name
        }
        return result
    }
              
    findEventOneLog(web3, abi, log, names=[]) {
        let result = {
            eventName: null,
            hash: log.transactionHash,
            address: log.address,
            data: {}
        }
        for(let i=0; i<names.length; i++) {
            result = this.parseEventOneLog(web3, abi, log, names[i])
            if(result.eventName) {
                return result;
            }
        }
        return result
    }
      
    parseEventLog(web3, abi, receipt, name) {
        console.log('web3 parseEventLog:', receipt)
        let result = {
            hash: receipt.transactionHash,
            address: '',
            data: {}
        }
        for(let log of receipt.logs) {
            let inputs = this.getAbiEventInputs(abi, name)
            let topic = this.encodeEventName(inputs, name)
            if(topic == log.topics[0]) {
                result.data = this.decodeEventLog(web3, inputs, log.data, log.topics)
                result.address = log.address
                break
            }
        }
        return result
    }
      
}

var web3Util = new Web3Util();
export default web3Util;