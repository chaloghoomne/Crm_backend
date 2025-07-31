import mongoose,{Schema,Document,models,model} from "mongoose";

const employeeSchema = new  Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String},
    role:{type:String,enum:['admin','sales','operations'],default:'sales'},
    phone:{type:String},
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt:{type:Date,default:Date.now},
},{timestamps:true})

const Employee = models.Employee || model<Document>("Employee",employeeSchema);
export default Employee;