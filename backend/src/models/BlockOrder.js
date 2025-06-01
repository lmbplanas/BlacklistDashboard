import mongoose from "mongoose";

const blockOrderSchema = new mongoose.Schema({
  domain:   { type: String, required: true, unique: true },
  issuedAt: { type: Date,   required: true },
  reason:   { type: String }
});

export default mongoose.model("BlockOrder", blockOrderSchema);