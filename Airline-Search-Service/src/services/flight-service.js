const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { FlightRepository } = require("../repository");
const AppError = require("../utils/errors/app-error.js");
const { compareTime } = require("../utils/helpers/datetime-helpers.js");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  // console.log("data service ", data);
  let isValid = compareTime(data.arrivalTime, data.departureTime);
  if (!isValid) {
    throw new AppError(
      "arrival time cannot be greater than departure time",
      StatusCodes.BAD_REQUEST
    );
  }
  try {
    const airplane = await flightRepository.create(data);
    return airplane;
  } catch (error) {
    // console.log("error service ", error);

    if (error.name === "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create a new Flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllFlights(query) {
  let customFilter = {};
  let sortFilter = [];
  const endingTripTIme = " 23:59:00";
  if (query.trips) {
    let [departureAirportId, arrivalAirportId] = query.trips.split("-");
    customFilter.departureAirportId = departureAirportId;
    customFilter.arrivalAirportId = arrivalAirportId;
    //TODO: add a check that arrival and departure id are not same
  }
  if (query.price) {
    let [minPrice, maxPrice] = query.price.split("-");
    customFilter.price = {
      [Op.between]: [minPrice, maxPrice === undefined ? 2000000 : maxPrice],
    };
  }
  if (query.travelers) {
    customFilter.totalSeats = {
      [Op.gte]: query.travelers,
    };
  }
  if (query.tripDate) {
    customFilter.departureTime = {
      [Op.between]: [query.tripDate, query.tripDate + endingTripTIme],
    };
  }
  if (query.sort) {
    let params = query.sort.split(",");
    let sortFilters = params.map((param) => param.split("_"));
    sortFilter = sortFilters;
  }
  try {
    const flights = await flightRepository.getAllFlights(
      customFilter,
      sortFilter
    );
    // console.log("flight service: ", flights);
    return flights;
  } catch (error) {
    // console.log("flight service error: ", error);

    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("Cannot find flights", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot fetch data of all the Flights",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getFlight(id) {
  try {
    const flight = await flightRepository.get(id);
    return flight;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("The flight you requested is not present");
    }
    throw new AppError(
      "Cannot fetch data of the flight",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateRemainingSeats(data) {
  try {
    const response = await flightRepository.updateRemainingSeats(
      data.flightId,
      data.seats,
      data.decrease
    );
    return response;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Cannot update seats of the requested flight",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateRemainingSeats,
};
