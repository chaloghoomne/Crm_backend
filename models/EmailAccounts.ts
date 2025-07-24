// src/models/EmailAccount.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

const EmailAccountSchema = new Schema({
   name:{ type:String,required:true},
    email:{type:String,required:true},
    host:{type:String,required:true},
    secure:{type:Boolean,required:true},
    provider:{type:String,required:true}, // e.g., 'gmail' or 'outlook'
    oauth: {
        accessToken: { type: String },
        refreshToken: { type: String },
        expiryDate: { type: Date }
    },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
});

const EmailAccount = mongoose.models.EmailAccount || mongoose.model('EmailAccount', EmailAccountSchema);
export default EmailAccount;
