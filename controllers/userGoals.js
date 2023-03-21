//Models
const userGoalModel = require("../models/UserGoals");

//Utility Functions
const { calUserGoals } = require("../utils/Methods");

/**
 * @description Add user goals
 * @route POST /api/user/add-user-goals
 * @access Private
 */
module.exports.addUserGoals = async (req, res) => {
  const { _id } = req.user;
  const { ...payload } = req.body;
  let data = { ...payload };

  //Preparing Input
  let input =
    data.goalType === "Exact Goal"
      ? {
          reason: String(data.reason),
          height: Number(data.height),
          weight: Number(data.weight),
          age: Number(data.age),
          gender: String(data.gender),
          bodyFat: String(data.bodyFat),
          active: String(data.active),
          dietType: String(data.dietType),
          goal: [
            {
              goalType: String(data.goalType),
              exactGoal: [
                {
                  goalWeight: Number(data.goalWeight),
                  weightChangeRate: Number(data.weightChangeRate),
                },
              ],
            },
          ],
        }
      : {
          reason: String(data.reason),
          height: Number(data.height),
          weight: Number(data.weight),
          age: Number(data.age),
          gender: String(data.gender),
          bodyFat: String(data.bodyFat),
          active: String(data.active),
          dietType: String(data.dietType),
          goal: [
            {
              goalType: String(data.goalType),
              generalGoal: String(data.generalGoal),
            },
          ],
        };

  // //Add goal logic
  try {
    const userGoal = await userGoalModel.findOne({ user: _id });
    if (userGoal) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Goal already exists", status: false }] });
    } else {
      const goal = await userGoalModel.create({
        user: _id,
        ...input,
      });

      console.log(_id);
      //Calculate User Goals
      calUserGoals(_id);

      return res.status(200).json({
        msg: "User Goal Added",
        goal,
        status: true,
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get user goals
 * @route GET /api/user/get-user-goals
 * @access Private
 */
module.exports.getUserGoals = async (req, res) => {
  const { _id } = req.user;

  try {
    const userGoals = await userGoalModel.findOne({ user: _id });
    if (!userGoals) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User Goal not Found", status: false }] });
    }

    return res.status(200).json({
      userGoals,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};
