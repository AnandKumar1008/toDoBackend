const mongoose = require("mongoose");
const OTPSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    Otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("verifyOTPs", OTPSchema);
