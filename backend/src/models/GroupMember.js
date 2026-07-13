import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    groupId: { type: Number, required: true, index: true },
    userId: { type: Number, default: null, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    cedula: { type: String, default: "", trim: true },
    relation: { type: String, required: true, trim: true },
    locationStatus: {
      type: String,
      enum: ["sharing", "paused", "offline"],
      default: "paused"
    },
    lastLocation: { type: String, default: "Sin ubicacion" },
    lastUpdate: { type: String, default: () => new Date().toISOString() },
    top: { type: String, default: "50%" },
    left: { type: String, default: "50%" }
  },
  { timestamps: true, versionKey: false }
);

groupMemberSchema.index({ groupId: 1, id: 1 }, { unique: true });
groupMemberSchema.index({ groupId: 1, email: 1 }, { unique: true });

export const GroupMember =
  mongoose.models.GroupMember || mongoose.model("GroupMember", groupMemberSchema);
