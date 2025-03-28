const express = require("express");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
