import { mainnet } from './configs/mainnet'
import * as Utils from './utils'
import { OperationCanceledException } from 'typescript'
const { BridgeSDK, TOKEN, EXCHANGE_MODE, STATUS } = require('bridge-sdk');
const bridgeConfigs = require('bridge-sdk/lib/configs');

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

        send = async (
            senderType: TYPE,
            privateKey: string,
            senderAddress: string,
            receiverType: TYPE,
            receiverAddress: string,
            amount: number,
            contractAddress?: string
        ) => {
            if (senderType == TYPE.ETH && receiverType == TYPE.ETH) {
                return Utils.sendEth(privateKey, receiverAddress, amount, this.configs)
            } else if (senderType == TYPE.ONE && receiverType == TYPE.ONE) {
                return Utils.sendOne(privateKey, receiverAddress, amount, this.configs)
            } else if (senderType == TYPE.ONE && receiverType == TYPE.ETH || senderType == TYPE.ETH && receiverType == TYPE.ONE) {
                const bridgeSDK = new BridgeSDK({ logLevel: 2 })

                let oneAddress: string
                let ethAddress: string

                if (this.configs.testnet) {
                    await bridgeSDK.init(bridgeConfigs.testnet)
                } else {
                    await bridgeSDK.init(bridgeConfigs.mainnet)
                }
                if (senderType == TYPE.ONE) {
                    await bridgeSDK.addOneWallet(privateKey)
                    oneAddress = senderAddress
                    ethAddress = receiverAddress
                } else if (senderType == TYPE.ETH) {
                    await bridgeSDK.addEthWallet(privateKey)
                    oneAddress = receiverAddress
                    ethAddress = senderAddress
                }

                let operationId

                let intervalId = setInterval(async () => {
                    if (operationId) {
                        const operation = await bridgeSDK.api.getOperation(operationId)
                        if (operation.status !== STATUS.IN_PROGRESS) {
                            clearInterval(intervalId)
                            process.exit()
                        }
                    }
                }, 4000)

                let exchange_mode: typeof EXCHANGE_MODE

                if (senderType == TYPE.ONE) {
                    exchange_mode = EXCHANGE_MODE.ONE_TO_ETH
                } else if (senderType == TYPE.ETH) {
                    exchange_mode = EXCHANGE_MODE.ETH_TO_ONE
                }

                try {
                    await bridgeSDK.sendToken(
                        {
                            type: exchange_mode,
                            token: TOKEN.ERC20,
                            amount: amount,
                            oneAddress: oneAddress,
                            ethAddress: ethAddress,
                            erc20Address: contractAddress
                        },
                        id => (operationId = id)
                    )
                } catch (e) {
                    console.log('Error:', e.message)
                }

                process.exit();

            }
        }

}

    
