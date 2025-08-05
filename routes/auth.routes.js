const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

//Register user

router.post("/register", async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!password == confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    //send data to profile-service
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/users/register`,
      {
        email,
        password: hashedPassword,
        role,
      },
    );
    const userId = response.data.userId;
    const token = jwt.sign({ userId, role }, SECRET, { expiresIn: "1d" });
    res.status(201).json({ token });
  } catch (err) {
    console.log("registration error: ", err.message);
    res.status(500).send({ message: "Registration failed!" });
  }
});

//Login user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //fetch user from user-service
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/email/${email}`,
    );
    const user = response.data;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong Credentials" });
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.log("Login error: ", err.message);
    res.status(401).json({ message: "Login failed!!" });
  }
});
module.exports = router;
