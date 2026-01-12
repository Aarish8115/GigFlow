const mongoose = require("mongoose");
const { Schema } = mongoose;

const BidSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    gig: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
