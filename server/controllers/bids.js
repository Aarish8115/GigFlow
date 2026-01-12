const Bids = require("../models/bids.model");
const Gigs = require("../models/gigs.model");

async function bidOnGig(req, res) {
  const { amount, freelancer, description } = req.body;
  const { gigId } = req.params;

  const Gig = await Gigs.findOne({ id: gigId });
  if (!Gig) {
  }
  const Bid = new Bids({ description, freelancer, amount, gigId: Gig.id });
  await Bid.save();
}
async function getAllBids(req, res) {
  const { gigId } = req.body;
  const allBids = await Bids.find({ gigId });

  return res.status(200).json({ error: false, allBids });
}
module.exports = { bidOnGig, getAllBids };
