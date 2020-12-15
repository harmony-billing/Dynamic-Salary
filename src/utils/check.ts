import fetch from "node-fetch"

export let getAdressType = async (adress: string) => {
    let data = ""

    let url = 'https://api.etherscan.io/api?module=account&action=balance&address=0x4f6742badb049791cd9a37ea913f2bac38d01279&tag=latest&apikey=I7K8X9VNXHVE8ZQTRY3JDKE6DR42UYBPUM'

    await fetch(url)
        .then(res => res.json())
        .then((out) => {
            data = out.result
        })
        .catch(err => { throw err });

    return data
}