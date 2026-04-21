import mongoose from "mongoose";

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    website: { type: String, default: "" },
    category: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    events: [
      {
        title: String,
        date: Date,
        location: String,
        description: String,
      },
    ],
    totalReceived: { type: Number, default: 0 },
    subscriberCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Charity", charitySchema);
