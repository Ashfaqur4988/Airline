const { StatusCodes } = require("http-status-codes");
const { FlightService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/*
POST: /airports
req-body {
    flightNumber: UK 808,
    airplaneId: 'a380,
    departureAirportId: 12,
    arrivalAirportId: 11,
    arrivalTime: 11:10:00,
    departureTime: '9:10:00',
    price: 3000,
    boardingGate: 12,
    totalSeats: 180
}
*/
async function createFlight(req, res) {
  try {
    const flight = await FlightService.createFlight({
      flightNumber: req.body.flightNumber,
      airplaneId: req.body.airplaneId,
      departureAirportId: req.body.departureAirportId,
      arrivalAirportId: req.body.arrivalAirportId,
      arrivalTime: req.body.arrivalTime,
      departureTime: req.body.departureTime,
      price: req.body.price,
      totalSeats: req.body.totalSeats,
    });
    SuccessResponse.data = flight;
    SuccessResponse.message = "Successfully created an flight";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    // console.log("error controller ", error);
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while creating flight";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAllFlights(req, res) {
  try {
    const flights = await FlightService.getAllFlights(req.query);
    SuccessResponse.data = flights;
    SuccessResponse.message = "Successfully fetched flights";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = "Something went wrong while fetching flights";
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getFlight(req, res) {
  console.log("body", req.body);
  try {
    const flight = await FlightService.getFlight(req.params.id);
    SuccessResponse.data = flight;
    SuccessResponse.message = "Successfully fetched flights";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function updateRemainingSeats(req, res) {
  try {
    const response = await FlightService.updateRemainingSeats({
      flightId: req.params.id,
      seats: req.body.seats,
      decrease: req.body.decrease,
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(SuccessResponse);
  }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateRemainingSeats,
};
