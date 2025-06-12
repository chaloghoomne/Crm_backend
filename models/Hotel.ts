import mongoose,{Schema,Document,model,models} from "mongoose";

const hotelSchema = new Schema({
    name:{type:String,required:true},
    location:{type:String,required:true},
    email:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    hotelType:{type:String,required:true},
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt:{type:Date,default:Date.now},
})

const Hotel = models.Hotel || model<Document>("Hotel",hotelSchema);
export default Hotel