const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes")

const { PORT = 3001 } = process.env;
const { NOT_FOUND } = require("./utils/errors");

// initialize express app
const app = express();

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use(routes);

// handle invalid routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// launch server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
