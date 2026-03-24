import { Schema, model } from "mongoose";

const assignmentSchema = new Schema(
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

    date: {
      type: Date,
      required: true,
    },

    kathismaNumber: {
      type: Number,
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({ userId: 1, groupId: 1, date: 1 }, { unique: true });

export default model("Assignment", assignmentSchema);
