import * as utils from "./utils"
export class DynamicSalary {
    
    getTransactionDataFromHash = (transactionHash: string, from: Date, to: Date) => {
        
    }

    getTransactionDataFromAdresses = async (senderAdress: string, receiverAdress: string, from: Date, to: Date) => {
        let output = await utils.getAdressType(senderAdress)
        return output
    }

}

let ds = new DynamicSalary()

let s = ds.getTransactionDataFromAdresses("test", "test", new Date(), new Date())

console.log(s)

// I HATE ASYNC FUNCTION...............