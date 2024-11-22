const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /users
module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError"){
        return res.status(NOT_FOUND).send({ message: err.message })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// GET /users/:id
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError"){
        return res.status(NOT_FOUND).send({ message: err.message })
      }
      return res.status(BAD_REQUEST).send({ message: err.message });
    });
};

// POST /users
module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};
