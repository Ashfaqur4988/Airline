const express = require("express");
const userRouter = require("./v1");
const router = express.Router();

router.use("/v1", userRouter);

module.exports = router;
