const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateClothingItem, validateId } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItem, createClothingItem);
router.delete("/:id", auth, validateId, deleteClothingItem);
router.put("/:id/likes", auth, validateId, likeItem);
router.delete("/:id/likes", auth, validateId, dislikeItem);

module.exports = router;
