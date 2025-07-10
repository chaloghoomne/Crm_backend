import mongoose,{Schema,Document}  from "mongoose";

const EmailAccountSchema = new Schema({
    name:{ type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    host:{type:String,required:true},
    secure:{type:Boolean,required:true},
    provider:{type:String,required:true},
})

const companySchema = new Schema({
    companyName:{type:String,required:true},
    adminEmail:{type:String,required:true},
    address:{type:String},
    accountNumber:{type:String},
    ifscCode:{type:String},
    upi:{type:String},
    bankName:{type:String},
    subscription:{
        plan:{type:String,required:true},
        status:{type:String,required:true},
        expiresAt:{type:Date,default:Date.now()+(30*24*60*60*1000)},
    },
    imgurl:{type:String},
    signature:{type:String},
    emailAccounts:[EmailAccountSchema],         
    createdAt:{type:Date,default:Date.now},
})

const Company = mongoose.models.Company || mongoose.model<Document>("Company",companySchema);
export default Company;