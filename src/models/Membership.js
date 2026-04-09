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

    sequenceOrder: {
      type: Number,
      default: 0,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    healthNames: {
      type: [String],
      default: [],
    }, // о здравии
    reposeNames: {
      type: [String],
      default: [],
    }, // о упокоении
    lostNames: {
      type: [String],
      default: [],
    }, // о заблудших (опционально)
  },
  {
    timestamps: true,
  },
);

membershipSchema.index({ userId: 1, groupId: 1 }, { unique: true });

export default model("Membership", membershipSchema);
