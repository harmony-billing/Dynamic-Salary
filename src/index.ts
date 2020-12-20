import { mainnet } from './configs/mainnet'
import { testnet } from './configs/testnet'
import { Harmony } from "@harmony-js/core"
import {
    ChainID,
    ChainType,
    hexToNumber
} from '@harmony-js/utils'

export enum TYPE {
    ETH = "Ethereum",
    ONE = "One"
}
export class DynamicSalary {

    configs: typeof mainnet

    constructor(configs) {
        this.configs = configs
    }

    getTransactionDataFromAdresses = async (
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
            
            if (senderType == TYPE.ETH) {
                eth.blockchain
                    .getTransactionCount({
                        address: senderAddress,
                    })
                    .then((response) => {
                        console.log(hexToNumber(response.result))
                    })
            } else if (senderType == TYPE.ONE) {
                hmy.messenger.send(`{
                    "jsonrpc": "2.0",
                    "method": "hmyv2_getTransactionsHistory",
                    "params": [{
                        "address": "one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7",
                        "pageIndex": 0,
                        "pageSize": 1000,
                        "fullTx": true,
                        "txType": "ALL",
                        "order": "ASC"
                    }],
                    "id": 1
                }`)
                    .then((response) => {
                        console.log(response)
                    })
            }

            if (receiverType = TYPE.ETH) {

            } else if (receiverType = TYPE.ONE) {

            }
    }

}

let ds = new DynamicSalary(testnet)

ds.getTransactionDataFromAdresses(
    TYPE.ONE,
    "one1we0fmuz9wdncqljwkpgj79k49cp4jrt5hpy49j", 
    TYPE.ONE,
    "one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4", 
    new Date(), 
    new Date()
).then((data) => {
    console.log(data)
})