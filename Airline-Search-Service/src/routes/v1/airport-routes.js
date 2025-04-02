const express = require("express");
const { AirportController } = require("../../controllers");
const { AirportMiddlewares } = require("../../middlewares");

const router = express.Router();

router.post(
  "/",
  AirportController.createAirport,
  AirportMiddlewares.validateCreateRequest
);
router.get("/:id", AirportController.getAirport);
router.get("/", AirportController.getAirports);
router.patch("/:id", AirportController.updateAirport);
router.delete("/:id", AirportController.deleteAirport);

module.exports = router;
