const { Harmony } = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  Unit,
} = require('@harmony-js/utils');
const {
    getAddressFromPrivateKey
} = require('@harmony-js/crypto');
const Web3 = require("web3")

export async function sendOne(senderPK, receiverAddress, amount, config) {
    let hmy = new Harmony(
        config.hmyConfig.nodeURL,
        {
            chainType: ChainType.Harmony,
            chainId: config.hmyConfig.testnet ? ChainID.HmyTestnet : ChainID.HmyMainnet
        }
    )

    hmy.wallet.addByPrivateKey(senderPK)

    let txn = hmy.transactions.newTx({
        to: receiverAddress,
        value: new Unit(amount).asOne().toWei(),
        gasLimit: config.hmyConfig.gasLimit,
        shardID: 0,
        toShardID: 0,
        gasPrice: config.hmyConfig.gasPrice
    })

    let signedTxn = await hmy.wallet.signTransaction(txn)
    let txnHash = await hmy.blockchain.sendTransaction(signedTxn)
    return txnHash.result

}

export async function sendEth(senderPK, receiverAddress, amount, config) {
    let web3 = new Web3(config.ethConfig.nodeURL)
    let senderAddress = getAddressFromPrivateKey(senderPK)

    let createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: senderAddress,
            to: receiverAddress,
            value: web3.utils.toWei(String(amount), 'ether'),
            gas: config.ethConfig.gasLimit,
            gasPrice: config.ethConfig.gasPrice
        },
        senderPK
    )

    let createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    )

    return createReceipt.transactionHash
}