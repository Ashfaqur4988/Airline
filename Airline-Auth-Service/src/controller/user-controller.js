const { StatusCodes } = require("http-status-codes");
const UserService = require("../service/user-service");
const userService = new UserService();

const create = async (req, res) => {
  try {
    const response = await userService.create({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: response,
      error: {},
      success: true,
    });
  } catch (error) {
    console.log("controller: ", error);
    return res.status(error.statusCode).json({
      message: error.message,
      data: {},
      error: error.explanation,
      success: false,
    });
  }
};

const signin = async (req, res) => {
  try {
    const response = await userService.signin({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      data: response,
      error: {},
      success: true,
    });
  } catch (error) {
    // console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
      data: {},
      error: error.explanation,
      success: false,
    });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const response = await userService.isAuthenticated(token);
    return res.status(StatusCodes.OK).json({
      message: "User is authenticated & token is valid",
      data: response,
      error: {},
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      data: {},
      error: error,
      success: false,
    });
  }
};

const isAdmin = async (req, res) => {
  try {
    const response = await userService.isAdmin(req.body.id);
    return res.status(StatusCodes.OK).json({
      message: "Successfully fetched whether user is admin or not",
      data: response,
      error: {},
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      data: {},
      error: error,
      success: false,
    });
  }
};

module.exports = { create, signin, isAuthenticated, isAdmin };
