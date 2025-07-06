const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user/signup");

const signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const signupController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  req.body.name = validator.escape(req.body.name);
  req.body.email = validator.normalizeEmail(req.body.email);
  req.body.role = validator.escape(req.body.role || "user");

  const password = req.body.password;
  const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.\W]).{6,}$/;

  if (!passwordStrength.test(password)) {
    return res.status(400).json({
      error:
        "Password must include uppercase, lowercase, and at least one special character (e.g. . @ #)",
    });
  }

  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      redirect: "/dashboard",
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginValidator = [
  check("email").isEmail().withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("Password is required"),
];

const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  req.body.email = validator.normalizeEmail(req.body.email);
  req.body.password = validator.escape(req.body.password);
  if (!validator.isEmail(req.body.email))
    return res.status(400).json({ error: "Invalid email format" });
  if (!req.body.password)
    return res.status(400).json({ error: "Password is required" });


  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).json({ error: "User not found" });
  if (user.role !== "user")
    return res.status(403).json({ error: "Access denied: Users only" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      redirect: "/dashboard",
    });
};

module.exports = {
  signupController,
  signupValidator,
  loginController,
  loginValidator,
};
