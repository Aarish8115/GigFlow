const { Router } = require("express");
const { getAllGig, createGig, getGig } = require("../controllers/gigs");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.get("/gigs", getAllGig);
router.post("/gigs", requireAuth, createGig);
router.get("/gigs/:gigId", getGig);

module.exports = router;
