import mongoose,{Schema,Document,models,model} from "mongoose";

const clientSchema = new Schema({
    companyId:{type:String,required:true},
    name:{type:String , required:true},
    email:{type:String},
    address:{type:String},
    phone:{type:String},
    gstNumber:{type:String},
    clientType:{type:String},
})

const Client = models.Client || model<Document>("Client",clientSchema);
export default Client;