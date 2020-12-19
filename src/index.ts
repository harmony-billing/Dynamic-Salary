import * as utils from "./utils"
export class DynamicSalary {
    
    getTransactionDataFromHash = (transactionHash: string, from: Date, to: Date) => {
        
    }

    getTransactionDataFromAdresses = async (senderAdress: string, receiverAdress: string, from: Date, to: Date) => {        
        let senderAdressType = await utils.getAdressType(senderAdress)
        let receiverAdressType = await utils.getAdressType(receiverAdress)
        return  { 
            "senderType": senderAdressType,
            "receiverType": receiverAdressType
        }
    }

}

let ds = new DynamicSalary()

ds.getTransactionDataFromAdresses("0x4f6742badb049791cd9a37ea913f2bac38d01279", "0x4f6742badb049791cd9a37ea913f2bac38d01279", new Date(), new Date()).then((data) => {
    console.log(data)
})