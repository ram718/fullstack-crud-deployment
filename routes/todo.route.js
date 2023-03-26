const express = require("express");
const todoRouter = express.Router();
const jwt = require("jsonwebtoken");
const { TodoModel } = require("../model/todo.model");

todoRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    if (decoded) {
      const data = await TodoModel.find({ userID: decoded.userID });
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad request" });
  }
});

todoRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const todo = new TodoModel(payload);
    await todo.save();
    res.status(200).send({ msg: "New todo has been added" });
  } catch (err) {
    res.status(400).send({ msg: "Bad request" });
  }
});

todoRouter.patch("/update/:todoID", async (req, res) => {
  const { todoID } = req.params;
  const payload = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  const userID = decoded.userID;
  const todo = TodoModel.findOne({ _id: todoID });
  const userID_in_todo = todo.userID;

  try {
    if (userID === userID_in_todo) {
      await TodoModel.findByIdAndUpdate({ _id: todoID }, payload);
      res.status(200).send({ msg: "Todo has been updated" });
    } else {
      res.status(400).send({ msg: "Not Authorised" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad request" });
  }
});

todoRouter.delete("/delete/:todoID", async (req, res) => {
  const { todoID } = req.params;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  const userID = decoded.userID;
  const todo = await TodoModel.findOne({ _id: todoID });
  const userID_in_todo = todo.userID;
  try {
    if (userID === userID_in_todo) {
      await TodoModel.findByIdAndDelete(todoID);
      res.status(200).send({ msg: "Todo has been deleted" });
    } else {
      res.status(400).send({ msg: "Not Authorised" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad request" });
  }
});

module.exports = { todoRouter };
