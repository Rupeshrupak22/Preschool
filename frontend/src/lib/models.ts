import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,
    classLevel: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    otpVerified: { type: Boolean, default: false },
    unlockedCourses: [{ type: String }]
  },
  { timestamps: true }
);

const LeadSchema = new Schema(
  {
    type: { type: String, required: true },
    name: String,
    email: String,
    phone: String,
    school: String,
    city: String,
    message: String,
    classLevel: String,
    interest: String
  },
  { timestamps: true }
);

const PaymentSchema = new Schema(
  {
    userEmail: String,
    plan: String,
    amount: Number,
    currency: { type: String, default: "INR" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, default: "created" },
    receiptUrl: String
  },
  { timestamps: true }
);

const CertificateSchema = new Schema(
  {
    userEmail: String,
    studentName: String,
    course: String,
    credentialId: { type: String, required: true, unique: true },
    qrCode: String,
    issuedAt: Date,
    status: { type: String, default: "active" }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
export const Lead = models.Lead || mongoose.model("Lead", LeadSchema);
export const Payment = models.Payment || mongoose.model("Payment", PaymentSchema);
export const Certificate =
  models.Certificate || mongoose.model("Certificate", CertificateSchema);
