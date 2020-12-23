let ethConfig = {
    testnet: true,
    nodeURL: 'https://kovan.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6',
    etherscanUrl: "https://api-kovan.etherscan.io",
    etherscanAPIKey: "I7K8X9VNXHVE8ZQTRY3JDKE6DR42UYBPUM",
    contracts: {
        busd: '0xb0e18106520d05adA2C7fcB1a95f7db5e3f28345',
        link: '0x69FcFe4aFF2778d15f186AcF8845a0Dc0ec08CC7',
        busdManager: '0x89Cb9b988ECe933becbA1001aEd98BdAa660Ef29',
        linkManager: '0xe65143628d598F867Ed5139Ff783bA6f33D51bFa',
        erc20Manager: '0xba1f4b06225A2Cf8B56D711539CbbeF1c097a886',
    },
    gasPrice: 1000000000,
    gasLimit: 150000
}

let hmyConfig = {
    testnet: true,
    nodeURL: 'https://api.s0.b.hmny.io',
    contracts: {
        busd: '0xc4860463c59d59a9afac9fde35dff9da363e8425',
        link: '0xac8bd2b27d45d582a3882e33f626f4e3d3f49c92',
        busdManager: '0xdc7c9eac2065d683adbe286b54bab4a62baa2654',
        linkManager: '0x32b473d012bea1a7b54df2fa4d9451fc2e37d5e9',
        erc20Manager: '0x97a5455c765c55b6d37eb87ee6bb1205cbf0c570',
    },
    gasPrice: 1000000000,
    gasLimit: 150000
}

export let testnet = {
    ethConfig,
    hmyConfig
}