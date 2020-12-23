import * as fetch from 'node-fetch'
import { testnet } from '../configs/testnet'

export async function getHmyData(url, address) {
    return await fetch(url,
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "hmy_getTransactionsHistory",
            params: [{
                address: address,
                pageIndex: 0,
                pageSize: 4294967295,
                fullTx: true,
                txType: "ALL",
                order: "ASC"
            }],
            id: 1
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        let exists = false
        try {
            res['result']['transaction']
            exists = true
        } catch {
            exists = false
        }
        if (exists) {
            return res['result']['transactions']
        }
    })
}

export async function getEthData(config, address, startBlock) {
    return await fetch(`${config.ethConfig.etherscanUrl}/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${config.ethConfig.etherscanAPIKey}`)
    .then((res) => {
        return res.json()
    }).then(res => {
        let exists = false
        try {
            res['result']
            exists = true
        } catch {
            exists = false
        }
        if (exists) {
            return res['result']
        }
    })
}

export async function getBridgeData(config, ethAddress, oneAddress, type) {
    return await fetch(`${config.hmyConfig.bridgeUrl}/operations/?size=100000000000000000`)
    .then(res => {
        return res.json()
    }).then(res => {
        let transactions = []
        res['content'].forEach(element => {
            if (element['type'] == type && element['ethAddress'] == ethAddress.toLowerCase() && element['oneAddress'] == oneAddress.toLowerCase()) {
                transactions.push(element)
            }
        })
        return transactions
    })
}