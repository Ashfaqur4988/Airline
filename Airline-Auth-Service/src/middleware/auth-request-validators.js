const { StatusCodes } = require("http-status-codes");
const validateUserSignup = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: {},
      message: "Something went wrong",
      error: "Email or Password missing in the request",
    });
  }
  next();
};

const validateIsAdminRequest = (req, res, next) => {
  if (!req.body.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: {},
      err: "User id not given in the request",
      message: "Something went wrong",
    });
  }
  next();
};

module.exports = { validateUserSignup, validateIsAdminRequest };
