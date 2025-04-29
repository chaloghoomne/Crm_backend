import mongoose,{Schema,Document,models,model} from "mongoose";

const LeadSchema = new Schema({
    package:{type:Schema.Types.ObjectId,ref:'Package',required:true},
    tourType:{type:String,required:true},
    visaCategory:{type:Schema.Types.ObjectId,ref:'VisaCategory',required:true},
    leadBy:{type:Schema.Types.ObjectId,ref:'Employee',required:true},
    company_id:{type:Schema.Types.ObjectId,ref:'Company',required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    visaName:{type:String,required:true},
    validity:{type:String,required:true},
    price:{type:Number,required:true},
    entryType:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    gender:{type:String,required:true},
    ageGroup:{type:String,required:true},
    dob:{type:String,required:true},
    fathersName:{type:String,required:true},
    mothersName:{type:String,required:true},
    passport:{type:String,required:true},
    passportIssueDate:{type:String,required:true},
    passportExpiryDate:{type:String,required:true},
    status:{type:String,enum:['active','inactive'],default:'active'},
    document: {
        type: Map,
        of: String,
        default: {},
      },      
    createdAt:{type:Date,default:Date.now},
})

const Lead = models.Lead || model<Document>("Lead",LeadSchema);
export default Lead;