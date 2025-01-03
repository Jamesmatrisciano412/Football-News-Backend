const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../database/schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post(
  "/login",
  //validate body fields
  body("email").isLength({ min: 1 }).withMessage("Email is required."),
  body("email").isEmail().withMessage("Email is invalid."),
  body("password")
    .isLength({ min: 8, max: 60 })
    .withMessage("Password must be between 8 and 60 characters long."),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: "Invalid user email." });
        }

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(400)
                .json({ message: "The password is incorrect." });
            }

            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_SECRET_KEY
            );
            res.header("auth-token", token).json({ token: token });
          })
          .catch((err) => {
            console.log(err, "compare password in login.");
            return res.status(500).json({ message: "Login failed." });
          });
      })
      .catch((err) => {
        console.log(err, "Login find user error.");
        return res.status(400).json({ message: "Login failed." });
      });
  }
);

router.post(
  "/register",
  //validate body fields
  body("email").isEmail().withMessage("Email is invalid."),
  body("password")
    .isLength({ min: 8, max: 60 })
    .withMessage("Password must be between 8 and 60 characters long."),
  body("confirm")
    .isLength({ min: 8, max: 60 })
    .withMessage("Confirm password must be between 8 and 60 characters long."),
  body("phone").isLength({ min: 1 }).withMessage("Phone number is required."),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.password != req.body.confirm) {
      return res.status(400).json({
        errors: [
          {
            type: "field",
            value: "",
            msg: "You must confirm your password correctly.",
            path: "confirm",
            location: "body",
          },
        ],
      });
    }

    const newUser = User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    });

    User.find({ fullname: req.body.fullname, email: req.body.email })
      .then((users) => {
        if (users.length) {
          return res.status(400).json({ message: "User already exists." });
        }

        newUser.hashPassword().then(() => {
          newUser
            .save()
            .then((savedUser) => {
              return res
                .status(201)
                .json({
                  message: "User created successfully",
                  user: savedUser.fullname,
                });
            })
            .catch((err) => {
              console.log(err, "Save user in register.");
              return res.status(400).json({ message: "Create user failed." });
            });
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "Create user failed." });
        console.log(err, "Check user in register.");
      });
  }
);
