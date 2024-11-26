const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const clothingItemRouter = require("./routes/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

const {
  NOT_FOUND,
} = require("./utils/errors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// middleware
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "673d1c9d7ac6fcc68818764a",
  };
  next();
});

// routes
app.use("/users", userRouter);
app.use("/items", clothingItemRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// launch PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
