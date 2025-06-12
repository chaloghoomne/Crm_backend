import mongoose,{Schema,Document,models,model} from "mongoose";

const invoiceSchema = new Schema({
    companyId:{type:Schema.Types.ObjectId,ref:'company',required:true},
    invoiceNumber:{type:String,required:true},
    invoiceDate:{type:Date,required:true},
    dueDate:{type:Date,required:true},
    totalAmount:{type:Number},
    paidAmount:{type:Number},
    receiverName:{type:String},
    receiverEmail:{type:String},
    receiverPhone:{type:String},
    receiverAddress:{type:String},
    accountNumber:{type:String},
    ifscCode:{type:String},
    upiId:{type:String},
    bankName:{type:String},
    createdAt:{type:Date,default:Date.now},
    country:{type:String,required:true},
    currency:{type:String,required:true},
    tax:{type:Number,default:0},
    discount:{type:Number,default:0},
    shippingCharges:{type:Number,default:0},
    paymentMethod:{type:String},
    notes:{type:String,default:""},
    items:{type:[Object],required:true},
    status:{type:String,default:"pending"},

})

const Invoice = models.Invoice || model<Document>("Invoice",invoiceSchema);
export default Invoice;