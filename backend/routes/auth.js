const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");

const users = [];

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (e) {
    console.error(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const refreshToken = crypto.randomBytes(64).toString("hex");
    user.refreshToken = refreshToken;

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Logged in successfully", token, refreshToken });
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/token", (req, res) => {
  const { refreshToken } = req.body;
  const user = users.find((u) => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newToken = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ message: "New access token generated", token: newToken });
});

router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  const user = users.find((u) => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
  user.refreshToken = null;
  res.json({ message: "User logged out successfully" });
});

module.exports = { router, users };
