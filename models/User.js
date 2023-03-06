const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: [6, "Password must be atleast 6 characters"],
      maxlength: [1024, "Password cannot excede 1024 characters"],
      select: false,
    },
    address: {
      type: String,
    },
    cutlery: {
      type: Boolean,
      default: false,
    },
    deliveryTime: {
      type: String,
      default: "Morning",
      enum: ["Morning", "Night Before"],
    },
    verificationCode: {
      type: String,
      select: false,
    },
    otpLastSentTime: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

//Encrypting the password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("user", userSchema);
