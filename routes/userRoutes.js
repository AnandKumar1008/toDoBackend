const express = require("express");

const {
  loginUser,
  signupUser,
  verifyAccount,
} = require("../controller/userController");
const router = express.Router();
router.post("/login", loginUser);
router.post("/signup", signupUser);
// router.post("/verify", verifyAccount);

module.exports = router;
