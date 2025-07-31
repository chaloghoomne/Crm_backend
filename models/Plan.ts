import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    employeesAllowed: {
      type: Number,
      required: true,
    },
    emailsAllowed: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan",planSchema) || mongoose.models.Plan;
export default Plan;