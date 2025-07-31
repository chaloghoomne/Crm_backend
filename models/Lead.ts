import mongoose,{Schema,Document,models,model} from "mongoose";
import { ref } from "process";

const LeadSchema = new Schema(
  {
    leadBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    agent: { type: Schema.Types.ObjectId, ref: "Agent" },
    agentName: { type: String },
    assignedEmpName: { type: String },
    assignedEmpId: { type: Schema.Types.ObjectId, ref: "Employee" },
    serviceType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    leadType: { type: String },
    requirements: { type: String },
    fromDate: { type: Date },
    toDate: { type: Date },
    followUp: [
      {
        status: { type: String },
        date: { type: Date },
        nextDate: { type: Date },
        remarks: { type: String },
        price: { type: Number },
        reminder: { type: String },
      },
    ],
    time: { type: String },
    forward: { type: Boolean },
    price: { type: Number },
    destination: { type: String },

    country: { type: String },
    tourType: { type: String },
    visaCategory: { type: Schema.Types.ObjectId, ref: "visaCategory" },
    visaName: { type: String },
    validity: { type: String },

    // departureDest:{type:String},
    // arrivalDest:{type:String},

    adult: { type: Number },
    child: { type: Number, default: 0 },
    infant: { type: Number, default: 0 },

    // insuranceAmount:{type:String},

    hotelCategory: { type: String },

    flightType: { type: String },

    leadSource: { type: String },
    priority: { type: String },

    passport: { type: String },
    status: { type: String },
    document: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

const Lead = models.Lead || model<Document>("Lead",LeadSchema);
export default Lead;