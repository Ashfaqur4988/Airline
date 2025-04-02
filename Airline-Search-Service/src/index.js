// Package imports
const express = require("express");
const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");

//Local imports

const app = express();

//middlewares mounting below
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

app.listen(ServerConfig.PORT, () => {
  console.log(`Server running on port ${ServerConfig.PORT}`);
});
