const { StatusCodes } = require("http-status-codes");
const { AirportController } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/*
POST: /airports
req-body {name: 'IGI', city_id: 2, code: 'DEL'}
*/
async function createAirport(req, res) {
  try {
    const airport = await AirportController.createAirport({
      name: req.body.name,
      code: req.body.code,
      city_id: req.body.city_id,
    });
    SuccessResponse.data = airport;
    SuccessResponse.message = "Successfully created an airport";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while creating airport";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirport(req, res) {
  try {
    const airport = await AirportController.getAirport(req.params.id);
    SuccessResponse.data = airport;
    SuccessResponse.message = "Successfully fetched the airport";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching airport";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirports(req, res) {
  try {
    const airport = await AirportController.getAirports();
    SuccessResponse.data = airport;
    SuccessResponse.message = "Successfully fetched airports";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching airports";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function deleteAirport(req, res) {
  try {
    const airport = await AirportController.deleteAirport(req.params.id);
    SuccessResponse.data = airport;
    SuccessResponse.message = "Successfully deleted an airplane";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while deleting airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function updateAirport(req, res) {
  try {
    const airport = await AirportController.updateAirport(
      req.params.id,
      req.body
    );
    SuccessResponse.data = airport;
    SuccessResponse.message = "Successfully created an airplane";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while creating airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createAirport,
  deleteAirport,
  getAirport,
  getAirports,
  updateAirport,
};
