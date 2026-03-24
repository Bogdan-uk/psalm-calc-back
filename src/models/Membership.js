import { Schema, model } from "mongoose";

const membershipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    role: {
      type: String,
      enum: ["reader", "admin"],
      default: "reader",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

membershipSchema.index({ userId: 1, groupId: 1 }, { unique: true });

export default model("Membership", membershipSchema);
