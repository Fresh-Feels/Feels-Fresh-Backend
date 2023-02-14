//Models
const adminModel = require("../models/Admin");

//Utility Functions
const generateToken = require("../utils/generateToken");

//NPM Packages
const bcrypt = require("bcryptjs");

/**
 * @description Signup
 * @route POST /api/admin/signup
 * @access Public
 */
module.exports.adminSignup = async (req, res) => {
  const { email, password } = req.body;

  //Edge cases and errors
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
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }

  //Signup Logic
  try {
    const adminExists = await adminModel.findOne({ email });
    if (adminExists) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Admin already exists", status: false }] });
    } else {
      try {
        //Creating admin
        const admin = await adminModel.create({
          email,
          password,
        });

        //Creating token and sending response
        const token = generateToken(admin._id);
        return res.status(200).json({
          msg: "Account Created",
          response: {
            _id: admin._id,
            email: admin.email,
            token,
          },
          status: true,
        });
      } catch (error) {
        return res.status(500).json({ errors: error });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Login
 * @route POST /api/admin/login
 * @access Public
 */
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  //Edge cases and errors
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
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }

  //Login logic
  try {
    const admin = await adminModel.findOne({ email }).select("+password");
    if (admin) {
      const matched = await bcrypt.compare(password, admin.password);
      if (matched) {
        const token = generateToken(admin._id);
        return res.status(200).json({
          msg: "Login Successfully",
          response: {
            _id: admin._id,
            email: admin.email,
            token,
          },
          status: true,
        });
      } else {
        return res.status(400).json({
          errors: [{ msg: "Invalid Password", status: false }],
        });
      }
    } else {
      return res.status(400).json({
        errors: [{ msg: "Admin not found", status: false }],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};
