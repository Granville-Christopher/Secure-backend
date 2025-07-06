const router = require("express").Router();
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const User = require("../models/user/signup");
const {
  signupController,
  signupValidator,
  loginValidator,
  loginController,
} = require("../controllers/admincontroller");

// router.get("/", authenticate, authorize("admin"), (req, res) => {
//   User.getAllUsers((err, Users) => {
//     if (err) {
//       console.error("Error fetching users:", err);
//       return res.status(500).send("Internal Server Error");
//     }

//     res.render("admin/admin", {
//       title: "Admin Dashboard",
//       user: req.user,
//       Users: Users,
//     });
//   });
// });

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.findAll();
    res.render("admin/admin", {
      title: "Admin Dashboard",
      user: req.user,
      users: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", (req, res) => {
  res.render("admin/login", {
    title: "Admin Login",
    user: req.user,
  });
});

router.get("/register", (req, res) => {
  res.render("admin/signup", {
    title: "Admin Register",
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
