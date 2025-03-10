const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequest");
const ConflictError = require("../errors/Conflict");
const NotFoundError = require("../errors/NotFound");
const UnauthorizedError = require("../errors/Unauthorized");

// GET /users/me
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

// POST /users
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error();
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res.status(200).send({
        data: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      })
    )
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        next(new ConflictError("User already exists"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "The password and email fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError(err.message));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me
module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
