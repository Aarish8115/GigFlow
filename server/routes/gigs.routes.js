const { Router } = require("express");

const app = Router();

app.route("/gigs").get("get all gigs");
app.route("/gigs").post("post a gig");
