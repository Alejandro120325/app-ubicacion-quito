import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "persona"], default: "persona" },
    language: { type: String, enum: ["es", "en"], default: "es" },
    cedula: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    active: { type: Boolean, default: false },
    sharingLocation: { type: Boolean, default: false },
    lastConnection: { type: Date, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
