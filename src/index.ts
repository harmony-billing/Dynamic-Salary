import { mainnet } from './configs/mainnet'
import { testnet } from './configs/testnet'
import * as Data from './utils'
import { OperationCanceledException } from 'typescript'
import { Wallet } from '@harmony-js/account'
import { Messenger, HttpProvider } from '@harmony-js/network'
import {
    ChainID,
    ChainType,
    hexToNumber,
    numberToHex,
    hexToBN,
    fromWei,
    Units,
    Unit,
} from '@harmony-js/utils'
import { ContractFactory } from '@harmony-js/contract'

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
        tokenHmyContracts?: Array<any>,
        tokenEthContracts?: Array<any>
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
                data = await Data.getBridgeData(this.configs, senderAddress, receiverAddress, "eth_to_one").then(res => {
                    return res
                })
            } else if (senderType == TYPE.ONE && receiverType == TYPE.ETH) {
                data = await Data.getBridgeData(this.configs, receiverAddress, senderAddress, "one_to_eth").then(res => {
                    return res
                })
            }
            
            return data

        }

        sendOneToOne = (
            privateKey: string,
            receiverAddress: string,
            amount: number,
        ) => {
            let wallet = new Wallet(
                new Messenger(
                    new HttpProvider(this.configs.hmyConfig.nodeURL),
                    ChainType.Harmony,
                    this.configs.hmyConfig.testnet ? ChainID.HmyTestnet : ChainID.HmyMainnet
                )
            )
            let factory = new ContractFactory(wallet)
            let contractJson = require('@harmony-js/contract/Counter.json')
            let contractAddress = "0xb0e18106520d05adA2C7fcB1a95f7db5e3f28345"
            let contract = factory.createContract(contractJson.abi, contractAddress)
        
            contract.wallet.addByPrivateKey(privateKey)
        
            let gasP = { gasPrice: '0x3B9ACA00' }
            let gas2 = { gasPrice: this.configs.hmyConfig.gasPrice, gasLimit: this.configs.hmyConfig.gasLimit }
        
            let bytecode = { data: contractJson.bytecode }
        
            contract.methods.contractConstructor(bytecode).estimateGas(gasP).then(gas => {
                let gas3 = { ...gas2, gasLimit: hexToNumber(gas) }
                contract.methods.contractConstructor(bytecode).send(
                {
                    gasPrice: gas3.gasPrice,
                    value: amount,
                    gasLimit: gas3.gasLimit,
                    to: receiverAddress,
                    shardID: 0,
                    toShardID: 0,
                }).then((res) => {
                    console.log(res["transaction"])
                })
            })
        
        }

}   

let ds = new DynamicSalary(testnet)

/*ds.getTransactionData(
    TYPE.ONE,
    "one1akph3q7a0vtfzad2lau0cfvsvkrnc5fzf487ly",
    TYPE.ETH,
    "0x430506383F1Ac31F5FdF5b49ADb77faC604657B2", 
).then((data) => {
    console.log(data)
})*/

ds.sendOneToOne(
    "0x936224fc6acd1d8e4dab100c054ed7305acf520207b2f0c15257d570d5fd56de",
    "one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4",
    100000000000
)



    
