import mongoose,{Schema,Document}  from "mongoose";

const EmailAccountSchema = new Schema({
    name:{ type:String,},
    email:{type:String,},
    host:{type:String,},
    secure:{type:Boolean,},
    provider:{type:String,}, // e.g., 'gmail' or 'outlook'
    oauth: {
        accessToken: { type: String },
        refreshToken: { type: String },
        expiryDate: { type: Date }
    },
})

const companySchema = new Schema({
    companyName:{type:String,required:true},
    adminEmail:{type:String,required:true},
    address:{type:String},
    accountNumber:{type:String},
    ifscCode:{type:String},
    upi:{type:String},
    bankName:{type:String},
    plan:{type:Schema.Types.ObjectId,ref:"Plan"},
    imgurl:{type:String},
    signature:{type:String},
    emailAccounts:[EmailAccountSchema],    
    // emailAccounts:[{ type: Schema.Types.ObjectId, ref: 'EmailAccount' }],     
    createdAt:{type:Date,default:Date.now},
},{timestamps:true});

const Company = mongoose.models.Company || mongoose.model<Document>("Company",companySchema);
export default Company;