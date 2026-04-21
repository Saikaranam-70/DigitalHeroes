import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    plan: { type: String, enum: ["monthly", "yearly"], required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    charityAmount: { type: Number, default: 0 },
    prizePoolAmount: { type: Number, default: 0 },
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
