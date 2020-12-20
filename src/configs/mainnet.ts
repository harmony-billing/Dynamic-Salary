let ethConfig = {
    nodeURL: 'https://mainnet.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6',
    gasPrice: 1,
    gasLimit: 150000
}

let hmyConfig = {
    testnet: false,
    nodeURL: 'https://api.s0.t.hmny.io',
    gasPrice: 1,
    gasLimit: 150000
}

export let mainnet = {
    ethConfig,
    hmyConfig
}