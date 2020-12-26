import { mainnet } from './configs/mainnet'
import { testnet } from './configs/testnet'
import * as Utils from './utils'
import { OperationCanceledException } from 'typescript'

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
                senderData = await Utils.getEthData(this.configs, senderAddress, 0).then((res) => {
                    return res
                })
            } else if (senderType == TYPE.ONE) {
                senderData = await Utils.getHmyData(this.configs.hmyConfig.nodeURL, senderAddress).then((res) => {
                    return res
                })
            }

            if (!senderData) {
                throw OperationCanceledException
            }

            let receiverData: any

            if (receiverType == TYPE.ETH) {
                receiverData = await Utils.getEthData(this.configs, receiverAddress, 0).then((res) => {
                    return res
                })
            } else if (receiverType == TYPE.ONE) {
                receiverData = await Utils.getHmyData(this.configs.hmyConfig.nodeURL, receiverAddress).then((res) => {
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
                data = await Utils.getBridgeData(this.configs, senderAddress, receiverAddress, "eth_to_one").then(res => {
                    return res
                })
            } else if (senderType == TYPE.ONE && receiverType == TYPE.ETH) {
                data = await Utils.getBridgeData(this.configs, receiverAddress, senderAddress, "one_to_eth").then(res => {
                    return res
                })
            }
            
            return data

        }

        sendOneToOne = async (
            privateKey: string,
            receiverAddress: string,
            amount: number,
        ) => {
            return Utils.sendOne(privateKey, receiverAddress, amount, this.configs)
        }

}   

let ds = new DynamicSalary(testnet)

ds.getTransactionData(
    TYPE.ONE,
    "one1akph3q7a0vtfzad2lau0cfvsvkrnc5fzf487ly",
    TYPE.ETH,
    "0x430506383F1Ac31F5FdF5b49ADb77faC604657B2", 
).then((data) => {
    console.log(data)
})

ds.sendOneToOne(
    "0x936224fc6acd1d8e4dab100c054ed7305acf520207b2f0c15257d570d5fd56de",
    "one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4",
    1
).then(res => {
    console.log(res)
})



    
