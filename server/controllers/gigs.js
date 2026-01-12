const Gig = require("../models/gigs.model");

async function createGig(req, res) {
  const { title, description, budget } = req.body;
  if (!title || !description || budget === undefined) {
    return res
      .status(400)
      .json({
        error: true,
        message: "Title, description, and budget are required.",
      });
  }

  const gig = await Gig.create({
    title,
    description,
    budget,
    client: req.user._id,
  });

  return res.status(201).json({ error: false, gig });
}

async function getAllGig(req, res) {
  const { search, status } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  } else {
    filter.status = "open";
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const gigs = await Gig.find(filter)
    .populate("client", "name username email")
    .sort({ createdAt: -1 });

  return res.status(200).json({ error: false, gigs });
}

async function getGig(req, res) {
  const { gigId } = req.params;
  const gig = await Gig.findById(gigId).populate(
    "client",
    "name username email"
  );
  if (!gig) {
    return res.status(404).json({ error: true, message: "Gig not found." });
  }
  return res.status(200).json({ error: false, gig });
}

module.exports = { createGig, getAllGig, getGig };
