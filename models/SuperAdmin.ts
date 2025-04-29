import mongoose,{Schema,Document,models,model} from "mongoose";

const superAdminSchema = new Schema({
    name:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:['superadmin'],default:'superadmin'},
})

const SuperAdmin = models.SuperAdmin || model<Document>("SuperAdmin",superAdminSchema);
export default SuperAdmin;