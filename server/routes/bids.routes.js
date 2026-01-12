const { Router } = require("express");
const { bidOnGig, getAllBids } = require("../controllers/bids");

const app = Router();

app.route("/bids/:id").post(bidOnGig);
app.route("/bids/:id").get(getAllBids);
