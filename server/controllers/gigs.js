const Gigs = require("../models/gigs.model");

async function createGig(req, res) {
  const { name, description, clientid } = req.body;

  const Gig = new Gigs({
    client: clientid,
    name: name,
    description: description,
  });
  await Gig.save();
  res.status(200).json({ error: false, message: "Gig created" });
}
async function getAllGig(req, res) {
  const allGigs = await Gigs.find({});
  if (!allGigs) {
    return res.status(500).json({ error: true, message: "No Gigs found." });
  }
  return res.status(200).json({ error: false, allGigs });
}
async function findGig(req, res) {
  const { id } = req.body;
  const Gig = await Gigs.findOne({ id });
  if (!Gig) {
    return res.status(500).json({ error: true, message: "Gig not found." });
  }
  return res.status(200).json({ error: false, Gig });
}

module.exports = { createGig, getAllGig, findGig };
