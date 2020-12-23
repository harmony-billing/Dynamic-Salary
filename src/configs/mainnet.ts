let ethConfig = {
    testnet: false,
    nodeURL: 'https://mainnet.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6',
    etherscanUrl: "https://api.etherscan.io",
    etherscanAPIKey: "I7K8X9VNXHVE8ZQTRY3JDKE6DR42UYBPUM",
    gasPrice: 1000000000,
    gasLimit: 150000
}

let hmyConfig = {
    testnet: false,
    nodeURL: 'https://api.s0.t.hmny.io',
    bridgeUrl: 'https://be1.bridge.hmny.io',
    gasPrice: 1000000000,
    gasLimit: 150000
}

export let mainnet = {
    ethConfig,
    hmyConfig
}