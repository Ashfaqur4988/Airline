const { StatusCodes } = require("http-status-codes");
const { AirplaneService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/*
POST: /airplanes
req-body {modelNumber: 'model-number-111', capacity: 200}
*/
async function createAirplane(req, res) {
  try {
    const airplane = await AirplaneService.createAirplane({
      modelNumber: req.body.modelNumber,
      capacity: req.body.capacity,
    });
    SuccessResponse.data = airplane;
    SuccessResponse.message = "Successfully created an airplane";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while creating airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirplanes(req, res) {
  try {
    const airplanes = await AirplaneService.getAirplanes();
    SuccessResponse.data = airplanes;
    SuccessResponse.message = "Successfully fetched all airplanes.";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching airplanes.";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirplane(req, res) {
  try {
    const airplane = await AirplaneService.getAirplane(req.params.id);
    SuccessResponse.data = airplane;
    SuccessResponse.message = "Successfully fetched airplane data.";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function destroyAirplane(req, res) {
  try {
    const airplane = await AirplaneService.destroyAirplane(req.params.id);
    SuccessResponse.data = airplane;
    SuccessResponse.message = "Successfully deleted airplane.";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while deleting the airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function updateAirplane(req, res) {
  try {
    const airplane = await AirplaneService.updateAirplane(
      req.params.id,
      req.body
    );
    SuccessResponse.data = airplane;
    SuccessResponse.message = "Successfully updated airplane.";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while updating the airplane";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createAirplane,
  getAirplanes,
  getAirplane,
  destroyAirplane,
  updateAirplane,
};
