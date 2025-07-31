require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth Service is working");
});
app.use("/auth", authRoute);

module.exports = app;
