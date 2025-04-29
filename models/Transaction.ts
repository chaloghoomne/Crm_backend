import mongoose,{Schema,Document,models,model} from "mongoose"
import { ref } from "process"


const transaactionSchema = new Schema({
    leadId: {type:Schema.Types.ObjectId,ref:'Lead',required:true},
    payment: {
        type: String,
        default: true,
      },
    amount:{type:String,required:true},
    currency:{type:String,required:true},
    receipt:{type:String,required:true},
})

const Transaction = models.Transaction || model<Document>("Transaction",transaactionSchema)
export default Transaction;