const favoriteModel = require("../models/Favorite");

//Helpers
const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * @description Add Favorite
 * @route POST /api/favorite/add-favorite
 * @access Private
 */
module.exports.addFavorite = async (req, res) => {
  const { _id } = req.user;
  const { item } = req.body;

  //Logic
  try {
    const isFavoriteExist = await favoriteModel.findOne({
      user: _id,
      item: ObjectId(item),
    });
    if (isFavoriteExist) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Favorite Exists!", status: false }] });
    }
    await favoriteModel.create({
      user: _id,
      item: ObjectId(item),
    });

    //Response
    return res.status(200).json({
      msg: "Favorite Added",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Favorites
 * @route GET /api/favorite/get-favorites
 * @access Private
 */
module.exports.getFavorites = async (req, res) => {
  const { _id } = req.user;

  try {
    const favorites = await favoriteModel.find({ user: _id }).populate('item');
    if (!favorites) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Favorite not found", status: false }] });
    }

    //Response
    return res.status(200).json({
      favorites,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Remove Favorites
 * @route DELETE /api/favorite/remove-favorite/:id
 * @access Private
 */
module.exports.removeFavorite = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;

  try {
    await favoriteModel.deleteOne({ user: _id, item: ObjectId(id) });

    //Response
    return res.status(200).json({
      msg: "Favorite Removed",
      status: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: error });
  }
};
