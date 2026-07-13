import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    createdBy: { type: Number, required: true, index: true }
  },
  { timestamps: true, versionKey: false }
);

export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
