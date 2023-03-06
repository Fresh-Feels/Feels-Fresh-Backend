//Models
const userGoalModel = require("../models/UserGoals");

//NPM Packages
const axios = require("axios");

//OTP
module.exports.get6DigitCode = () => {
  Math.floor(100000 + Math.random() * 900000);
};

// calculate user goals
module.exports.calUserGoals = async (_id) => {
  let AMR;

  try {
    const userGoals = await userGoalModel.findOne({ user: { $eq: _id } });

    //Calculate Male user goals
    if (userGoals.gender === "Male") {
      const BMR =
        66.47 +
        13.75 * userGoals.weight +
        5.003 * userGoals.height -
        6.755 * userGoals.age;

      if (userGoals.active === "Sedentary (little or no exercise)") {
        AMR = BMR * 1.2;
      } else if (userGoals.active === "Lightly Active (1-3 days workout)") {
        AMR = BMR * 1.375;
      } else if (userGoals.active === "Moderately Active (3-5 days workout)") {
        AMR = BMR * 1.55;
      } else if (userGoals.active === "Active (6-7 days workout)") {
        AMR = BMR * 1.725;
      } else if (userGoals.active === "Very Active (6-7 days hard workout)") {
        AMR = BMR * 1.9;
      }
    }

    //Calculate Female user goals
    if (userGoals.gender === "Female" || userGoals.gender === "Other") {
      const BMR =
        655.1 +
        9.563 * userGoals.weight +
        1.85 * userGoals.height -
        4.676 * userGoals.age;

      if (userGoals.active === "Sedentary (little or no exercise)") {
        AMR = BMR * 1.2;
      } else if (userGoals.active === "Lightly Active (1-3 days workout)") {
        AMR = BMR * 1.375;
      } else if (userGoals.active === "Moderately Active (3-5 days workout)") {
        AMR = BMR * 1.55;
      } else if (userGoals.active === "Active (6-7 days workout)") {
        AMR = BMR * 1.725;
      } else if (userGoals.active === "Very Active (6-7 days hard workout)") {
        AMR = BMR * 1.9;
      }
    }

    //User Target Calories
    userGoals.targetCalories = Number(AMR.toFixed(1));
    await userGoals.save();
  } catch (error) {
    console.log(error);
    return error;
  }
};

//Generate Payment Token
module.exports.generatePaymentToken = async (
  company_code,
  customer_id,
  cc_number,
  expiry_month,
  expiry_year,
  cvv
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "company-code": company_code,
    },
  };
  try {
    const { data } = await axios.post(
      {
        customer_id,
        cc_number,
        expiry_month,
        expiry_year,
        cvv,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
