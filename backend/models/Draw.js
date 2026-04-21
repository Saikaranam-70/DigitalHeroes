import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    status: { type: String, enum: ["pending", "simulated", "published"], default: "pending" },
    drawType: { type: String, enum: ["random", "algorithmic"], default: "random" },
    drawnNumbers: [{ type: Number }],
    prizePool: {
      total: { type: Number, default: 0 },
      fiveMatch: { type: Number, default: 0 },
      fourMatch: { type: Number, default: 0 },
      threeMatch: { type: Number, default: 0 },
      jackpotCarryover: { type: Number, default: 0 },
    },
    winners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        matchType: { type: String, enum: ["5-match", "4-match", "3-match"] },
        matchedNumbers: [Number],
        prizeAmount: { type: Number, default: 0 },
        verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        proofUrl: { type: String, default: "" },
        paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
        paidAt: Date,
      },
    ],
    activeSubscriberCount: { type: Number, default: 0 },
    simulationResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Draw", drawSchema);
