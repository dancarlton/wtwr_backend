const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem
} = require("../controllers/clothingItems");
const auth = require('../middlewares/auth')

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:id", auth, deleteClothingItem);
router.put("/:id/likes", auth, likeItem);
router.delete("/:id/likes", auth, dislikeItem);

module.exports = router;
