import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    subscription: {
      status: { type: String, enum: ["active", "inactive", "lapsed"], default: "inactive" },
      plan: { type: String, enum: ["monthly", "yearly"], default: null },
      razorpaySubscriptionId: { type: String, default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      renewalDate: { type: Date, default: null },
    },
    charity: {
      charityId: { type: mongoose.Schema.Types.ObjectId, ref: "Charity", default: null },
      percentage: { type: Number, default: 10, min: 10, max: 100 },
    },
    scores: [
      {
        score: { type: Number, required: true, min: 1, max: 45 },
        date: { type: Date, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

export default mongoose.model("User", userSchema);
