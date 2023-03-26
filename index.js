const express = require("express");
const app = express();
const { connection } = require("./db");
const { todoRouter } = require("./routes/todo.route");
const { userRouter } = require("./routes/user.route");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use(auth);
app.use("/todos", todoRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to db");
    console.log(`App is running at ${process.env.port}`);
  } catch (err) {
    console.log("Cannot establish connection");
  }
});
