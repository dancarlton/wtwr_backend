const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:id", deleteClothingItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", dislikeItem);

module.exports = router;
