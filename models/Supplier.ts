import mongoose,{Schema,Document,model,models} from "mongoose";

const supplierSchema = new Schema({
    company:{type:String},
    ownerName:{type:String},
    email:{type:String,},
    phoneNumber:{type:String},
    gstNumber:{type:String},
    serviceType:{type:[String]},
    city:{type:String},
    address:{type:String},
    bankName:{type:String},
    
    accountNumber:{type:String},
    ifscCode:{type:String},
    upi:{type:String},
    description:{type:String},
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt:{type:Date,default:Date.now},
    Images:{type:[String],default:[]},
})

const Supplier = models.Supplier || model<Document>("Supplier",supplierSchema);
export default Supplier