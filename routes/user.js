const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../database/schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

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
      return res
        .status(400)
        .json({ errors: errors.array(), type: "validation" });
    }

    const { email, password } = req.body;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            errors: [
              {
                type: "field",
                value: "",
                msg: "Invalid user email.",
                path: "email",
                location: "body",
              },
            ],
            type: "validation",
          });
        }

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({
                errors: [
                  {
                    type: "field",
                    value: "",
                    msg: "The password is incorrect.",
                    path: "password",
                    location: "body",
                  },
                ],
                type: "validation",
              });
            }

            const token = jwt.sign(
              { _id: user._id, fullname: user.fullname, email: user.email },
              process.env.JWT_SECRET_KEY,
              {expiresIn: "24h"}
            );
            
            res.status(200).json({
                message: "Sign-in successful!",
                data: {
                    fullname: user.fullname,
                    email: user.email,
                    token: token
                }
            });
          })
          .catch((err) => {
            console.log(err, "compare password in login.");
            return res
              .status(500)
              .json({ message: "Sign in failed.", type: "request" });
          });
      })
      .catch((err) => {
        console.log(err, "Login find user error.");
        return res
          .status(400)
          .json({ message: "Sign in failed.", type: "request" });
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
      return res
        .status(400)
        .json({ errors: errors.array(), type: "validation" });
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
        type: "validation",
      });
    }

    const newUser = User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    });

    User.find({ email: req.body.email })
      .then((users) => {
        if (users.length) {
          return res.status(400).json({
            errors: [
              {
                type: "field",
                value: "",
                msg: "User already exists.",
                path: "email",
                location: "body",
              },
            ],
            type: "validation",
          });
        }

        newUser.hashPassword().then(() => {
          newUser
            .save()
            .then((savedUser) => {
              return res.status(201).json({
                message: "User created successfully",
                user: savedUser.fullname,
              });
            })
            .catch((err) => {
              console.log(err, "Save user in register.");
              return res
                .status(400)
                .json({ message: "Create user failed.", type: "request" });
            });
        });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Create user failed.", type: "request" });
        console.log(err, "Check user in register.");
      });
  }
);

router.get('/verifyToken', verifyToken , (req, res) => {
    res.status(200).json({...req.user});
})
