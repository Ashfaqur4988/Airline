const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRepository = require("../repository/user-repository.js");
const { ServerConfig } = require("../config");
const AppErrors = require("../utils/error/error-handler.js");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.log("yes from service");
        throw error;
      }
      console.log("service error: ", error);
      throw new AppErrors(
        "ServerError",
        "Something went wrong in service",
        "Logical Issue found",
        500
      );
    }
  }

  async signin(data) {
    try {
      const user = await this.userRepository.getByEmail(data.email);
      const isPasswordValid = this.checkPassword(data.password, user.password);
      if (!isPasswordValid) {
        console.log("password doesn't match");
        throw { error: "Incorrect password" };
      }
      const newToken = this.createToken({ email: user.email, id: user.id });
      return newToken;
    } catch (error) {
      console.log("something went wrong in token creation");
      throw error;
    }
  }

  async isAuthenticated(token) {
    try {
      const response = this.verifyToken(token);
      if (!response) {
        throw { error: "invalid token" };
      }
      const user = this.userRepository.getById(response.id);
      if (!user) {
        throw { error: "no user with the corresponding token exists" };
      }
      return user.id;
    } catch (error) {
      console.log("something went wrong in token creation");
      throw error;
    }
  }

  createToken(user) {
    try {
      const token = jwt.sign(user, ServerConfig.JWT_KEY, { expiresIn: "1d" });
      return token;
    } catch (error) {
      console.log("something went wrong in token creation");
      throw error;
    }
  }

  verifyToken(token) {
    try {
      const response = jwt.verify(token, ServerConfig.JWT_KEY);
      return response;
    } catch (error) {
      console.log("something went wrong in token verification");
    }
  }

  checkPassword(userInputPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPassword, encryptedPassword);
    } catch (error) {
      console.log("something went wrong in token creation");
      throw error;
    }
  }

  isAdmin(userId) {
    try {
      return this.userRepository.isAdmin(userId);
    } catch (error) {
      console.log("something went wrong in isAdmin service");
      throw error;
    }
  }
}

module.exports = UserService;
