const { Router } = require("express");
const { getAllGig, createGig, getGig } = require("../controllers/gigs");

const app = Router();

app.route("/gigs").get(getAllGig);
app.route("/gigs").post(createGig);
app.route("/gigs/:id").get(getGig);
