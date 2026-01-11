const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bids = new Schema({
  id: {
    type: Number,
  },
  description: {
    type: String,
  },
  freelancer: {
    type: String,
  },
  amount: {
    type: Number,
  },
});
module.exports = mongoose.model("Bids", Bids);
