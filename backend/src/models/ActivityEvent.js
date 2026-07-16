import mongoose from "mongoose";

const activityEventSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: Number, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, default: "", trim: true },
    userPhone: { type: String, default: "", trim: true },
    groupId: { type: Number, default: null, index: true },
    groupName: { type: String, default: "", trim: true },
    type: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["info", "warning", "high"],
      default: "info",
      index: true
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    sector: { type: String, default: "", trim: true },
    read: { type: Boolean, default: false, index: true }
  },
  { timestamps: true, versionKey: false }
);

export const ActivityEvent =
  mongoose.models.ActivityEvent || mongoose.model("ActivityEvent", activityEventSchema);
