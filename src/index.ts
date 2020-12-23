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
        from?: Date, 
        to?: Date
        ) => {
            let hmy = new Harmony(
                this.configs.hmyConfig.nodeURL,
                {
                    chainType: ChainType.Harmony,
                    chainId: this.configs.hmyConfig.testnet ? ChainID.HmyTestnet : ChainID.HmyMainnet
                }
            )

            let eth = new Harmony(
                this.configs.ethConfig.nodeURL,
                {
                    chainType: ChainType.Ethereum,
                    chainId: this.configs.ethConfig.testnet ? ChainID.Kovan : ChainID.EthMainnet
                }
            )
            
            let senderData = {}

            if (senderType == TYPE.ETH) {
                Data.getEthData(this.configs, senderAddress).then((res) => {
                    console.log(res)
                })
            } else if (senderType == TYPE.ONE) {
                Data.getHmyData(this.configs.hmyConfig.nodeURL, senderAddress).then((res) => {
                    senderData = res
                })
            }

            if (!senderData) {
                throw OperationCanceledException
            }

            let receiverData = {}

            if (receiverType = TYPE.ETH) {
                Data.getEthData(this.configs, senderAddress).then((res) => {
                    console.log(res)
                })
            } else if (receiverType = TYPE.ONE) {
                Data.getHmyData(this.configs.hmyConfig.nodeURL, receiverAddress).then((res) => {
                    receiverData = res
                })
            }

            if (!receiverData) {
                throw OperationCanceledException
            }
        }
    }   

let ds = new DynamicSalary(testnet)

ds.getTransactionData(
    TYPE.ETH,
    "0x4778D03bB3E169b920Cbf826F9A931A15574fE28", 
    TYPE.ONE,
    "one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4", 
    new Date(), 
    new Date()
).then((data) => {
    console.log(data)
})



    
