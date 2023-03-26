const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//register
userRouter.post("/register", async (req, res) => {
  const { email, password, location, age } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({ email, password: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "User is registered successfully" });
    });
  } catch (err) {
    res.status(400).send({ msg: "Unable to process the request" });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, results) => {
        if (results) {
          res.status(200).send({
            msg: "Login Successfull",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: "Unable to process the request" });
  }
});

module.exports = { userRouter };
