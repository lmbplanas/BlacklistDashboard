import mongoose from "mongoose";

const mnoStatusSchema = new mongoose.Schema(
  {
    domain:        { type: String, required: true },
    mno:           { type: String, required: true, enum: ["Globe", "Smart", "DITO"] },
    lastChecked:   { type: Date,   required: true },
    rawStatus:     { type: String, required: true },   // e.g. "Up" or "Down"
    computedState: { type: String, required: true, enum: ["Blocked", "Pending", "Overdue"] },
    responseTimeMs:{ type: Number },
    errorMessage:  { type: String }
  },
  { timestamps: true }
);

// Create a compound index for domain+mno to ensure uniqueness
mnoStatusSchema.index({ domain: 1, mno: 1 }, { unique: true });

export default mongoose.model("MnoStatus", mnoStatusSchema);