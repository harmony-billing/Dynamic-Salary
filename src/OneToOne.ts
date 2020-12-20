import { Wallet } from '@harmony-js/account'
const { Harmony } = require("@harmony-js/core");
import { Messenger, HttpProvider } from '@harmony-js/network'
import {
    ChainID,
    ChainType,
    hexToNumber,
    numberToHex,
    hexToBN,
    fromWei,
    Units,
    Unit
} from '@harmony-js/utils'
import { ContractFactory } from '@harmony-js/contract'
import { mainnet } from './configs/mainnet'

export let sendOneToOne = (
    privateKey: string,
    receiverAddress: string,
    amount: number,
    config: typeof mainnet
) => {
    let wallet = new Wallet(
        new Messenger(
            new HttpProvider(config.hmyConfig.nodeURL),
            ChainType.Harmony,
            config.hmyConfig.testnet ? ChainID.HmyTestnet : ChainID.HmyMainnet
        )
    )
    let factory = new ContractFactory(wallet)
    let contractJson = require('@harmony-js/contract/Counter.json')
    let contractAddress = "0xb0e18106520d05adA2C7fcB1a95f7db5e3f28345"
    let contract = factory.createContract(contractJson.abi, contractAddress)

    contract.wallet.addByPrivateKey(privateKey)

    let gasP = { gasPrice: '0x3B9ACA00' }
    let gas2 = { gasPrice: config.hmyConfig.gasPrice, gasLimit: config.hmyConfig.gasLimit }

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
            console.log(res)
        })
    })

}