const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is requires"),
  check("email")
    .isEmail()
    .withMessage("must be valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character")
];

exports.userSiginValidator = [
  check("email")
    .isEmail()
    .withMessage("must be valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character")
];
