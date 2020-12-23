let ethConfig = {
    testnet: true,
    nodeURL: 'https://kovan.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6',
    etherscanUrl: "https://api-kovan.etherscan.io",
    etherscanAPIKey: "I7K8X9VNXHVE8ZQTRY3JDKE6DR42UYBPUM",
    gasPrice: 1000000000,
    gasLimit: 150000
}

let hmyConfig = {
    testnet: true,
    nodeURL: 'https://api.s0.b.hmny.io',
    bridgeUrl: 'https://testnet.bridge.hmny.io:8081',
    gasPrice: 1000000000,
    gasLimit: 150000
}

export let testnet = {
    ethConfig,
    hmyConfig
}