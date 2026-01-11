const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Gigs = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  client: {
    type: String,
  },
  bids: {
    id: { type: String },
  },
});

module.exports = mongoose.model(Gigs);
