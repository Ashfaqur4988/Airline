const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../config");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  //managed transaction
  // return new Promise((resolve, reject) => {
  //   const result = db.sequelize.transaction(async function bookingImpl(t) {
  //     const flight = await axios.get(
  //       `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
  //     );
  //     const flightData = flight.data.data;
  //     if (data.noOfSeats > flightData.totalSeats) {
  //       reject(
  //         new AppError("Not enough seats available", StatusCodes.BAD_REQUEST)
  //       );
  //     }
  //     resolve(true);
  //   });
  // });

  //unmanaged transaction
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }

    const totalBillingAmount = data.noOfSeats * flightData.price;
    // console.log(totalBillingAmount);
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    //seat update
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );
    if (bookingDetails.status === CANCELLED) {
      throw new AppError("Booking is expired", StatusCodes.BAD_REQUEST);
    }
    // console.log(bookingDetails.totalCost, data.totalCost);
    let bookingTime = new Date(bookingDetails.createdAt);
    let currentTime = new Date();
    if (currentTime - bookingTime > 900000) {
      await cancelBooking(bookingDetails.id);
      throw new AppError("Booking is expired", StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.totalCost !== data.totalCost) {
      throw new AppError(
        "The amount of payment doesn't match",
        StatusCodes.BAD_REQUEST
      );
    }
    if (bookingDetails.userId !== data.userId) {
      throw new AppError(
        "The amount of payment doesn't match",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await bookingRepository.update(
      data.bookingId,
      {
        status: BOOKED,
      },
      transaction
    );

    await transaction.commit();
  } catch (error) {
    // console.log(error);
    await transaction.rollback();
    throw error;
  }
}

async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if (bookingDetails.status === CANCELLED) {
      await transaction.commit();
      return true;
    }

    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
      {
        seats: bookingDetails.noOfSeats,
        decrease: 0,
      }
    );

    await bookingRepository.update(
      bookingId,
      { status: CANCELLED },
      transaction
    );
    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}

async function cancelOldBooking() {
  try {
    const time = new Date(Date.now() - 1000 * 300); //5 mins ago
    const response = await bookingRepository.cancelOldBooking(time);
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelOldBooking,
};
