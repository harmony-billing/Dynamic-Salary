
import { DynamicSalary, TYPE } from '../src'
import { testnet } from '../src/configs/testnet'

let ds = new DynamicSalary(testnet)

ds.getTransactionData(
    TYPE.ONE,
    "one1akph3q7a0vtfzad2lau0cfvsvkrnc5fzf487ly",
    TYPE.ETH,
    "0x430506383F1Ac31F5FdF5b49ADb77faC604657B2", 
).then((data) => {
    console.log(data)
})

ds.send(
    TYPE.ONE,
    '0x936224fc6acd1d8e4dab100c054ed7305acf520207b2f0c15257d570d5fd56de',
    'one1we0fmuz9wdncqljwkpgj79k49cp4jrt5hpy49j',
    TYPE.ONE,
    'one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4',
    0.01
)

ds.send(
    TYPE.ETH,
    'cbcf3af28e37d8b69c4ea5856f2727f57ad01d3e86bec054d71fa83fc246f35b',
    '0xc491a4c5c762b9E9453dB0A9e6a4431057a5fE54',
    TYPE.ETH,
    '0x4778D03bB3E169b920Cbf826F9A931A15574fE28',
    0.01
)

ds.send(
    TYPE.ONE,
    '0x936224fc6acd1d8e4dab100c054ed7305acf520207b2f0c15257d570d5fd56de',
    'one1we0fmuz9wdncqljwkpgj79k49cp4jrt5hpy49j',
    TYPE.ETH,
    '0x4778D03bB3E169b920Cbf826F9A931A15574fE28',
    0.01,
    '0x69FcFe4aFF2778d15f186AcF8845a0Dc0ec08CC7'
)

ds.send(
    TYPE.ETH,
    'cbcf3af28e37d8b69c4ea5856f2727f57ad01d3e86bec054d71fa83fc246f35b',
    '0xc491a4c5c762b9E9453dB0A9e6a4431057a5fE54',
    TYPE.ONE,
    'one1xlk8jnxw68nwksxtqt39t0ggghfnuex5pak7j4',
    0.01,
    '0xb0e18106520d05adA2C7fcB1a95f7db5e3f28345'
)
