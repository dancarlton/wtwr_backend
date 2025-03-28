const BadRequestError = require("../errors/BadRequest");
const NotFoundError = require("../errors/NotFound");
const ForbiddenError = require("../errors/Forbidden");
const ClothingItem = require("../models/clothingItem");


// GET /items
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItem) => res.send(clothingItem))
    .catch(next);
};

// POST /items
module.exports.createClothingItem = (req, res, next) => {
  // console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send(clothingItem))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

// DELETE /items/:id
module.exports.deleteClothingItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found!"));
      }

      // check ownership of item
      if (item.owner.toString() !== userId) {
        return next(new ForbiddenError("You are not authorized to delete this item"));
      }

      // if the user owns the item, delete it
      return ClothingItem.deleteOne({ _id: id }).then(() => {
        res.status(200).send({ message: "Item successfully deleted" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

// PUT /items/:itemId/likes — like an item
module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

// DELETE /items/:itemId/likes — unlike an item
module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
       return next(new NotFoundError("Item not found"));
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
