const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /items
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server." });
    });
};

// POST /items
module.exports.createClothingItem = (req, res) => {
  // console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occured on the server." });
      }
    });
};

// DELETE /items/:id
module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.message === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// PUT /items/:itemId/likes — like an item
module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send({ data: updatedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// DELETE /items/:itemId/likes — unlike an item
module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      }
    });
};
