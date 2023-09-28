const express = require("express");

const {
  loginUser,
  signupUser,
  verifyAccount,
  firebaseLogin,
  checkToken,
  logout,
} = require("../controller/userController");
const router = express.Router();
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/firebase", firebaseLogin);
// router.post("/verify", verifyAccount);
router.post("/token", checkToken);
router.post("/logout", logout);
module.exports = router;
