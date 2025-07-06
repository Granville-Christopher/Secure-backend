const router = require("express").Router();
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  signupController,
  signupValidator,
  loginValidator,
  loginController,
} = require("../controllers/usercontroller");

router.get("/", authenticate, authorize("user"), (req, res) => {
  res.render("user/index", {
    title: "Home",
    user: req.user,
  });
});
router.get("/dashboard", authenticate, authorize("user"), (req, res) => {
  res.render("user/dashboard", {
    title: "User Dashboard",
    user: req.user,
  });
});

router.get("/login", (req, res) => {
  res.render("user/login", {
    title: "User Login",
    user: req.user,
  });
});

router.get("/register", (req, res) => {
  res.render("user/signup", {
    title: "User Register",
    user: req.user,
  });
});

router.post("/register", signupValidator, signupController);
router.post("/login", loginValidator, loginController);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/login");
});

module.exports = router;
