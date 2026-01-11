const { Router } = require("express");
const { getAllGig, createGig } = require("../controllers/gigs");

const app = Router();

app.route("/gigs").get(getAllGig);
app.route("/gigs").post(createGig);
