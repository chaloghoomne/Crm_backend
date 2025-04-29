import mongoose,{Schema,Document,model,models} from "mongoose";

const emailSchema = new Schema({
    from:{type:String,required:true},
    pass:{type:String,required:true},
    host:{type:String,required:true},
    provider:{type:String,required:true},
    to:{type:String,required:true},
    subject:{type:String,required:true},
    body:{type:String,required:true},
    displayText:{type:String,required:true},
    sentBy:{type:Schema.Types.ObjectId,ref:'Employee'},
    emailAccount:{type:String},
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
    sentAt: { type: Date, default: Date.now }
})

const Email = models.Email || model<Document>("Email",emailSchema);
export default Email;