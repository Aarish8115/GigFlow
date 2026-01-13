const jwt = require("jsonwebtoken");
const User = require("../models/user.model");



function getTokenFromRequest(req) {
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith("Bearer ")) {
    return bearer.replace("Bearer ", "");
  }
  return req.cookies?.[process.env.TOKEN_COOKIE];
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: "Authentication required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: true, message: "Invalid token." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: true, message: "Unauthorized." });
  }
}

module.exports = { requireAuth};
