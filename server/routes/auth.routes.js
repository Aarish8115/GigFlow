const { Router } = require("express");
const { login, register, logout, me } = require("../controllers/auth");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);

module.exports = router;
