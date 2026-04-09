import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    isLostListEnabled: {
      type: Boolean,
      default: false,
    },

    rotationType: {
      type: String,
      enum: ["sequential", "shift"],
      default: "sequential",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    totalKathismas: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Group', groupSchema);
