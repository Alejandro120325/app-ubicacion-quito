import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: Number, required: true, index: true },
    groupId: { type: Number, default: null, index: true },
    city: { type: String, default: "Quito" },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    accuracy: { type: Number, default: null, min: 0 },
    heading: { type: Number, default: null },
    speed: { type: Number, default: null },
    address: { type: String, default: "" },
    sector: { type: String, default: "Ubicacion GPS" },
    sharing: { type: Boolean, default: false },
    simulated: { type: Boolean, default: false },
    lastUpdate: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true, versionKey: false }
);

locationSchema.index({ userId: 1, groupId: 1, updatedAt: -1 });

export const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
