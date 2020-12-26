const { Harmony } = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  Unit,
} = require('@harmony-js/utils');

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