const { Router } = require("express");

const app = Router();

app.route("/bids/:id").post("bid on a job");
app.route("/bids/:id").get("get bids for a job");
