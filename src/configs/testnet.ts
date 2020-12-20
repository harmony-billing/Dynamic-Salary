let ethConfig = {
    nodeURL: 'https://kovan.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6',
    gasPrice: 1000000000,
    gasLimit: 150000
}

let hmyConfig = {
    testnet: true,
    nodeURL: 'https://api.s0.b.hmny.io',
    gasPrice: 1000000000,
    gasLimit: 150000
}

export let testnet = {
    ethConfig,
    hmyConfig
}