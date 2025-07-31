import mongoose,{Schema,Document,models,model} from "mongoose";

const invoiceSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "company", required: true },
    clientType: { type: String },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },
    totalAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    receiverName: { type: String },
    receiverEmail: { type: String },
    receiverPhone: { type: String },
    receiverAddress: { type: String },
    receipts: [String],
    isInvoice: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    currency: { type: String, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shippingCharges: { type: Number, default: 0 },
    paymentMethod: { type: String },
    invoiceType: {
      type: String,
      enum: ["sales", "purchase", "credit", "debit"],
      default: "sales",
    },
    notes: { type: String, default: "" },
    items: { type: [Object], required: true },
    status: { type: String, default: "unpaid" },
    gstNumber: { type: String },
  },
  { timestamps: true }
);

const Invoice = models.Invoice || model<Document>("Invoice",invoiceSchema);
export default Invoice;