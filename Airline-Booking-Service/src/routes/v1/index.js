const express = require("express");
const bookingRoutes = require("./booking-routes.js");

const { InfoController } = require("../../controllers");

const router = express.Router();

router.use("/bookings", bookingRoutes);
router.get("/info", InfoController.info);

module.exports = router;
