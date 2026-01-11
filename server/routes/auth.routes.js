const { Router } = require("express");

const app = Router();

app.route("/login").post();
app.route("/register").post();
