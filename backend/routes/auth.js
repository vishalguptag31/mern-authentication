const express = require("express");
const router = express.Router();

//import controllers
const { signup, accountActivation, signin } = require("../controllers/auth");

//import validators
const {
  userSignupValidator,
  userSiginValidator
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSiginValidator, runValidation, signin);

module.exports = router;
