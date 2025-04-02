const express = require("express");
const UserController = require("../../controller/user-controller.js");
const { AuthRequestValidators } = require("../../middleware");

const router = express.Router();

router.get("/isAuthenticated", UserController.isAuthenticated);
router.post(
  "/signup",
  AuthRequestValidators.validateUserSignup,
  UserController.create
);
router.post(
  "/signin",
  AuthRequestValidators.validateUserSignup,
  UserController.signin
);

router.get(
  "/isAdmin",
  AuthRequestValidators.validateIsAdminRequest,
  UserController.isAdmin
);

module.exports = router;
