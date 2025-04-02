const { StatusCodes } = require("http-status-codes");
const { CityService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function createCity(req, res) {
  try {
    const city = await CityService.createCity({
      name: req.body.name,
    });
    SuccessResponse.data = city;
    SuccessResponse.message = "City created successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while creating city";
    res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function getAllCities(req, res) {
  try {
    const city = await CityService.getAllCities();
    SuccessResponse.data = city;
    SuccessResponse.message = "Cities fetched successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching all city";
    res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function getCity(req, res) {
  try {
    const city = await CityService.getCity(req.params.id);
    SuccessResponse.data = city;
    SuccessResponse.message = "City fetched successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching  city";
    res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function updateCity(req, res) {
  try {
    const city = await CityService.updateCity(req.params.id, req.body);
    SuccessResponse.data = city;
    SuccessResponse.message = "City updated successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while updating  city";
    res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function deleteCity(req, res) {
  try {
    const city = await CityService.deleteCity(req.params.id);
    SuccessResponse.data = city;
    SuccessResponse.message = "City deleted successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while deleting  city";
    res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

module.exports = { createCity, getAllCities, getCity, updateCity, deleteCity };
