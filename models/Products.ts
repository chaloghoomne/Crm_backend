import mongoose,{Schema,Document,models,model} from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String },
    price: { type: String },
    companyId: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || model<Document>("Product",productSchema)
export default Product;