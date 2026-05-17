require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access_secret_change_me";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_change_me";
if (!mongoUri) {
  throw new Error("MONGODB_URI is not set.");
}

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.firstName },
    accessTokenSecret,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ sub: user._id.toString() }, refreshTokenSecret, {
    expiresIn: "7d",
  });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return res.status(401).json({ message: "Missing access token." });
  }
  try {
    const payload = jwt.verify(token, accessTokenSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token." });
  }
};

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  return res.status(201).json({ message: "Registration successful." });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ message: "Login successful.", accessToken });
});

app.post("/api/logout", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await RefreshToken.deleteOne({ token });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out." });
});

app.post("/api/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token." });
  }

  try {
    const payload = jwt.verify(token, refreshTokenSecret);
    const stored = await RefreshToken.findOne({ token, userId: payload.sub });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired." });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const newAccessToken = createAccessToken(user);
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token." });
  }
});

app.get("/api/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.sub).lean();
  if (!user) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  return res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
