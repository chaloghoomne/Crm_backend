import mongoose,{Schema,Document,models,model} from "mongoose";
import { ref } from "process";

const receiptSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    receiptNumber: { type: String, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentMode: { type: String },
    total: { type: Number },
    currency: { type: String },
    buyerName: { type: String },
    date: { type: Date },
    receiptType: {
      type: String,
      enum: ["sales", "purchase", "credit", "debit"],
      default: "sales",
    },
    account: { type: String },
    note: { type: String },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Receipt = models.Receipt || model<Document>("Receipt",receiptSchema)

export default Receipt;