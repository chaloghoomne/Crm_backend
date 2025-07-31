import mongoose,{Schema,Document,models,model} from "mongoose"

const agentSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

const Agent = models.Agent || model<Document>("Agent",agentSchema);
export default Agent