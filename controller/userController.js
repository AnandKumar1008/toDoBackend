const Users = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const UserOTPs = require("../models/verifyOTP");
require("dotenv").config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password)
    return res.status(401).json({
      status: "fail",
      message: "Email and password are required",
    });
  try {
    const user = await Users.findOne({ email });
    console.log(user);
    if (user) {
      const isCorrect = bcrypt.compareSync(password, user.password);
      console.log(isCorrect);
      if (isCorrect) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({
          status: "Success",
          token,
          data: user,
        });
      } else {
        res.status(403).json({
          message: "Invalid Password, try again !!",
          status: "fail",
        });
      }
    } else {
      res.status(404).json({
        message: "Email with this email does not exist !!",
        status: "fail",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Invalid Token",
    });
  }
};
//sign up login is here

//
const saltRounds = 10;
const signupUser = async (req, res) => {
  const { email, password, name, role, otpID } = req.body;

  const user = await Users.findOne({ email });
  if (user) {
    return res.status(409).json({
      message: "User with given Email already registered",
      status: "fail",
    });
  }
  // const isOTPsend = await OTPs.findById();

  //   console.log(isOTPsend);
  // if(!isOTPsend||!isOTPsend.length)
  //   verify();

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newuser = {
    name,
    email,
    password: hashedPassword,
    role,
  };

  try {
    const data = await Users.create(newuser);
    res.status(200).json({
      message: "User SignedUp successfully",
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

// update email and otp to the database
//for the verification send otp to the gmail;
let pass = "krishna@#1008";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: pass,
  },
  secure: true, // Use SSL/TLS
});
function generateOtp() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}
//Here sending the otp to GMAIL
function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender's email address
    to: email, // Recipient's email address
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
}

//Verification Part is not done yet

const verifyAccount = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  console.log(pass, process.env.EMAIL_USERNAME);

  try {
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User with given Email already Registered",
        status: "fail",
      });
    }
    console.log(user);
    console.log(email);

    const otp = generateOtp();
    const otpInfo = await sendOTP(email, otp);
    // otpInfo.then(res=>res.json())
    console.log(otpInfo);
    const userOtp = await UserOTPs.create({ email, otp });
    if (userOtp) {
      res.status(201).json({
        status: "success",
        message: "OTP generated successful",
        data: userOtp,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

//

module.exports = { signupUser, loginUser, verifyAccount };
