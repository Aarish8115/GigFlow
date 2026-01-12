const { Router } = require("express");
const { bidOnGig, getAllBids, hireBid } = require("../controllers/bids");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.post("/bids", requireAuth, bidOnGig);
router.get("/bids/:gigId", requireAuth, getAllBids);
router.patch("/bids/:bidId/hire", requireAuth, hireBid);

module.exports = router;
