const mongoose = require("mongoose");
const { Schema } = mongoose;

const GigSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["open", "assigned", "closed"],
      default: "open",
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hiredBid: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
  },
  { timestamps: true }
);

GigSchema.index({ title: "text" });

module.exports = mongoose.model("Gig", GigSchema);
