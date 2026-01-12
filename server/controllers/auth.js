const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { TOKEN_COOKIE } = require("../middlewares/auth");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function buildSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  };
}

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function register(req, res) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({
        error: true,
        message: "Name, username, email, and password are required.",
      });
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (existing) {
    return res
      .status(409)
      .json({ error: true, message: "Email or username already in use." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, username, email, password: hashed });
  const token = signToken(user._id);

  res.cookie(TOKEN_COOKIE, token, cookieOptions);
  return res.status(201).json({ error: false, user: buildSafeUser(user) });
}

async function login(req, res) {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Identifier and password are required." });
  }

  const normalized = identifier.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: normalized }, { username: normalized }],
  });
  if (!user) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid credentials." });
  }

  const token = signToken(user._id);
  res.cookie(TOKEN_COOKIE, token, cookieOptions);
  return res.status(200).json({ error: false, user: buildSafeUser(user) });
}

function logout(_req, res) {
  res.clearCookie(TOKEN_COOKIE, { ...cookieOptions, maxAge: 0 });
  return res.status(200).json({ error: false, message: "Logged out." });
}

async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: true, message: "Unauthorized." });
  }
  return res.status(200).json({ error: false, user: buildSafeUser(req.user) });
}

module.exports = { register, login, logout, me };
