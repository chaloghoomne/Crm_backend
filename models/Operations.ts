import mongoose ,{ Schema,Document,models,model } from "mongoose";
import { ref } from "process";
import Supplier from "./Supplier";

const operationsSchema = new Schema({
    leadId:{type:Schema.Types.ObjectId,ref:'Lead'},
    companyId:{type:Schema.Types.ObjectId,ref:'Company'},
    assignedEmpId:{type:Schema.Types.ObjectId,ref:'Employee'},
    assignedEmpName:{type:String},
    supplierName:{type:String},
    supplierId:{type:Schema.Types.ObjectId,ref:'Supplier'},
    supplierPrice:{type:String},
    operationStatus:{type:String , default:"Pending"},
})

const Operation = models.Operation || model<Document>("Operation",operationsSchema);
export default Operation;