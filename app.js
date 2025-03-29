require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require('helmet');
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const limiter = require( './middlewares/rate-limiter' );
const NotFoundError = require( './errors/NotFound' );

// initialize express app
const app = express();

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// security middleware
app.use(helmet())
app.use(limiter)

// middleware
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// routes
app.use(routes);

// handle invalid routes
app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

// launch server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
