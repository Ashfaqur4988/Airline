const AppErrors = require("./error-handler.js");
const { StatusCodes } = require("http-status-codes");

class ClientError extends AppErrors {
  constructor(name, message, explanation, statusCode) {
    super(name, message, explanation, statusCode);
  }
}

module.exports = ClientError;
