const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

//Register user

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User Created!" });
  } catch (err) {
    res.status(400).send({ message: "User already existed!" });
  }
});

//Login user

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).send({ error: "Invalid Credentials!" });
  }

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });
  res.send({ token });
});
module.exports = router;
