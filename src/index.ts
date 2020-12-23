import { mainnet } from './configs/mainnet'
import { testnet } from './configs/testnet'
import { Harmony } from "@harmony-js/core"
import * as Data from './utils'
let Web3 = require('web3')
import {
    ChainID,
    ChainType,
    hexToNumber
} from '@harmony-js/utils'
import { OperationCanceledException } from 'typescript'
import { EthMethods } from 'bridge-sdk/lib/blockchain/eth/EthMethods'

export enum TYPE {
    ETH = "Ethereum",
    ONE = "One"
}
export class DynamicSalary {

    configs: typeof mainnet

    constructor(configs) {
        this.configs = configs
    }

    getTransactionData = async (
        senderType: TYPE,
        senderAddress: string, 
        receiverType: TYPE,
        receiverAddress: string, 
        ) => {
            
            let data = []

            let senderData: any

            if (senderType == TYPE.ETH) {
                senderData = await Data.getEthData(this.configs, senderAddress, 0).then((res) => {
                    return res
                })
            } else if (senderType == TYPE.ONE) {
                senderData = await Data.getHmyData(this.configs.hmyConfig.nodeURL, senderAddress).then((res) => {
                    return res
                })
            }

            if (!senderData) {
                throw OperationCanceledException
            }

            let receiverData: any

            if (receiverType == TYPE.ETH) {
                receiverData = await Data.getEthData(this.configs, receiverAddress, 0).then((res) => {
                    return res
                })
            } else if (receiverType == TYPE.ONE) {
                receiverData = await Data.getHmyData(this.configs.hmyConfig.nodeURL, receiverAddress).then((res) => {
                    return res
                })
            }

            if (!receiverData) {
                throw OperationCanceledException
            }

            if (senderType == TYPE.ONE && receiverType == TYPE.ONE) {
                let max = []
                let min = []
                let from = 'from'
                let to = 'to'

                if(senderData.length > receiverData.length) {
                    max = senderData
                    min = receiverData
                } else {
                    max = receiverData
                    min = senderData
                    from = 'to'
                    to = 'from'
                }
                
                let transactions = []

                for (let i = 0; i < max.length; i++) {
                    for (let j = 0; j < min.length; j++) {
                        if (max[i][to] == min[j][to] && max[i][from] == min[j][from]) {
                            transactions.push(max[i])
                        }
                    }
                }

                transactions = transactions.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);
                })

                data = transactions


            } else if (senderType == TYPE.ETH && receiverType == TYPE.ETH) {

                let max = []
                let min = []
                let from = 'from'
                let to = 'to'
                if(senderData.length > receiverData.length) {
                    max = senderData
                    min = receiverData
                } else {
                    max = receiverData
                    min = senderData
                    from = 'to'
                    to = 'from'
                }
                
                let transactions = []

                for (let i = 0; i < max.length; i++) {
                    for (let j = 0; j < min.length; j++) {
                        if (max[i][to] == min[j][to] && max[i][from] == min[j][from]) {
                            transactions.push(max[i])
                        }
                    }
                }

                transactions = transactions.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);
                })

                data = transactions

            } else if (senderType == TYPE.ETH && receiverType == TYPE.ONE) {

            } else if (senderType == TYPE.ONE && receiverType == TYPE.ETH) {

            }

            /*receiverData.forEach(element => {
                console.log(element['to'])
            });
            let contractAddresses = [
                this.configs.ethConfig.contracts.busd,
                this.configs.ethConfig.contracts.busdManager,
                this.configs.ethConfig.contracts.erc20Manager,
                this.configs.ethConfig.contracts.link,
                this.configs.ethConfig.contracts.linkManager
            ]
            //console.log(contractAddresses)
            senderData.forEach(element => {
                //console.log(element['contractAddress'])
                if (contractAddresses.includes(element["from"])) {
                    console.log(element)
                }
            });*/
            
            return data

        }
}   

let ds = new DynamicSalary(testnet)

ds.getTransactionData(
    TYPE.ETH,
    "0x4778D03bB3E169b920Cbf826F9A931A15574fE28", 
    TYPE.ETH,
    "0x89Cb9b988ECe933becbA1001aEd98BdAa660Ef29", 
).then((data) => {
    console.log(data)
})



    
