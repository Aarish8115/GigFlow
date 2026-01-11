const { Router } = require("express");

const app = Router();

app.route("/bids").post("bid on a job");
app.route("/bids/:id").post("get bids for a gig");
