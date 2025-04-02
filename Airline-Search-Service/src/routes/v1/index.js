const express = require("express");
const airplanesRoutes = require("./airplane-routes.js");
const cityRoutes = require("./city-route.js");
const airportRoutes = require("./airport-routes.js");
const flightRoutes = require("./flight-routes.js");

const router = express.Router();

router.use("/airplanes", airplanesRoutes);
router.use("/cities", cityRoutes);
router.use("/airports", airportRoutes);
router.use("/flights", flightRoutes);

module.exports = router;
