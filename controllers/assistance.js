//Models
const assistanceModel = require("../models/Assistance");

/**
 * @description Submit Assistance
 * @route POST /api/assistance/submit-assistance
 * @access Private
 */
module.exports.submitAssistance = async (req, res) => {
  const { email, name, phoneNumber, reason } = req.body;
  const { _id } = req.user;

  //Edge cases and errors
  if (name === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Name is required", status: false }] });
  }
  if (phoneNumber === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Phone Number is required", status: false }] });
  }
  if (reason === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Reason is required", status: false }] });
  }
  if (email === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Email is required", status: false }] });
  } else {
    //Regex
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email address", status: false }] });
    }
  }

  //Logic
  try {
    const complaint = await assistanceModel.create({
      user: _id,
      email,
      phoneNumber,
      name,
      reason,
    });

    //Response
    return res.status(200).json({
      msg: "Thank You for your Feedback",
      complaint,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
