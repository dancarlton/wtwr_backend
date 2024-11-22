const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /items
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// POST /items
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// DELETE /items/:id
module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// PUT /items/:itemId/likes — like an item
module.exports.likeItem = (req, res) =>

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => res.send(updatedItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });



// DELETE /items/:itemId/likes — unlike an item
module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
