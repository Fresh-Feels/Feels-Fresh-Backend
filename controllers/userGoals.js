//Models
const userGoalModel = require("../models/UserGoals");

/**
 * @description Add user goals
 * @route POST /api/user/add-user-goals
 * @access Private
 */
module.exports.addUserGoals = async (req, res) => {
  const { ...payload } = req.body;
  const { _id } = req.user;

  //Add goal logic
  try {
    const userGoal = await userGoalModel.findOne({ user: _id });
    if (userGoal) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Goal already exists", status: false }] });
    } else {
      const goal = await userGoalModel.create({
        user: _id,
        ...payload,
      });

      return res.status(200).json({
        msg: "User Goal Added",
        goal,
        status: true,
      });
    }
  } catch (error) {
    console.log("Error", error)
    return res.status(500).json({ errors: error });
  }
};
