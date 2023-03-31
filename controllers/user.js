//Models
const userModel = require("../models/User");
const subscriptionModel = require("../models/Subscription");

//Utility Functions
const generateToken = require("../utils/generateToken");
const { get6DigitCode } = require("../utils/Methods");
const { sendVerificationCodeToEmail } = require("../utils/Mailer");

//NPM Packages
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");

/**
 * @description Signup
 * @route POST /api/user/signup
 * @access Public
 */
module.exports.userSignup = async (req, res) => {
  const { username, email, password } = req.body;

  //Edge cases and errors
  if (username === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Username is required", status: false }] });
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
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }

  //Signup Logic
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists", status: false }] });
    } else {
      try {
        //Creating user
        const user = await userModel.create({
          username,
          email,
          password,
        });

        //Creating token and sending response
        const token = generateToken(user._id);
        return res.status(200).json({
          msg: "Account Created",
          response: {
            _id: user._id,
            username: user.username,
            email: user.email,
            token,
          },
          status: true,
        });
      } catch (error) {
        return res.status(500).json({ errors: error });
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Login
 * @route POST /api/user/login
 * @access Public
 */
module.exports.userLogin = async (req, res) => {
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
    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = generateToken(user._id);
        return res.status(200).json({
          msg: "Login Successfully",
          response: {
            _id: user._id,
            username: user.username,
            email: user.email,
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
        errors: [{ msg: "User not found", status: false }],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Forget Password
 * @route GET /api/user/forget-password
 * @access Public
 */
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.params;

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

  //Forget Password Logic
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }

    //Send verification email
    const otp = get6DigitCode();
    sendVerificationCodeToEmail(email, otp);

    await userModel.updateOne(
      { _id: user._id },
      { verificationCode: otp, otpLastSentTime: dayjs().valueOf() }
    );

    return res.status(200).json({
      msg: "Verification email sent",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Verify user with OTP for password reset
 * @route POST /api/user/verify-user-to-reset-password
 * @access Public
 */
module.exports.verifyUserToResetPassword = async (req, res) => {
  const { otp, email } = req.body;

  //Edge cases and errors
  if (!otp) {
    return res.status(400).json({
      errors: [{ msg: "OTP is missing", status: false }],
    });
  }
  if (!email) {
    return res.status(400).json({
      errors: [{ msg: "Email is missing", status: false }],
    });
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("+verificationCode +otpLastSentTime");
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }

    if (
      dayjs().diff(dayjs(user.otpLastSentTime)) > 300000 ||
      user.verificationCode == null ||
      user.otpLastSentTime == null
    ) {
      return res.status(400).json({
        errors: [{ msg: "OTP is expired or used", status: false }],
      });
    }
    if (otp !== user.verificationCode) {
      return res.status(400).json({
        errors: [{ msg: "OTP is incorrect", status: false }],
      });
    }

    await userModel.updateOne(
      { _id: user._id },
      { verificationCode: null, otpLastSentTime: null }
    );

    const token = generateToken(user._id);
    return res.status(200).json({ msg: "OTP Verified", token, status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Resend verification OTP
 * @route GET /api/user/resend-otp
 * @access Public
 */
module.exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  //Edge cases and errors
  if (!email) {
    return res.status(400).json({
      errors: [{ msg: "Email is missing", status: false }],
    });
  }

  try {
    //Sending verification code
    const otp = get6DigitCode();
    sendVerificationCodeToEmail(email, otp);

    await userModel.updateOne(
      { email },
      { verificationCode: otp, otpLastSentTime: dayjs().valueOf() }
    );
    return res.status(200).json({
      msg: "Verification email sent",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Reset Password
 * @route PUT /api/user/reset-password
 * @access Private
 */
module.exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { _id } = req.user;

  //Edge cases and errors
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }

  //Reset password logic
  try {
    const user = await userModel.findOne({ _id }).select("+password");
    if (user) {
      //Preparing the hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await userModel.updateOne({ _id }, { password: hash });
      return res
        .status(200)
        .json({ msg: "Password updated succesfully", status: true });
    } else {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description User address
 * @route PUT /api/user/address
 * @access Private
 */
module.exports.addAddress = async (req, res) => {
  const { address } = req.body;
  const { _id } = req.user;

  try {
    await userModel.updateOne({ _id }, { address });
    return res
      .status(200)
      .json({ msg: "Address updated succesfully", status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description User Info
 * @route GET /api/user/user-info
 * @access Private
 */
module.exports.userInfo = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await userModel.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
    const { isPaid } = await subscriptionModel.findOne({ user: _id });
    
    return res.status(200).json({ user, isPaid, status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Cutlery
 * @route PUT /api/user/cutlery
 * @access Private
 */
module.exports.cutlery = async (req, res) => {
  const { value } = req.body;
  const { _id } = req.user;

  //Preparing Input
  const input = {
    cutlery: Boolean(value),
  };

  try {
    await userModel.updateOne(
      { _id },
      { cutlery: input.cutlery },
      { new: true }
    );
    res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Delivery Time
 * @route PUT /api/user/delivery-time
 * @access Private
 */
module.exports.deliveryTime = async (req, res) => {
  const { _id } = req.user;
  const { time } = req.body;

  try {
    await userModel.updateOne({ _id }, { deliveryTime: time }, { new: true });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Add Profile Picture
 * @route PUT /api/user/add-profile-image
 * @access Private
 */
module.exports.profileImage = async (req, res) => {
  const { _id } = req.user;
  const { profileImage } = req.body;

  try {
    await userModel.updateOne({ _id }, { profileImage }, { new: true });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Edit Profile
 * @route PUT /api/user/edit-profile
 * @access Private
 */
module.exports.editProfile = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const { _id } = req.user;

  //Edit Username
  if (username && !currentPassword) {
    try {
      console.log(username);

      await userModel.updateOne({ _id }, { username }, { new: true });
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  }

  //Edit Password
  if (!username && currentPassword) {
    //Edge Cases
    if (currentPassword.length === 0) {
      return res.status(400).json({
        errors: [
          { msg: "Password must be atleast 8 characters", status: false },
        ],
      });
    }
    if (newPassword.length === 0) {
      return res.status(400).json({
        errors: [
          { msg: "Password must be atleast 8 characters", status: false },
        ],
      });
    }
    //Change Password Logic
    try {
      const user = await userModel.findOne({ _id }).select("+password");
      if (user) {
        const matched = await bcrypt.compare(currentPassword, user.password);
        if (matched) {
          //Preparing the hash password
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newPassword, salt);

          await userModel.updateOne({ _id }, { password: hash });
          return res
            .status(200)
            .json({ msg: "Password updated succesfully", status: true });
        } else {
          return res.status(400).json({
            errors: [{ msg: "Invalid Current Password", status: false }],
          });
        }
      } else {
        return res.status(400).json({
          errors: [{ msg: "User not found", status: false }],
        });
      }
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  }

  //Edit Password and Username
  if (username && currentPassword) {
    //Edge Cases
    if (currentPassword.length === 0) {
      return res.status(400).json({
        errors: [
          { msg: "Password must be atleast 8 characters", status: false },
        ],
      });
    }
    if (newPassword.length === 0) {
      return res.status(400).json({
        errors: [
          { msg: "Password must be atleast 8 characters", status: false },
        ],
      });
    }
    //Change Password Logic
    try {
      const user = await userModel.findOne({ _id }).select("+password");
      if (user) {
        const matched = await bcrypt.compare(currentPassword, user.password);
        if (matched) {
          //Preparing the hash password
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newPassword, salt);

          await userModel.updateOne({ _id }, { username, password: hash });
          return res
            .status(200)
            .json({ msg: "Profile updated succesfully", status: true });
        } else {
          return res.status(400).json({
            errors: [{ msg: "Invalid Current Password", status: false }],
          });
        }
      } else {
        return res.status(400).json({
          errors: [{ msg: "User not found", status: false }],
        });
      }
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  }
};
