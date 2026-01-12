const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const gigRoutes = require("./routes/gigs.routes");
const bidRoutes = require("./routes/bids.routes");

const port = process.env.PORT || 3000;
const clientOrigins = process.env.CLIENT_URL?.split(",") || [
  "http://localhost:5173",
  "https://gigflow-frontend-b9t6.onrender.com",
];

const app = express();

app.use(
  cors({
    origin: clientOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", gigRoutes);
app.use("/api", bidRoutes);

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
