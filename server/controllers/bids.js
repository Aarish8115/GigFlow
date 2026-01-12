const mongoose = require("mongoose");
const Bid = require("../models/bids.model");
const Gig = require("../models/gigs.model");

async function bidOnGig(req, res) {
  const { gigId, message, description, amount } = req.body;
  const bidMessage = message || description;

  if (!gigId || !bidMessage || amount === undefined) {
    return res.status(400).json({
      error: true,
      message: "gigId, message, and amount are required.",
    });
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    return res.status(404).json({ error: true, message: "Gig not found." });
  }

  if (gig.status !== "open") {
    return res
      .status(400)
      .json({ error: true, message: "Gig is not open for bidding." });
  }

  if (gig.client.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json({ error: true, message: "You cannot bid on your own gig." });
  }

  const bid = await Bid.create({
    message: bidMessage,
    amount,
    gig: gig._id,
    freelancer: req.user._id,
  });

  return res.status(201).json({ error: false, bid });
}

async function getAllBids(req, res) {
  const { gigId } = req.params;

  const gig = await Gig.findById(gigId);
  if (!gig) {
    return res.status(404).json({ error: true, message: "Gig not found." });
  }

  if (gig.client.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: true, message: "Only the gig owner can view bids." });
  }

  const bids = await Bid.find({ gig: gigId })
    .populate("freelancer", "name username email")
    .sort({ createdAt: -1 });

  return res.status(200).json({ error: false, bids });
}

async function hireBid(req, res) {
  const { bidId } = req.params;

  const bid = await Bid.findById(bidId);
  if (!bid) {
    return res.status(404).json({ error: true, message: "Bid not found." });
  }

  const gig = await Gig.findById(bid.gig);
  if (!gig) {
    return res.status(404).json({ error: true, message: "Gig not found." });
  }

  if (gig.client.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: true, message: "Only the gig owner can hire." });
  }

  if (gig.status !== "open") {
    return res
      .status(400)
      .json({ error: true, message: "Gig is not open for hiring." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Bid.updateMany(
      { gig: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await Bid.findByIdAndUpdate(bid._id, { status: "hired" }, { session });
    await Gig.findByIdAndUpdate(
      gig._id,
      { status: "assigned", hiredBid: bid._id },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(500)
      .json({ error: true, message: "Failed to hire freelancer." });
  } finally {
    session.endSession();
  }

  const updatedGig = await Gig.findById(gig._id)
    .populate("client", "name username email")
    .populate({
      path: "hiredBid",
      populate: { path: "freelancer", select: "name username email" },
    });
  const hiredBid = await Bid.findById(bid._id).populate(
    "freelancer",
    "name username email"
  );

  return res.status(200).json({ error: false, gig: updatedGig, hiredBid });
}
async function getFilledBids(req, res) {
  const userId = req.user._id;

  const bids = await Bid.find({ freelancer: userId })
    .populate({
      path: "gig",
      populate: { path: "client", select: "name username email" },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({ error: false, bids });
}
module.exports = { bidOnGig, getAllBids, hireBid, getFilledBids };
