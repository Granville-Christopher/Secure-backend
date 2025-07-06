const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const userroutes = require("./routes/userroutes");
const adminroutes = require("./routes/adminroutes");

const expressSanitizer = require("express-sanitizer");
const cookieParser = require("cookie-parser");

// Sequelize setup
const sequelize = require("./db");
sequelize.sync();

// Middleware setup
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSanitizer());

// Set EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Set global template variables (optional, but harmless if you use them)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.admin = req.admin || null;
  next();
});

// Routes
app.use("/", userroutes);
app.use("/admin", adminroutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
