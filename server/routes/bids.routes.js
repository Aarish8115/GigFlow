const { Router } = require("express");
const {
  bidOnGig,
  getAllBids,
  hireBid,
  getFilledBids,
} = require("../controllers/bids");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.post("/bids", requireAuth, bidOnGig);
router.get("/bids/me", requireAuth, getFilledBids);
router.get("/bids/:gigId", requireAuth, getAllBids);
router.patch("/bids/:bidId/hire", requireAuth, hireBid);

module.exports = router;
