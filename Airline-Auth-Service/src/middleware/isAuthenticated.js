const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/error/error-handler");
const { ServerConfig } = require("../config");
const {} = require("../repository");

const isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.log("auth middleware - No access token found");
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in!");
    }

    const decode = jwt.decode(token, ServerConfig.JWT_KEY);
    const currentUser = await userRepository.findById(decode.id);

    if (!currentUser) {
      logger.error("auth middleware - User not found");
      return next(new AppError(StatusCodes.UNAUTHORIZED, "User not found!"));
    }

    req.user = {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    };

    logger.info("auth middleware - User found");

    next();
  } catch (error) {}
};

const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      logger.info("auth middleware - Protect route");
      // console.log(req.cookies.access_token);
      let access_token;
      if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
        logger.error("auth middleware - No access token found");
        return next(
          new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in!")
        );
      }

      const decode = jwt.decode(access_token, config.jwtSecret);
      const currentUser = await userRepository.findById(decode.id);

      if (!currentUser) {
        logger.error("auth middleware - User not found");
        return next(new AppError(StatusCodes.UNAUTHORIZED, "User not found!"));
      }

      req.user = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      };

      logger.info("auth middleware - User found");

      next();
    } catch (error) {
      if (error) {
        next(error);
      }
    }
  },
};

export default authMiddleware;
