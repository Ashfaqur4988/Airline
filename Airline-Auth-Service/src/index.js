const express = require("express");
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const db = require("./models/index");

const app = express();

const prepareAndStartServer = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRoutes);
  app.listen(ServerConfig.PORT, () => {
    console.log(`Server started ${ServerConfig.PORT}`);
    if (process.env.DB_SYNC) {
      db.sequelize.sync({ alter: true });
    }
  });
};
prepareAndStartServer();
